<template>
  <div id="app">
    <NavbarComponent v-if="isAuthenticated" />
    <RouterView/>
  </div>
</template>

<script>
import NavbarComponent from './components/NavbarComponent.vue';
export default {
  name: 'App',
  components: {
    NavbarComponent,
  },
  computed: {
    isAuthenticated(){
      return !!localStorage.getItem('token'); //devuelve true si hay existe el token
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
