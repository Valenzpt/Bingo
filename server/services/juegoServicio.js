//mdelos y servicio necesarios
const Partida = require('../Models/Partida.model');
const Tarjeta = require('../Models/Tarjeta.model');
const GeneradorServicio = require('./generadorServicio');
const {getIo} = require('../socket');
const salas = new Map(); //para almacenar los temporizadores de salar
const usuariosEnSala = new Map(); //para almacenar usuarios en cada sala
class JuegoServicio {
    /**
     * Inicia o une un usuario a una sala de espera del juego
     * @param {*} usuario que se une
     * @returns objeto que contiene la sala y los usuarios
     */
    static async iniciarUnirSala(usuario){
        let sala = await Partida.findOne({where: {estado: 'esperando'}});

        //si no existe la sala, se crea una nueva con estado esperando
        if(!sala) {
            sala = await Partida.create({
                estado: 'esperando', 
                balotasLanzadas:[]
            });
            this.iniciarTemporizador(sala); //inicializa el temporizador de la sala
        }else{
            console.log('uniendo usuario a sala existente------>>>>>', sala.id);
        }

        //aseguramos que exista un registro para los usuarios en la sala
        if(!usuariosEnSala.has(sala.id)){
            usuariosEnSala.set(sala.id, []);
        }

        const usuarios = usuariosEnSala.get(sala.id);

        const usuarioObj = {id: usuario.id, correo: usuario.username};
        //agrega el usuario sino esta ya en la sala
        if(!usuarios.find(u=> u.id===usuarioObj.id)){
            usuarios.push(usuarioObj);
            getIo().to(sala.id).emit('actualizarUsuarios', usuarios); // notifica a la sala os usuarios actualizados
        }

        return {sala, usuarios}; //devuelve sala y usuarios
    }

    /**
     * Inicia un temporizador para la sala de juego
     * @param {*} sala de juego para la que se inicializa el temporizador
     */
    static iniciarTemporizador(sala){
        let tiempoRestante = 30; //tiempo inicial en seg
        const temporizador = setInterval(async () => {
            if(tiempoRestante>0){
                getIo().to(sala.id).emit('actualizarTemporizador', { tiempoRestante });
                tiempoRestante--; //decrementa el tiempo restante
            }else{
                clearInterval(temporizador) //detiene el temporizador
                sala.estado = 'activo'; //cambia el estado de la partida a activo
                await sala.save(); //guarda los cambios en la base de datos
                const usuarios = usuariosEnSala.get(sala.id) || [];

                getIo().to(sala.id).emit('juegoComenzado', {
                    message: 'El juego ha comenzado',
                    usuarios,
                    salaId: sala.id
                });
                //this.iniciarLanzamiento(sala.id);
                usuariosEnSala.delete(sala.id); //elimina la lista de usuarios de la sala
            }
        }, 1000); //se ejecuta cada segundo
        salas.set(sala.id, temporizador); //almacena el temporizador en la sala
    }

    /**
     * Genera un tarjeton para un usuario en una partida especifica
     * @param {*} usuarioId 
     * @param {*} partidaId 
     * @returns numeros de la tarjeta generada
     */
    static async generarTarjeta(usuarioId, partidaId) {
        const numerosTarjeta = GeneradorServicio.generarTarjeton(); //Genera los numeros de la tarjeta
        const tarjeta = await Tarjeta.create({
            usuario_id: usuarioId, 
            partida_id: partidaId, 
            numeros: numerosTarjeta, 
            estado: 'activo'
        }); //crea la tarjeta en la base de datos
        return tarjeta.numeros; //devuelve los numeros de la tarjeta
    }

    /**
     * Lanza una balota en la partida especifica
     * @param {*} partidaId el id de la partida
     * @returns numero de la balota lanzada
     */
    static async lanzarBalota(partidaId){
        const partida = await Partida.findByPk(partidaId);
        if(!partida) throw new Error('Partida no encontrada'); //error si la partida no se encuentra
        
        const balotasLanzadas = partida.balotasLanzadas || [];
        if(balotasLanzadas.length>=75) throw new Error('Ya se sacaron todas las balotas'); //Error si ya se lanzaron todas las balotas
        
        const nuevaBalota = GeneradorServicio.lanzarBalota(balotasLanzadas); //lanza una nueva balota
        partida.balotasLanzadas = balotasLanzadas; //actualiza la lista de balotas lanzadas
        await Partida.update({balotasLanzadas}, {where: {id: partidaId}}); //guarda los cambios en la bd
        
        return nuevaBalota; //Devuelve nueva balota
    }
    
    /**
     * Servicio para iniciar el lanzamiento de balotas con un intervalo de 5 segundos
     * @param {*} partidaId 
     * @returns 
     */
   /*  static iniciarLanzamiento(partidaId){
        const intervalo = setInterval(async () => {
            try {
                const nuevaBalota = await this.lanzarBalota(partidaId);
                console.log('nueva balota lanzada: ', nuevaBalota);

                getIo().to(partidaId).emit('nuevaBalota', nuevaBalota);
            } catch (error) {
                console.log('Error al lanzar balota: ', error.message);
                clearInterval(intervalo);
            }
        }, 5000);
    } */

    /**
     * Verifica el ganador al ingresar los numeros de tarjeta y los seleccionados
     * @param {*} partidaId 
     * @param {*} usuarioId 
     * @param {*} seleccionados 
     * @returns 
     */
    static async verificarGanador(partidaId, usuarioId, seleccionados){
        //validaciones de existencia de partida y tarjeta
        const partida = await Partida.findByPk(partidaId);
        if(!partida) throw Error('Partida no encontrada');

        const tarjeta = await Tarjeta.findOne({
            where: {usuario_id: usuarioId, partida_id: partidaId}
        });

        if(!tarjeta) throw Error('Tarjeta no encontrada');

        //verifica el juego con los numeros de la tarjeta y los seleccionados
        const resultado = GeneradorServicio.verificarJuego(tarjeta.numeros, seleccionados);
        if(resultado === 'sin victoria'){
            await this.descalificarUsuario(partidaId, usuarioId); //descalifica el usuario si marco bingo sin completar alguna de las 4 formas
            return 'Descalificado';
        }else{
            //Se actualiza la partida a finalizada y se envia el socket de ganador
            await Partida.update({estado: 'finalizado'}, {where: {id: partidaId}});
            getIo().to(partidaId).emit('juegoTerminado', {
                mensaje: `Tenemos un ganador con ${resultado}!`,
                ganadorId: usuarioId
            })
        }
        return resultado;
    }

    /**
     * Descalifica el usuairo
     * @param {*} partidaId 
     * @param {*} usuarioId 
     */
    static async descalificarUsuario(partidaId, usuarioId){
        await Tarjeta.update(
            { estado: 'descalificado' },
            {where: { usuario_id: usuarioId, partida_id: partidaId}}
        );
        getIo().to(partidaId).emit('usuarioDescalificado', {usuarioId});
    }
}

module.exports = JuegoServicio;