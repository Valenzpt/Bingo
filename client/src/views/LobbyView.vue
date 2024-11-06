<template>
    <div>
        <h2>Lobby de Juego</h2>
        <h3>Partida id: {{ sala.id }}</h3>
        <p>Estado: {{ sala.estado }}</p>
        <p>temporizador: {{ tiempoRestante }}</p>
        <h4>Usuarios en sala</h4>
        <ul>
            <li v-for="usuario in usuarios" :key="usuario">{{ usuario.correo }}</li>
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

            this.sala = JSON.parse(this.$route.query.sala || {});
            this.usuarios = JSON.parse(this.$route.query.usuarios || {});
            if(!this.sala.id){
                console.log('Sala no definida o id no encontrado');
                return;
            }
            this.socket = io('http://localhost:3000', {
                transports: ['websocket']
            });
            this.socket.emit('unirSala', this.sala.id);
            this.socket.on('actualizarTemporizador', (data)=>{
                this.tiempoRestante = data.tiempoRestante;
            });
            this.socket.on('actualizarUsuarios', (data)=>{
                this.usuarios = data;
            });
            this.socket.on('juegoComenzado', (data)=>{
                this.$router.push({
                    path: `/juego/${data.salaId}`,
                    query: { usuarios: JSON.stringify(data.usuarios) }
                })
            })
        },
        beforeUnmount(){
            if(this.socket){
                this.socket.disconnect();
            }
        }
    }
</script>