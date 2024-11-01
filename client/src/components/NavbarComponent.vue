<template>
    <nav v-if="isLoggedIn" class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="navbar-brand">Bingo Game</div>
        <div class="collapse navbar-collapse">
            <RouterLink class="nav-link" to="/home">Home</RouterLink>
            <button @click="logout" class="btn btn-outline-danger">Cerrar sesión</button>
        </div>
    </nav>
</template>
<script>
export default {
    computed: {
        isLoggedIn() {
            return !!localStorage.getItem('token');
        }
    },
    methods: {
        logout() {
            //elimina el token del localstorage al cerrar sesion
            localStorage.removeItem('token');
            this.$router.push("/login");
        }
    }
}
</script>