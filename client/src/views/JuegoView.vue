<template>
    <div class="container my-4">
        <h4>Juego en sala: {{ salaId }}</h4>
        <div v-if="juegoTerminado">
            <h2>Tenemos un ganador!</h2>
            <p>EL usuario {{ ganador }}</p>
        </div>
        <div v-else class="row mb-4">
            <div class="col-md-8">
                <div class="row mb-3">
                    <div class="col">
                        <h3>Última balota lanzada</h3>
                        <div class="ultima-balota">
                            {{ ultimaBalota !==null ? ultimaBalota: "Esperando balotas..." }}
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-8">
                        <table class="bingo-card">
                            <thead>
                                <tr>
                                    <th v-for="(col, letra) in tarjeta" :key="letra">{{ letra }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="i in 5" :key="i">
                                    <td 
                                        v-for="(col, letra) in tarjeta" 
                                        :key="letra + i" 
                                        :class="{'selected': isSelected(letra, i -1)}"
                                        @click="toggleSelection(letra, i-1)"
                                    >
                                        {{ tarjeta[letra][i-1] }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="col-md-4 d-flex justify-content-start align-items-center">
                        <button class="btn btn-primary" @click="verificarBingo">¡Bingo!</button>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <h3>Usuarios en sala</h3>
                <ul class="list-group">
                    <li v-for="usuario in usuarios" :key="usuario" class="list-group-item">{{ usuario.correo }}</li>
                </ul>
            </div>
        </div>
        
    </div>
</template>
<script>
import api from '@/api';
import { jwtDecode } from 'jwt-decode';
import { io } from 'socket.io-client';
export default {
    data() {
        return {
            salaId: '',
            usuarios: [],
            socket: null,
            tarjeta: null,
            seleccionados: {},
            ultimaBalota: null,
            balotaInterval: null,
            ganador: null,
            juegoTerminado: false
        };
    },
    async mounted() {
        const decodeTk = jwtDecode(localStorage.getItem('token'));
        const {salaId} = this.$route.params;
        this.salaId = salaId;
        this.usuarios = JSON.parse(this.$route.query.usuarios || {});


        this.socket = io('http://localhost:3000', {
            transports: ['websocket']
        });

        this.socket.emit('unirSala', this.salaId);
        
        this.socket.on('usuarioDescalificado', ({usuarioId})=>{
            if(usuarioId===decodeTk.id){
                clearInterval(this.balotaInterval);
                alert('Has sido descalificado');
                this.$router.push('/home');
            }
        });
        this.socket.on('juegoTerminado', ({mensaje, ganadorId})=>{
            const ganador = this.usuarios.find(u=>u.id===ganadorId);
            this.ganador = ganador.correo;
            this.juegoTerminado = true;
            clearInterval(this.balotaInterval);
            alert(mensaje);
        });

        const response = await api.post('/tarjeta', {
            partidaId: this.salaId,
            usuarioId: decodeTk.id
        });

        this.tarjeta = response.data.tarjeta;
        this.initSeleccionados();
        this.iniciarLanzamiento();
        
    },
    beforeUnmount(){
        clearInterval(this.balotaInterval);
    },
    methods: {
        initSeleccionados() {
            for(const letra in this.tarjeta){
                this.seleccionados[letra] = this.tarjeta[letra].map(()=>false);
            }
        },
        toggleSelection(letra, index){
            this.seleccionados[letra][index] = !this.seleccionados[letra][index];
        },
        isSelected(letra, index){
            return this.seleccionados[letra]?.[index];
        },
        async verificarBingo(){
            const decodeTk = jwtDecode(localStorage.getItem('token'));
            const usuarioId = decodeTk.id;
            try {
                const response = await api.post('/verificarGanador', {
                    partidaId: this.salaId,
                    usuarioId: usuarioId,
                    seleccionados: this.seleccionados
                });
                // alert(response.data.mensaje);
                if(response.data.mensaje.includes('Felicidades')) {
                    alert(response.data.mensaje);
                    console.log('juego terminado', this.juegoTerminado, this.ganador);
                }
            } catch (error) {
                console.log(error)
                alert('Hubo un problema al verificar el bingo', error);
            }
        },
        iniciarLanzamiento(){
            this.balotaInterval = setInterval(async () => {
                try {
                    /* this.socket.on('nuevaBalota', (balota)=>{
                        console.log('balota lanzada', balota);
                        this.ultimaBalota = balota;
                    }); */
                    const response = await api.post('/balota', {
                        partidaId: this.salaId,
                    });
                    this.ultimaBalota = response.data.balota;
                    console.log('Balota lanzada', this.ultimaBalota);
                } catch (error) {
                    console.log('Error al lanzar la balota: ', error);
                    clearInterval(this.balotaInterval);
                    return;
                }
            }, 5000);
        }
    }
}
</script>
<style scoped>
    bingo-card {
        border-collapse: collapse;
        width: 100%;
        max-width: 300px;
        text-align: center;
    }

    .bingo-card th, 
    .bingo-card td {
        border: 1px solid #ccc;
        padding: 10px;
        cursor: pointer;
    }

    .bingo-card td.selected {
        background-color: #f0f0f0;
        color: red;
        text-decoration: line-through;
    }
    .ultima-balota {
        font-size: 1.5em;
        font-weight: bold;
        margin-bottom: 10px;
    }
</style>