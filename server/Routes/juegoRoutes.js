const express = require('express');
const JuegoController = require('../Controllers/juegoController');
const authenticateToken = require('../Middlewares/authMiddleware');
const router = express.Router();

router.post('/api/tarjeta', JuegoController.generarTarjeta);
router.post('/api/balota', JuegoController.lanzarBalota);
router.post('/api/verificarGanador', JuegoController.verificarJuego);
router.post('/api/iniciarSala', authenticateToken, JuegoController.iniciarUnirSala);

module.exports = router;