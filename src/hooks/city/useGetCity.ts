import axios, { AxiosResponse } from "axios";
import { useQuery } from "@tanstack/react-query";

function getData(): Promise<AxiosResponse<{ name: string; id: number }[]>> {
    return axios.get('/api/cities')
}

export function useGetCity() {
    return useQuery({ queryKey: ['get-cities'], queryFn: getData })
}