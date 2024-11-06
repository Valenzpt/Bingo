const JuegoServicio = require('../services/juegoServicio');

class JuegoController {
    /**
     * Controlador para iniciar o unir un usuario a la sala
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async iniciarUnirSala(req, res) {
        
        const usuario = req.usuario; //obtiene el correo del usuario de la solicitud
        try {
            const {sala, usuarios} = await JuegoServicio.iniciarUnirSala(usuario); //une el usuario a la sala
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
    /**
     * controlador para verificar si el usuario ha ganado
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async verificarJuego(req, res){
        const { partidaId, usuarioId, seleccionados } = req.body;
        try {
            const resultado = await JuegoServicio.verificarGanador(partidaId, usuarioId, seleccionados);
            if(resultado === 'Descalificado'){
                return res.status(200).json({mensaje: 'Descalificado por declarar bingo incorrectamente'});
            }else{
                return res.status(200).json({mensaje: `Felicidades has ganados con: ${resultado}`});
            }
        } catch (error) {
            return res.status(500).json({Mensaje: 'Hubo un error al verificar el Bingo', error});
        }
    }
}

module.exports = JuegoController;