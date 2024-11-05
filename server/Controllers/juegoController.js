const JuegoServicio = require('../services/juegoServicio');

class JuegoController {
    /**
     * Controlador para iniciar o unir un usuario a la sala
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async iniciarUnirSala(req, res) {
        
        const correo = req.usuario.username; //obtiene el correo del usuario de la solicitud
        try {
            const {sala, usuarios} = await JuegoServicio.iniciarUnirSala(correo); //une el usuario a la sala
            return res.status(200).json({message: 'Te has unido a la sala', sala, usuarios})
        } catch (error) {
            res.status(500).json({error: 'Error al iniciar o unirse a la sala'})
        }
    }
    /**
     * Controlador para generar un tarjeton para un usuario
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async generarTarjeta(req, res) {
        try {
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
    /**
     * controlador para lanzar una balota en la partida
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
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