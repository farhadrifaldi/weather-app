import { WeatherResponse } from "@/modules/weather/type";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";

function getData(city: string): Promise<AxiosResponse<WeatherResponse>> {
    return axios.get('/api/weather-current', {
        params: {
            city: city
        }
    })
}

export function useCurrentWeather(city: string) {
    return useQuery({ queryKey: ['weather-current', city], queryFn: () => getData(city), staleTime: Infinity })
}