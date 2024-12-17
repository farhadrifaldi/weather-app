'use client'

import { Col, Row, Spin, Typography } from "antd";
import { ReactElement } from "react";
import { FavoriteCity } from "./FavoriteCity";
import { useGetCity } from "@/hooks/city/useGetCity";

export function FavoriteCities(): ReactElement {
    const { data, isLoading } = useGetCity()
    const cities = data?.data?.map((v) => {
        return {
            id: v.id,
            name: v.name
        }
    }) ?? []

    return <>
        <Typography.Title level={3}><span style={{ textTransform: 'capitalize' }}>Favorite Cities</span> Weather</Typography.Title>
        <Spin spinning={isLoading}>
            <Row gutter={[20, 20]}>
                {cities.map((city, idx) => {
                    return <Col span={8} key={idx}><FavoriteCity city={city.name} key={idx} cityId={city.id} /></Col>
                })}
            </Row>
        </Spin>
    </>
}