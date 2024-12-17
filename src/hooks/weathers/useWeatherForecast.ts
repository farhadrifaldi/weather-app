import { WeatherForecastResponse } from "@/modules/weather/type"
import { useQuery } from "@tanstack/react-query"
import axios, { AxiosResponse } from "axios"

function getData(city: string): Promise<AxiosResponse<WeatherForecastResponse>> {
    return axios.get('/api/weather-forecast', {
        params: {
            city: city
        }
    })
}

export function useWeatherForecast(city: string) {
    return useQuery({ queryKey: ['weather-forecast', city], queryFn: () => getData(city) })
}