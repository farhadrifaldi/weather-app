import axios, { AxiosResponse } from "axios";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

function getData(): Promise<AxiosResponse<{ name: string; id: number }[]>> {
    return axios.get('/api/cities')
}

export function useGetCity() {
    const { data: session } = useSession();

    return useQuery({
        queryKey: ['get-cities'], queryFn: getData, staleTime: Infinity, enabled: Boolean(session)
    })
}