"use client";
import { useState } from "react";
import { APIProvider, Map, Marker, useMap } from "@vis.gl/react-google-maps";
import "../css/googleMaps.css";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const fetchCoordinates = async (cityName) => {
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`
    );
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const { latitude, longitude } = data.results[0];
      console.log(`Coordinates for ${cityName}:`, latitude, longitude);
      return { latitude, longitude };
    } else {
      console.log("City not found");
      return null;
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
  }
};

function Recenter({ marker }) {
    const map = useMap();
    if (map && marker) {
        map.panTo(marker);
        map.setZoom(13);
    }
    return null;
}

export default function GoogleMaps({ defaultQuery= "Lille" }) {
    const [input, setInput] = useState(defaultQuery);
    const [marker, setMarker] = useState(null);
    const [error, setError] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        fetchCoordinates(input.trim()).then((coords) => {
            if (coords) {
                setMarker({ lat: coords.latitude, lng: coords.longitude });
                setError(null);
            } else {
                setError("City not found");
            }
        })
        .catch((err) => {
            console.error(err);
            setError("Error fetching coordinates");
        });
    };

    return (
        <div className="maps-widget">
            <form onSubmit={handleSearch} className="maps-form">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Rechercher un lieu"
                    className="maps-input"
                />
                <button type="submit" className="maps-button">
                    Rechercher
                </button>
            </form>

            {error && <p className="maps-error">{error}</p>}

            <APIProvider apiKey={API_KEY}>
                <Map
                    className="maps-frame"
                    defaultCenter={{ lat: 50.6292, lng: 3.0573 }} // Default to Lille
                    defaultZoom={13}
                    gestureHandling="greedy"
                    disableDefaultUI={false}
                    >
                        {marker && <Marker position={marker} />}
                        <Recenter marker={marker} />
                </Map>
            </APIProvider>
        </div>
    );
}
