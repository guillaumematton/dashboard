"use client"
import React, { useState, useEffect, useCallback } from "react";
import "../css/clock.css";

function Clock() {
  const [timeZone, setTimeZone] = useState("UTC");
  const [input, setInput] = useState("UTC");
  const [time, setTime] = useState(null);
  const [error, setError] = useState(null);

  const fetchTime = useCallback(async () => {
    try {
      const res = await fetch(
        `https://timeapi.io/api/time/current/zone?timeZone=${encodeURIComponent(timeZone)}`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setTime(data);
      setError(null);
    } catch (e) {
      setError(e.message);
    }
  }, [timeZone]);

  // Initial fetch + tick every second
  useEffect(() => {
    fetchTime();
    const id = setInterval(fetchTime, 1000);
    return () => clearInterval(id);
  }, [fetchTime]);

  const handleSync = (e) => {
    e.preventDefault();
    if (input.trim()) setTimeZone(input.trim());
  };

  return (
    <div className="clock-container">
      <h1 className="clock-title">World Clock</h1>

      <form onSubmit={handleSync} className="clock-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="IANA timezone (e.g. Europe/Paris)"
          className="clock-input"
        />
        <button type="submit" className="clock-button">Sync</button>
      </form>

      {error && <p className="clock-error">Error: {error}</p>}

      {time && (
        <div className="clock-display">
          <div className="clock-time">
            {String(time.hour).padStart(2, "0")}:{String(time.minute).padStart(2, "0")}:{String(time.seconds).padStart(2, "0")}
          </div>
          <div className="clock-date">
            {time.dayOfWeek}, {time.date}
          </div>
          <div className="clock-tz">
            {time.timeZone} {time.dstActive ? "(DST)" : ""}
          </div>
        </div>
      )}
    </div>
  );
}

export default Clock;