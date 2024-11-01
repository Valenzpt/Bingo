<template>
    
    <form @submit.prevent="handleLogin" class="bg-ligth p-4 rounded shadow">
        <div class="mb-3">
            <label for="username" class="form-label">Nombre de usuario:</label>
            <input type="text" v-model="username" class="form-control" id="username" required />
        </div>
        <div class="mb-3">
            <label for="password" class="form-label">Contraseña:</label>
            <input type="password" class="form-control" v-model="password" id="password" required/>
        </div>
        <button type="submit" class="btn btn-primary">Login</button>
    </form>
    <p class="mt-3 text-center">No tienes cuenta? <RouterLink to="/register" class="link-primary">Regístrate aquí</RouterLink></p>
</template>
<script>
import axios from '../api';

export default {
    data() {
        return {
            username: '',
            password: '',
        };
    },
    methods: {
        async handleLogin() {
            try {
                const response = await axios.post('/login', {
                    username: this.username,
                    password: this.password
                });
                if(response.status==200){
                    //agrego el token al localstorage
                    localStorage.setItem('token', response.data.token);
                    this.$router.push('/home');
                }
            } catch (error) {
                console.log(error)
            }
        }
    }
}
</script>