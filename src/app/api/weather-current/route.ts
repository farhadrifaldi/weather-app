import { WeatherResponse } from "@/modules/weather/type";
import axios from "axios";
import { NextResponse } from "next/server";

const WEATHER_API_BASE_URL = "http://api.weatherapi.com/v1/current.json"

interface WeatherCondition {
    text: string;
    icon: string;
    code: number;
}

interface Location {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    tz_id: string;
    localtime_epoch: number;
    localtime: string;
}

interface CurrentWeather {
    last_updated_epoch: number;
    last_updated: string;
    temp_c: number;
    temp_f: number;
    is_day: number; // 0 or 1
    condition: WeatherCondition;
    wind_mph: number;
    wind_kph: number;
    wind_degree: number;
    wind_dir: string;
    pressure_mb: number;
    pressure_in: number;
    precip_mm: number;
    precip_in: number;
    humidity: number;
    cloud: number;
    feelslike_c: number;
    feelslike_f: number;
    windchill_c: number;
    windchill_f: number;
    heatindex_c: number;
    heatindex_f: number;
    dewpoint_c: number;
    dewpoint_f: number;
    vis_km: number;
    vis_miles: number;
    uv: number;
    gust_mph: number;
    gust_kph: number;
}

interface response {
    location: Location;
    current: CurrentWeather;
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const city = searchParams.get('city')
    if (!city) {
        return NextResponse.json({ error: 'City field should be filled.' }, { status: 400 });
    }

    try {
        const response = await axios.get<response>(WEATHER_API_BASE_URL, {
            params: {
                key: process.env.WEATHER_API_KEY,
                q: city,
                days: 3,
                aqi: 'no' // this params used for showing air quality data
            }
        })
        const weatherData: WeatherResponse = {
            weather: {
                condition: {
                    ...response.data.current.condition,
                    icon: "https:" + response.data.current.condition.icon
                },
                wind_mph: response.data.current.wind_mph,
                temp_c: response.data.current.temp_c,
                humidity: response.data.current.humidity
            },
            location: {
                name: response.data.location.name,
                region: response.data.location.region,
                country: response.data.location.country
            }
        }
        return NextResponse.json(weatherData, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
    }
}