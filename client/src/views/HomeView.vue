<template>
    <div>
        <h2>{{mensaje}} </h2> <h3> {{ username }}!!</h3> 
    </div>
</template>
<script>
import api from '@/api';
// import { jwtDecode } from 'jwt-decode';
export default {
    data(){
        return {
            username: '',
            mensaje: '',
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
    }
}
</script>