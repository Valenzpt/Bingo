const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const authenticateToken = require("./Middlewares/authMiddleware");
//creamos app express
const app = express();

app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true,
}));
app.use(bodyParser.json()); //configuramos el bodyparser para recibir formato JSON


app.use(require('./Routes/usuarioRoutes')); //incluimos las rutas de usuario
app.use(require('./Routes/juegoRoutes')); //incluimos las rutas de juego

app.get("/api/home", authenticateToken, (req, res)=>{
    res.json({message: 'Bienvenido', username: req.usuario.username});
});
//exportamos app express
module.exports =app;