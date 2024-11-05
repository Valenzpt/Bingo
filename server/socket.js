const {Server} = require('socket.io');

let io;

function init(server) {
    io = new Server(server, {
        cors: {
            origin: 'http://localhost:8080',
            credentials: true,
        }
    });

    io.on('connection', (socket)=>{
        console.log('nuevo usuario conectadooxxxxxxxxxxxxxxxxxx', socket.id);

        socket.on('iniciarJuego', (sala)=>{
            socket.join(sala);
            console.log(`usuario coenctado ${socket.id} a sala ${sala}`);
            io.to(sala).emit('juegoComenzado', {message: 'El juego ha comenzado'});
        });
    });
}

function getIo(){
    if(!io){
        throw new Error("Socket no iniciado");
    }
    return io;
}

module.exports = {init, getIo};