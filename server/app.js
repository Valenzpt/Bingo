const express = require("express");
const http = require('http');
const bodyParser = require("body-parser");
const authenticateToken = require("./Middlewares/authMiddleware");
const cors = require("cors");
const {init} = require('./socket');

const corsOptions = {
    origin: 'http://localhost:8080',
    credentials: true,
};
//creamos app express
const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json()); //configuramos el bodyparser para recibir formato JSON


app.use(require('./Routes/usuarioRoutes')); //incluimos las rutas de usuario
app.use(require('./Routes/juegoRoutes')); //incluimos las rutas de juego

app.get("/api/home", authenticateToken, (req, res)=>{
    res.json({message: 'Bienvenido', username: req.usuario.username});
});

const server = http.createServer(app);
init(server);

//exportamos app express
module.exports =server;