const {Server} = require('socket.io');

let io;

<<<<<<< HEAD
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

=======
/**
 * inicializo el servidor de websocket
 * @param {*} server servidor http al que se adjunta el socket 
 */
function init(server) {
    io = new Server(server, {
        cors: {
            origin: 'http://localhost:8080', //permite solicitudes desde la direccion del front
            credentials: true, //habilita el uso de credenciales
        }
    });

    //evento que se activa cuando un cliente se conecta
    io.on('connection', (socket)=>{
        //evento para unir un usuario a una sala
        socket.on('unirSala', (sala)=>{
            socket.join(sala); //unimos el usuario a la sala
            console.log(`usuario conectado ${socket.id} a sala ${sala}`); 
        });
    });
}
/**
 * Obtiene la instancia del servidor websocket
 * @returns la instancia de socket.io
 */
>>>>>>> main
function getIo(){
    if(!io){
        throw new Error("Socket no iniciado");
    }
    return io;
}

module.exports = {init, getIo};