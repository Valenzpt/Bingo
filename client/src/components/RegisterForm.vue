<template>
    <form @submit.prevent="handleRegister">
        <div>
            <label for="nombre">Nombre:</label>
            <input type="text" v-model="nombre" id="nombre" required />
        </div>
        <div>
            <label for="username">Nombre de usuario:</label>
            <input type="text" v-model="username" id="username" required />
        </div>
        <div>
            <label for="password">Contraseña:</label>
            <input type="password" v-model="password" id="password" required />
        </div>
        <button type="submit">Registrar</button>
    </form>
</template>
<script>
import axios from '../api';

export default {
    data() {
        return {
            nombre: '',
            username: '',
            password: '',
        };
    },
    methods: {
        async handleRegister() {
            try {
                const response = await axios.post('/register', {
                    nombre: this.nombre,
                    username: this.username,
                    password: this.password,
                });
                if(response.status==200){
                    this.$router.push('/login');
                }
            } catch (error) {
                console.log(error)
            }
        },
        limpiar() {
            this.username = '';
            this.nombre= '';
            this.password= '';
        }
    }
};
</script>