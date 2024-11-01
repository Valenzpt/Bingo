<template>
    <div class="container mt-5">
        
        <h2 class="text-center">Iniciar Sesión</h2>
        <LoginForm />
    </div>
</template>
<script>
import LoginForm from '@/components/LoginForm.vue';
export default {
    components: {
        LoginForm
    }
}
</script>