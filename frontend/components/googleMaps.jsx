"use client";
import { useState } from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import "../css/googleMaps.css";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function GoogleMaps({ defaultQuery= "Lille" }) {
    const [query, setQuery] = useState(defaultQuery);
    const [input, setInput] = useState(defaultQuery);
    const [center, setCenter] = useState(null);
    const [error, setError] = useState(null);
    
    const geocode = async (place) => {
        const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(place)}&key=${API_KEY}`);
        const data = await res.json();
        if (data.status !== "OK") {
            setError(`Lieu introuvable (${data.status})`);
            return;
        }
        setError(null);
        setCenter(data.results[0].geometry.location);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (input.trim()) {
            setQuery(input.trim());
            geocode(input.trim());
        }
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
                <button type="submit" className="maps-button">Rechercher</button>
            </form>

            {error && <p className="maps-error">{error}</p>}

            <APIProvider apiKey={API_KEY}>
                <Map
                    className="maps-frame"
                    defaultCenter={{ lat: 50.6292, lng: 3.0573 }} // Lille coordinates
                    center={center}
                    defaultZoom={13}
                    gestureHandling="greedy"
                    disableDefaultUI={false}
                >
                    {center && <Marker position={center} />}
                </Map>
            </APIProvider>
        </div>
    );
}