import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

type payload = {
    cityId: number
}
const deleteCity = async ({ cityId }: payload) => {
    return axios.delete('/api/cities', {
        params: {
            cityId: cityId
        }
    })
};

export const useDeleteCity = () => {
    return useMutation({ mutationFn: (payload: payload) => deleteCity(payload) });
};