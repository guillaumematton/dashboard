"use client"
import React, { useState, useEffect, useCallback } from "react";

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
    <div style={styles.container}>
      <h1 style={styles.title}>World Clock</h1>

      <form onSubmit={handleSync} style={styles.form}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="IANA timezone (e.g. Europe/Paris)"
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Sync</button>
      </form>

      {error && <p style={styles.error}>Error: {error}</p>}

      {time && (
        <div style={styles.clock}>
          <div style={styles.timeText}>
            {String(time.hour).padStart(2, "0")}:{String(time.minute).padStart(2, "0")}:{String(time.seconds).padStart(2, "0")}
          </div>
          <div style={styles.dateText}>
            {time.dayOfWeek}, {time.date}
          </div>
          <div style={styles.tzText}>
            {time.timeZone} {time.dstActive ? "(DST)" : ""}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    fontFamily: "system-ui, sans-serif",
    padding: "2rem",
    maxWidth: 400,
    margin: "2rem auto",
  },
  title: { marginBottom: "1.5rem" },
  form: { display: "flex", gap: 8, marginBottom: "1rem" },
  input: {
    flex: 1,
    padding: "0.5rem",
    fontSize: "1rem",
    borderRadius: 4,
    border: "1px solid #ccc",
  },
  button: {
    padding: "0.5rem 1rem",
    fontSize: "1rem",
    borderRadius: 4,
    border: "none",
    background: "#333",
    color: "#fff",
    cursor: "pointer",
  },
  clock: { marginTop: "2rem" },
  timeText: { fontSize: "3.5rem", fontWeight: 700, fontVariantNumeric: "tabular-nums" },
  dateText: { fontSize: "1.2rem", color: "#555", marginTop: 4 },
  tzText: { fontSize: "1rem", color: "#888", marginTop: 4 },
  error: { color: "crimson", marginTop: "0.5rem" },
};

export default Clock;