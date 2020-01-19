import axios from 'axios';
//acesso a API Backend
const api = axios.create({
    baseURL: 'http://localhost:3333/'
})

export default api;