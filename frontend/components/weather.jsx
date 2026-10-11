"use client"
import { useState, useEffect, useCallback } from "react";
import "../css/weather.css";

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

const fetchWeather = async (latitude, longitude) => {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=Europe/Paris`
  );
  return response.json();
}

export default function Weather() {
  const [weather, setWeather] = useState(null);
  const [refreshMs, setRefreshMs] = useState(60000); // 60s — change to your preference
  const [input, setInput] = useState("Lille");
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!coords) return;

    const update = () => {
      fetchWeather(coords.latitude, coords.longitude)
        .then((data) => setWeather(data))
        .catch((err) => {
          console.error(err);
          setError("Error fetching weather data.");
        });
    };

    update();
    const interval = setInterval(update, refreshMs);
    return () => clearInterval(interval);
  }, [coords, refreshMs]);

  const handleSearch = useCallback((e) => {
        e.preventDefault();
        if (!input.trim()) return;

        fetchCoordinates(input.trim()).then((coords) => {
            if (coords) {
                setCoords(coords);
                setError(null);
            } else {
                setError("City not found");
            }
        })
        .catch((err) => {
            console.error(err);
            setError("Error fetching coordinates");
        });
    }, [input]);

  if (!weather) return (
    <div className="weather-card">
      <form onSubmit={handleSearch} className="weather-form">
        <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Rechercher un lieu"
            className="weather-input"
        />
        <button type="submit" className="weather-button">
            Rechercher
        </button>
      </form>
    </div>)

  return (
    <div className="weather-card">
      <form onSubmit={handleSearch} className="weather-form">
        <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Rechercher un lieu"
            className="weather-input"
        />
        <button type="submit" className="weather-button">
            Rechercher
        </button>
      </form>

      {error && <p className="weather-error">{error}</p>}

      <p>Temperature : {weather.current_weather.temperature}{weather.current_weather_units.temperature}</p>
      <p>Wind speed : {weather.current_weather.windspeed}{weather.current_weather_units.windspeed}</p>
      <p>Wind direction : {weather.current_weather.winddirection}{weather.current_weather_units.winddirection}</p>

      {/* Optional: a select to change the interval at runtime */}
      <select value={refreshMs} onChange={(e) => setRefreshMs(Number(e.target.value))}>
        <option value={30000}>30 s</option>
        <option value={60000}>1 min</option>
        <option value={300000}>5 min</option>
        <option value={900000}>15 min</option>
      </select>
    </div>
  );
}   