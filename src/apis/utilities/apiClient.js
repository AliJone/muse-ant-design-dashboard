import axios from 'axios';
import Cookies from 'universal-cookie';

const apiClient = axios.create({
    baseURL: 'https://076c-103-18-12-213.ngrok-free.app',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

const cookies = new Cookies();

apiClient.interceptors.request.use((config) => {
    const token = cookies.get('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['ngrok-skip-browser-warning'] = 'true';
    return config;
}, (error) => {
    return Promise.reject(error);
});

export { apiClient };