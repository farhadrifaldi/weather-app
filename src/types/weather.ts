export type Location = {
    name: string;
    region: string;
    country: string;
}

export type weather = {
    wind_mph?: number;
    temp_c?: number | string;
    condition?: {
        text?: string;
        icon?: string
    }
    humidity?: number;
}

export type WeatherForecastResponse = {
    weather: weather;
    forecast: {
        date: string;
        weather: weather
    }[]
    location: Location
}

export type WeatherResponse = {
    weather: weather,
    location: Location
}

