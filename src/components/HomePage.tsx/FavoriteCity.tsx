'use client'

import { ReactElement } from "react";
import { CardWeather } from "./CardWeather";
import { weather } from "@/types/weather";
import { useCurrentWeather } from "@/hooks/weathers/useCurrentWeather";

type props = {
    city: string;
    cityId: number;
}
export function FavoriteCity({ city, cityId }: props): ReactElement {
    const emptyData: weather = {}
    const { data, isLoading, refetch, isError } = useCurrentWeather(city)

    function onReset(): void {
        refetch()
    }

    return <CardWeather weather={data?.data?.weather ?? emptyData} location={data?.data?.location} cityId={cityId} showDeleteBtn loading={isLoading} isError={isError} onReset={onReset} />
}