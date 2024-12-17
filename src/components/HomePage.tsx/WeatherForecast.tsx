'use client'

import { Col, Row, Spin, Typography } from "antd";
import { ReactElement } from "react";
import { CardWeather } from "./CardWeather";
import { useWeatherForecast } from "@/hooks/weathers/useWeatherForecast";

type props = {
    city: string;
}
export function WeatherForecast({ city }: props): ReactElement {
    const { data, isLoading, refetch, isError } = useWeatherForecast(city)

    function onReset(): void {
        refetch()
    }

    return <>
        <Typography.Title level={3}>Weather Forecast</Typography.Title>

        <Spin spinning={isLoading}>
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <CardWeather weather={data?.data?.weather ?? {}} location={data?.data?.location} showFavoriteBtn onReset={onReset} isError={isError} />
                </Col>
                {data?.data.forecast.map((forecast, idx) => {
                    return <Col span={8} key={idx}><CardWeather weather={forecast.weather} date={forecast.date} onReset={onReset} isError={isError} /></Col>
                })}
            </Row>
        </Spin>
    </>
}