"use client"
import { useState, useEffect } from "react";

export default function Weather() {
  const [weather, setWeather] = useState(null);
  const [refreshMs, setRefreshMs] = useState(60000); // 60s — change to your preference

  const fetchWeather = () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=Europe/Paris`
      );
      const data = await response.json();
      setWeather(data);
    });
  };

  useEffect(() => {
    fetchWeather(); // initial call
    const interval = setInterval(fetchWeather, refreshMs);
    return () => clearInterval(interval); // cleanup on unmount or when refreshMs changes
  }, [refreshMs]);

  if (!weather) return <p>Loading…</p>;

  return (
    <div className="weather-card">
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