const JuegoServicio = require('../services/juegoServicio');

class JuegoController {
    static async iniciarUnirSala(req, res) {
        
        const usuarioId = req.usuario.id;
        try {
            const {sala, usuarios} = await JuegoServicio.iniciarUnirSala(usuarioId);
            return res.status(200).json({message: 'Te has unido a la sala', sala, usuarios})
        } catch (error) {
            res.status(500).json({error: 'Error al iniciar o unirse a la sala'})
        }
    }
    // Método adicional para generar tarjetas 
    static async generarTarjeta(req, res) {
        try {
            console.log('entro aqui', req.body);
            const { usuarioId, partidaId } = req.body;
            if (!partidaId) {
                return res.status(400).json({ error: 'Partida requerida' });
            }
            if (!usuarioId) {
                return res.status(400).json({ error: 'Usuario requerido' });
            }
            const tarjeta = await JuegoServicio.generarTarjeta(usuarioId, partidaId);
            res.json({ tarjeta });
        } catch (error) {
            res.status(500).json({ error: 'Error al generar tarjetón' });
        }
    }
    static async lanzarBalota(req, res) {
        try {
            const { partidaId } = req.body;
            if(!partidaId){
                return res.status(400).json({error: 'Partida requerido'})
            }
            const nuevaBalota = await JuegoServicio.lanzarBalota(partidaId);
            res.json({balota: nuevaBalota});
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }
    static async verificarJuego(req, res){
        
    }
}

module.exports = JuegoController;