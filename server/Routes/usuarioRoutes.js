const express = require("express");
const usuario = require("../Controllers/usuarioController");
const router = express.Router();

router.post("/api/register", usuario.create);
router.post("/api/login", usuario.login);

module.exports = router;