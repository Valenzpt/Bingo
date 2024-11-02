const JuegoServicio = require('../services/juegoServicio');

class JuegoController {
   
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