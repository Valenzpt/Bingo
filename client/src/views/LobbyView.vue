<template>
    <div>
        <h2>Lobby de Juego</h2>
        <h3>PArtida id: {{ sala.id }}</h3>
        <p>Estado: {{ sala.estado }}</p>
        <p>temporizador: {{ tiempoRestante }}</p>
        <h4>Usuarios en sala</h4>
        <ul>
            <li v-for="usuario in usuarios" :key="usuario">{{ usuario }}</li>
        </ul>
    </div>
</template>
<script>
   
    import { io } from 'socket.io-client';

    export default {
        data() {
            return {
                sala: {},
                usuarios: [],
                socket: null,
                tiempoRestante: 30,
            };
        },
        async mounted() {
            //const salaId = this.$route.params.id;

            this.sala = JSON.parse(this.$route.query.sala || {});
            this.usuarios = JSON.parse(this.$route.query.usuarios || {});
            if(!this.sala.id){
                console.log('Sala no definida o id no encontrado');
                return;
            }
            this.socket = io('http://localhost:3000', {
                transports: ['websocket']
            });
            this.socket.on('connect', () => {
                console.log('socket conectado----SSSSSS', this.socket.id);
            });
            this.socket.on('actualizarTemporizador', (data)=>{
                console.log('tiempo restante', data.tiempoRestante);
                this.tiempoRestante = data.tiempoRestante;
            });
            this.socket.on('juegoComenzado', (data)=>{
                console.log('ha comenzado en fronnnnn.---------');
                console.log(data.message);
            })
            this.socket.emit('iniciarJuego', this.sala.id);
        },
        beforeUnmount(){
            if(this.socket){
                this.socket.disconnect();
            }
        }
    }
</script>