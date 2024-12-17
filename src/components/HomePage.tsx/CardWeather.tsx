'use client'

import { useAddCity } from "@/hooks/city/useAddCity";
import { useDeleteCity } from "@/hooks/city/useDeleteCity";
import { useGetCity } from "@/hooks/city/useGetCity";
import { Location, weather } from "@/modules/weather/type";
import { Button, Card, Flex, Tooltip, Typography } from "antd";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { ReactElement } from "react";
import { FaRegStar, FaStar, FaSync, FaTrash, FaWind } from "react-icons/fa";
import { WiHumidity } from "react-icons/wi";

type props = {
    weather: weather,
    location?: Location,
    date?: string;
    showFavoriteBtn?: boolean;
    showDeleteBtn?: boolean;
    cityId?: number;
    loading?: boolean;
    onReset?: () => void;
    isError?: boolean;
}
export function CardWeather({ weather, location, date, showFavoriteBtn = false, showDeleteBtn = false, cityId, loading = false, onReset, isError = false }: props): ReactElement {
    const { data: session } = useSession();
    const { mutateAsync: mutateAdd } = useAddCity()
    const { mutateAsync: mutateDelete } = useDeleteCity()
    const { data, refetch } = useGetCity()
    const cities = data?.data?.map((v) => v.name) ?? []


    function renderMain(): ReactElement {
        return <>
            {showFavoriteBtn && session ?
                <Flex justify="end">
                    <Tooltip placement="topLeft" title="Add to your favorite city" trigger="hover">
                        <Button type="text" style={{ position: "absolute" }} onClick={() => {
                            if (!cities.includes(location?.name ?? '')) {
                                mutateAdd({ name: location?.name ?? '' }).then(() => {
                                    refetch()
                                })
                            }
                        }}>
                            {cities.includes(location?.name ?? '') ? <FaStar size={20} style={{ color: 'yellow' }} /> : <FaRegStar size={20} />}
                        </Button>
                    </Tooltip>
                </Flex> : null}
            {showDeleteBtn && session ?
                <Flex justify="end">
                    <Tooltip placement="topLeft" title="Delete favorite city" trigger="hover">
                        <Button type="text" style={{ position: "absolute", left: 0, top: 5 }} onClick={() => {
                            if (cityId) {
                                mutateDelete({ cityId: cityId }).then(() => {
                                    refetch()
                                })
                            }
                        }}>
                            <FaTrash size={13} style={{ color: '#ff4d4d' }} />
                        </Button>
                    </Tooltip>
                </Flex> : null}
            {date ? <Typography style={{
                fontSize: 22,
            }}>
                {dayjs(date).format('dddd')}
            </Typography> : <></>}
            {location?.name ? (<Typography style={{
                fontSize: 22,
            }}>
                {location?.name}
            </Typography>) : <></>}

            <Typography style={{
                fontSize: 30,
                fontWeight: '500',
            }}>
                {weather.temp_c}&deg;C
            </Typography>
            {weather.condition?.icon ? <Flex justify="center">
                <Image src={weather.condition?.icon ?? ''} alt={"Icon"} width={20} height={20} />
                <Typography>
                    {weather.condition?.text}
                </Typography>
            </Flex> : null}

            <Flex justify="center">
                <Typography style={{
                    display: "flex",
                    alignItems: 'center'
                }}>
                    <FaWind style={{
                        marginRight: "2px"
                    }} />
                    <span>{weather.wind_mph} mph</span>
                </Typography>
                <span style={{ margin: "0 10px" }}>|</span>
                <Typography style={{
                    display: "flex",
                    alignItems: 'center'
                }}>
                    <WiHumidity size={20} />
                    <span>{weather.humidity}%</span>
                </Typography>
            </Flex>
        </>
    }

    function renderError(): ReactElement {
        return <Button type="link" onClick={() => {
            onReset?.()
        }} style={{ height: "100px", width: '100%' }}><FaSync size={25} />
            <p>Refresh</p>
        </Button>
    }

    return <Card style={{ textAlign: 'center', position: 'relative' }} loading={loading}>
        {isError ? renderError() : renderMain()}
    </Card>
}