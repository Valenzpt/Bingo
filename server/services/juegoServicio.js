<<<<<<< HEAD
=======
//mdelos y servicio necesarios
>>>>>>> main
const Partida = require('../Models/Partida.model');
const Tarjeta = require('../Models/Tarjeta.model');
const GeneradorServicio = require('./generadorServicio');
const {getIo} = require('../socket');
<<<<<<< HEAD
const salas = new Map();
const usuariosEnSala = new Map();
class JuegoServicio {
    static async iniciarUnirSala(usuarioId){
        let sala = await Partida.findOne({where: {estado: 'esperando'}});
=======
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
>>>>>>> main
        if(!sala) {
            sala = await Partida.create({
                estado: 'esperando', 
                balotasLanzadas:[]
            });
<<<<<<< HEAD
            this.iniciarTemporizador(sala);
        }else{
            console.log('uniendo usuario a sala existente------>>>>>', sala.id);
        }
        if(!usuariosEnSala.has(sala.id)){
            usuariosEnSala.set(sala.id, []);
        }
        usuariosEnSala.get(sala.id).push(usuarioId);
        return {sala, usuarios: usuariosEnSala.get(sala.id)};
    }
    static iniciarTemporizador(sala){
        let tiempoRestante = 30;
=======
            this.iniciarTemporizador(sala); //inicializa el temporizador de la sala
        }else{
            console.log('uniendo usuario a sala existente------>>>>>', sala.id);
        }

        //aseguramos que exista un registro para los usuarios en la sala
        if(!usuariosEnSala.has(sala.id)){
            usuariosEnSala.set(sala.id, []);
        }

        const usuarios = usuariosEnSala.get(sala.id);
        //agrega el usuario sino esta ya en la sala
        if(!usuarios.includes(usuario)){
            usuarios.push(usuario);
            getIo().to(sala.id).emit('actualizarUsuarios', usuarios); // notifica a la sala os usuarios actualizados
        }else{
            throw new Error('El usuario ya está en la sala');
        }

        return {sala, usuarios}; //devuelve sala y usuarios
    }

    /**
     * Inicia un temporizador para la sala de juego
     * @param {*} sala de juego para la que se inicializa el temporizador
     */
    static iniciarTemporizador(sala){
        let tiempoRestante = 30; //tiempo inicial en seg
>>>>>>> main
        const temporizador = setInterval(async () => {
            if(tiempoRestante>0){
                console.log('tiempo restante', tiempoRestante, 'en sala.........', sala.id);
                getIo().to(sala.id).emit('actualizarTemporizador', { tiempoRestante });
<<<<<<< HEAD
                tiempoRestante--;
            }else{
                clearInterval(temporizador)
                sala.estado = 'activo';
                await sala.save();
                usuariosEnSala.delete(sala.id);
                getIo().to(sala.id).emit('juegoComenzado', {message: 'El juego ha comenzado'});
            }
        }, 1000);
        salas.set(sala.id, temporizador);
    }
    static async generarTarjeta(usuarioId, partidaId) {
        const numerosTarjeta = GeneradorServicio.generarTarjeton();
        const tarjeta = await Tarjeta.create({usuario_id: usuarioId, partida_id: partidaId, numeros: numerosTarjeta, estado: 'activo'});
        return tarjeta.numeros;
    }
    static async lanzarBalota(partidaId){
        const partida = await Partida.findByPk(partidaId);
        if(!partida) throw new Error('Partida no encontrada');
        
        const balotasLanzadas = partida.balotasLanzadas || [];
        if(balotasLanzadas.length>=75) throw new Error('Ya se sacaron todas las balotas');
        
        const nuevaBalota = GeneradorServicio.lanzarBalota(balotasLanzadas);
        partida.balotasLanzadas = balotasLanzadas;
        await Partida.update({balotasLanzadas}, {where: {id: partidaId}});
        return nuevaBalota;
    }
    
=======
                tiempoRestante--; //decrementa el tiempo restante
            }else{
                clearInterval(temporizador) //detiene el temporizador
                sala.estado = 'activo'; //cambia el estado de la partida a activo
                await sala.save(); //guarda los cambios en la base de datos
                usuariosEnSala.delete(sala.id); //elimina la lista de usuarios de la sala
                getIo().to(sala.id).emit('juegoComenzado', {message: 'El juego ha comenzado'});
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
    
    
>>>>>>> main
    static async verificarGanador(){

    }
}

module.exports = JuegoServicio;