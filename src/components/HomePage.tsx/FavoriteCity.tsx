'use client'

import { ReactElement } from "react";
import { CardWeather } from "./CardWeather";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { weather, WeatherResponse } from "@/modules/weather/type";

function getData(city: string): Promise<AxiosResponse<WeatherResponse>> {
    return axios.get('/api/weather-current', {
        params: {
            city: city
        }
    })
}

type props = {
    city: string;
    cityId: number;
}
export function FavoriteCity({ city, cityId }: props): ReactElement {
    const emptyData: weather = {}
    const { data, isLoading } = useQuery({ queryKey: ['weather-current', city], queryFn: () => getData(city) })

    return <CardWeather weather={data?.data?.weather ?? emptyData} location={data?.data?.location} cityId={cityId} showDeleteBtn loading={isLoading} />
}