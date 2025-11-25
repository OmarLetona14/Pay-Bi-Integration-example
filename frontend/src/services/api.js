import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const createPayment = async (amount) => {
    try {
        const response = await api.post('/api/create-payment', { amount });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Error creating payment');
    }
};

export default api;
