import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

type payload = {
    name: string
}
const addCity = async ({ name }: payload) => {
    return axios.post('/api/cities', {
        name: name
    })
};

export const useAddCity = () => {
    return useMutation({ mutationFn: (payload: payload) => addCity(payload) });
};