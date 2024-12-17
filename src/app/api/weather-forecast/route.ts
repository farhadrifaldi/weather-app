import { WeatherForecastResponse } from "@/types/weather";
import axios from "axios";
import { NextResponse } from "next/server";

const WEATHER_API_BASE_URL = "https://api.weatherapi.com/v1/forecast.json"

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
    temp_c: number;
    condition: WeatherCondition;
    wind_mph: number;
    humidity: number;
}

interface ForecastWeather {
    maxtemp_c: number;
    mintemp_c: number;
    maxwind_mph: number;
    condition: WeatherCondition;
    avghumidity: number;
}

interface ForecastDay {
    date: string;
    day: ForecastWeather
}

interface response {
    location: Location;
    current: CurrentWeather;
    forecast: {
        forecastday: ForecastDay[]
    }
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
                aqi: 'no', // this params used for showing air quality data
                alerts: 'no',
            }
        })
        const weatherData: WeatherForecastResponse = {
            weather: {
                condition: {
                    ...response.data.current.condition,
                    icon: "https:" + response.data.current.condition.icon
                },
                wind_mph: response.data.current.wind_mph,
                temp_c: response.data.current.temp_c,
                humidity: response.data.current.humidity
            },
            forecast: response.data.forecast.forecastday.map((forecast): WeatherForecastResponse['forecast'][0] => {
                return {
                    date: forecast.date,
                    weather: {
                        condition: {
                            ...forecast.day.condition,
                            icon: "https:" + forecast.day.condition.icon
                        },
                        wind_mph: forecast.day.maxwind_mph,
                        temp_c: forecast.day.mintemp_c + " - " + forecast.day.maxtemp_c,
                        humidity: forecast.day.avghumidity
                    }
                }
            }),
            location: {
                name: response.data.location.name,
                country: response.data.location.country,
                region: response.data.location.region,
            }
        }
        return NextResponse.json(weatherData, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
    }
}