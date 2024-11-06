import { createRouter, createWebHistory } from 'vue-router';
import LoginView from './views/LoginView.vue';
import RegisterView from './views/RegisterView.vue';
import HomeView from './views/HomeView.vue';
import LobbyView from './views/LobbyView.vue';
import JuegoView from './views/JuegoView.vue';
const routes = [
    {
        path: '/',
        redirect: 'home',
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginView,
    },
    {
        path: '/register',
        name: 'Register',
        component: RegisterView,
    },
    {
        path: '/home',
        name: 'Home',
        component: HomeView,
        meta: { requiresAuth: true}
    },
    {
        path: '/lobby/:id',
        name: 'Lobby',
        component: LobbyView,
        props: true
    },
    {
        path: '/juego/:salaId',
        name: 'Juego',
        component: JuegoView,
        props: true
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});
router.beforeEach((to, from, next)=>{
    const token = localStorage.getItem('token');

    if(to.matched.some(record=> record.meta.requiresAuth) && !token) {
        next({name :'Login'});
    }else{
        next();
    }
})
export default router;