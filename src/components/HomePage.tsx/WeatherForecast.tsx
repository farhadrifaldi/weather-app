'use client'

import { Col, Row, Spin, Typography } from "antd";
import { ReactElement } from "react";
import { CardWeather } from "./CardWeather";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { WeatherForecastResponse } from "@/modules/weather/type";

function getData(city: string): Promise<AxiosResponse<WeatherForecastResponse>> {
    return axios.get('/api/weather-forecast', {
        params: {
            city: city
        }
    })
}

type props = {
    city: string;
}
export function WeatherForecast({ city }: props): ReactElement {
    const { data, isLoading } = useQuery({ queryKey: ['weather-forecast', city], queryFn: () => getData(city) })
    
    return <>
        <Typography.Title level={3}>Weather Forecast</Typography.Title>

        <Spin spinning={isLoading}>
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <CardWeather weather={data?.data?.weather ?? {}} location={data?.data?.location} showFavoriteBtn />
                </Col>
                {data?.data.forecast.map((forecast, idx) => {
                    return <Col span={8} key={idx}><CardWeather weather={forecast.weather} date={forecast.date} /></Col>
                })}
            </Row>
        </Spin>
    </>
}