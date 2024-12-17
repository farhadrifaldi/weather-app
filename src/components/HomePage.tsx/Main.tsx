
'use client'

import axios, { AxiosResponse } from 'axios';
import { AlgoliaSearch } from '@/components/HomePage.tsx/AlgoliaSearch';
import { WeatherForecast } from '@/components/HomePage.tsx/WeatherForecast';
import { Space } from 'antd';
import { useEffect, useState } from 'react';
import { FavoriteCities } from './FavoriteCities';
import { useQuery } from '@tanstack/react-query';
import { ReverseGeocodingResponse } from '@/modules/location/types';
import { useSession } from 'next-auth/react';


function getLocation(lat: number | null, lon: number | null): Promise<AxiosResponse<ReverseGeocodingResponse>> {
    return axios.get('/api/reversegeocoding', {
        params: {
            lat: lat,
            lon: lon
        }
    })
}

// type Location = { latitude: number | null; longitude: number | null }

type UseNavigator = {
    city: string;
    error: string | null
    isLoading: boolean
}

function useNavigator(): UseNavigator {
    const [city, setCity] = useState('JAKARTA')
    const [location, setLocation] = useState<{ latitude: number | null; longitude: number | null }>({ latitude: null, longitude: null });
    const [error, setError] = useState<string | null>(null);

    const { data, isLoading, isError } = useQuery({ queryKey: ['reverse-geocoding', location.latitude, location.longitude], queryFn: () => getLocation(location.latitude, location.longitude) })




    useEffect(() => {
        if (data?.data?.city && !isError && !isLoading) {
            console.log('come here', data)
            setCity(data?.data?.city.toLocaleUpperCase())
        }
    }, [data, data?.data?.city, isError, isLoading])

    useEffect(() => {
        // Function to get the current position
        const getLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setLocation({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        });
                        console.log('get the position', position)
                    },
                    (error) => {
                        setError(error.message);
                    }
                );
            } else {
                setError("Geolocation is not supported by this browser.");
            }
        };

        // Call the function to get location when the component mounts
        return () => getLocation();
    }, []); // Empty dependency array means this runs once when the component mounts

    console.log('ini city', city)

    return { city, error, isLoading };
}



export default function Main() {
    const { data: session } = useSession();
    const [city, setCity] = useState('Jakarta')
    const { city: userCity } = useNavigator()

    useEffect(() => {
        setCity(userCity)
    }, [userCity])


    function onSelect(city: string): void {
        console.log('ini city', city)
        setCity(city)
    }


    return <Space direction="vertical" size={16}>
        <AlgoliaSearch onSelect={onSelect} />
        <WeatherForecast city={city} />
        {session ? <FavoriteCities /> : null}
    </Space>
}
