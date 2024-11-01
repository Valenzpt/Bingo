import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});
//interceptor para agregar el token en cada solicitud
api.interceptors.request.use(
    (config)=>{
        const token = localStorage.getItem('token');
        //si existe el token se añade a la cabecera de autorizacion
        if(token){
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error)=>{
        return Promise.reject(error);
    }
)

export default api;