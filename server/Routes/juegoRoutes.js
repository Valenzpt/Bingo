const express = require('express');
const JuegoController = require('../Controllers/juegoController');
const router = express.Router();

router.post('/api/tarjeta', JuegoController.generarTarjeta);
router.post('/api/balota', JuegoController.lanzarBalota);
router.post('/api/verificarGanador', JuegoController.verificarJuego);

module.exports = router;