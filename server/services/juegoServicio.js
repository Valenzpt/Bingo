const Partida = require('../Models/Partida.model');
const Tarjeta = require('../Models/Tarjeta.model');
const GeneradorServicio = require('./generadorServicio');

class JuegoServicio {
    
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