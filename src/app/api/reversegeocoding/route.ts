import axios, { AxiosError } from "axios";
import { ReverseGeocodingResponse } from "@/types/location";
import { NextResponse } from "next/server";

const GEOCODE_MAPS_API_BASE_URL = "https://geocode.maps.co/reverse"

interface Address {
    amenity: string;
    road: string;
    village: string;
    county: string;
    state: string;
    ISO3166_2_lvl4: string; // Using underscore instead of hyphen for valid identifier
    region: string;
    ISO3166_2_lvl3: string; // Using underscore instead of hyphen for valid identifier
    postcode: string;
    country: string;
    country_code: string;
}

interface response {
    place_id: number;
    licence: string;
    osm_type: string;
    osm_id: number;
    lat: string; // Latitude as a string
    lon: string; // Longitude as a string
    display_name: string;
    address: Address;
    boundingbox: string[]; // Array of strings representing bounding box coordinates
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const lat = searchParams.get('lat')
    const lon = searchParams.get('lon')

    if (!lat || !lon) {
        return NextResponse.json({ error: 'Latitude & Longitude should be filled' }, { status: 400 });
    }

    try {
        const response = await axios.get<response>(GEOCODE_MAPS_API_BASE_URL, {
            params: {
                api_key: process.env.GEOCODE_MAPS_API_KEY,
                lat: lat,
                lon: lon
            }
        })
        const location: ReverseGeocodingResponse = {
            address: response.data.display_name,
            city: response.data.address.county,
            country: response.data.address.country,
            province: response.data.address.state
        }
        return NextResponse.json(location, { status: 201 });
    } catch (error: unknown) {
        const message = (error as AxiosError).message
        return NextResponse.json({ error: message }, { status: 500 });
    }
}