import { ReverseGeocodingResponse } from "@/modules/location/types";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { useState, useEffect } from "react";

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

export function useNavigator(): UseNavigator {
    const [city, setCity] = useState('JAKARTA')
    const [location, setLocation] = useState<{ latitude: number | null; longitude: number | null }>({ latitude: null, longitude: null });
    const [error, setError] = useState<string | null>(null);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['reverse-geocoding', location.latitude, location.longitude], queryFn: () => {
            if (location.latitude && location.longitude) {
                return getLocation(location.latitude, location.longitude)
            }

            return null
        }
    })

    useEffect(() => {
        if (data?.data?.city && !isError && !isLoading) {
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

    return { city, error, isLoading };
}
