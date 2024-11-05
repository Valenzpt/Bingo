<template>
    <div>
        <h2>{{mensaje}} </h2> <h3> {{ username }}!!</h3> 
        <button @click="iniciarUnirLobby">Iniciar</button>
    </div>
</template>
<script>
import api from '@/api';
// import { jwtDecode } from 'jwt-decode';
export default {
    data(){
        return {
            username: '',
            mensaje: ''
        }
    },
    async mounted(){
        try {
            const token = localStorage.getItem('token');
            if(!token){
                this.$router.push('/login');
            }else{
                const response = await api.get('/home');
                this.mensaje = response.data.message;
                this.username = response.data.username;
            }
        } catch (error) {
            console.log('error al obtener token');
            this.$router.push('/login');
        }
    },
    methods: {
        async iniciarUnirLobby(){
            try {
                const respuesta = await api.post('/iniciarSala');
                //redirigir al loby
                if(respuesta.data.sala.id){
                    this.$router.push({
                        name: 'Lobby', 
                        params: {id: respuesta.data.sala.id}, 
                        query: {
                            sala: JSON.stringify(respuesta.data.sala), 
                            usuarios: JSON.stringify(respuesta.data.usuarios)
                        }
                    })
                }
                
            } catch (error) {
                console.log('error al iniciar', error);
            }
            
        }
    },
    beforeUnmount(){
        if(this.socket){
            this.socket.disconnect();
        }
    }
}
</script>