const Partida = require('../Models/Partida.model');
const Tarjeta = require('../Models/Tarjeta.model');
const GeneradorServicio = require('./generadorServicio');
const {getIo} = require('../socket');
const salas = new Map();
const usuariosEnSala = new Map();
class JuegoServicio {
    static async iniciarUnirSala(usuarioId){
        let sala = await Partida.findOne({where: {estado: 'esperando'}});
        if(!sala) {
            sala = await Partida.create({
                estado: 'esperando', 
                balotasLanzadas:[]
            });
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
        const temporizador = setInterval(async () => {
            if(tiempoRestante>0){
                console.log('tiempo restante', tiempoRestante, 'en sala.........', sala.id);
                getIo().to(sala.id).emit('actualizarTemporizador', { tiempoRestante });
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
    
    static async verificarGanador(){

    }
}

module.exports = JuegoServicio;