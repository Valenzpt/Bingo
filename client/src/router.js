import { createRouter, createWebHistory } from 'vue-router';
import LoginView from './views/LoginView.vue';
import RegisterView from './views/RegisterView.vue';
import HomeView from './views/HomeView.vue';
import LobbyView from './views/LobbyView.vue';

const routes = [
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
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;