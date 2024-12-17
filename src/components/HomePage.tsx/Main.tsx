
'use client'

import { AlgoliaSearch } from '@/components/HomePage.tsx/AlgoliaSearch';
import { WeatherForecast } from '@/components/HomePage.tsx/WeatherForecast';
import { Space, Typography } from 'antd';
import { ReactElement, useEffect, useState } from 'react';
import { FavoriteCities } from './FavoriteCities';
import { useSession } from 'next-auth/react';
import { useNavigator } from '@/hooks/navigator/useNavigator';

function UnSignedFavoriteCity(): ReactElement {
    return <div>
        <Typography.Title level={3}><span style={{ textTransform: 'capitalize' }}>Favorite Cities</span> Weather</Typography.Title>
        <Typography>Login to see your favorite cities</Typography>
    </div>
}

export default function Main(): ReactElement {
    const { data: session } = useSession();
    const [city, setCity] = useState('Jakarta')
    const { city: userCity } = useNavigator()

    useEffect(() => {
        setCity(userCity)
    }, [userCity])


    function onSelect(city: string): void {
        setCity(city)
    }


    return <Space direction="vertical" size={16}>
        <AlgoliaSearch onSelect={onSelect} />
        <WeatherForecast city={city} />
        {session ? <FavoriteCities /> : <UnSignedFavoriteCity />}
    </Space>
}
