"use client"
import { useCallback, useEffect, useState } from "react";
import { Responsive, useContainerWidth } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import Widget from "./widget";
import "../css/dashboard.css";

const STORAGE_KEY = "dashboard-layouts-v2"; // new key: the saved format changed
const BREAKPOINTS = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
const COLS = { lg: 16, md: 12, sm: 8, xs: 4, xxs: 2 };

// id format: "<type>__<uniqueSuffix>"
const makeId = (type) => `${type}__${crypto.randomUUID().slice(0, 8)}`;
const typeOf = (id) => id.split("__")[0];

export default function Dashboard({ youtubeSlot, githubSlot, weatherSlot, clockSlot }) {
  const [layouts, setLayouts] = useState({ lg: [] });
  const [hydrated, setHydrated] = useState(false);
  const [addWidgetOpen, setAddWidgetOpen] = useState(false);
  const { containerRef, mounted, width } = useContainerWidth({ measureBeforeMount: true });

  // w/h are the default size (in grid units) for a newly added instance
  const registry = {
    github:  { title: "GitHub Activity",     accent: "#8b949e", w: 4, h: 8,  render: () => githubSlot },
    youtube: { title: "YouTube Live",     accent: "#ff0000", w: 4, h: 8,  render: () => youtubeSlot },
    weather: { title: "Weather", accent: "#6ea8fe", w: 3, h: 6,  render: () => weatherSlot },
    maps:    { title: "Google Maps",         accent: "#fbbc05", w: 4, h: 8,  render: () => <p>Park Güell → Sagrada Família…</p> },
    clock:   { title: "Clock",               accent: "#0000",   w: 3, h: 4,  render: () => clockSlot },
  };

  const clamp = (items, cols) =>
    items.map((it) => {
      const w = Math.min(it.w, cols);
      const x = Math.max(0, Math.min(it.x, cols - w));
      return { ...it, w, x };
    });
  
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved && Array.isArray(saved.lg)) {
        const fixed = {};
        for (const bp of Object.keys(saved)) {
          if (COLS[bp]) fixed[bp] = clamp(saved[bp], COLS[bp]);
        }
        setLayouts(fixed);
      }
    } catch {}
    setHydrated(true);
  }, []);

  // Persist after hydration
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(layouts));
  }, [layouts, hydrated]);

  const handleLayoutChange = useCallback((_current, all) => setLayouts(all), []);

  // Add a new instance to EVERY breakpoint so all layouts stay in sync
  const addWidget = useCallback((type) => {
    const id = makeId(type);
    const { w, h } = registry[type];
    setLayouts((prev) => {
      const next = {};
      for (const bp of Object.keys(COLS)) {
        const cols = COLS[bp];
        next[bp] = [
          ...(prev[bp] ?? prev.lg ?? []),
          { i: id, x: 0, y: Infinity, w: Math.min(w, cols), h },
        ];
      }
      return next;
    });
  }, []);

  const removeWidget = useCallback((id) => {
    setLayouts((prev) => {
      const next = {};
      for (const bp of Object.keys(prev)) {
        next[bp] = prev[bp].filter((item) => item.i !== id);
      }
      return next;
    });
  }, []);

  const handleLogin = () => {
    window.location.href = "/login";
  };
  const handleRegister = () => {
    window.location.href = "/register";
  }

  const instanceIds = (layouts.lg ?? []).map((item) => item.i);

  return (
    <div className="dashboard">
      <div className="dashboard-banner">
        <div className="dashboard-header">
          <img src="/meunier.png" alt="Logo" className="dashboard-logo" />
          <div className="dashboard-actions">
            <button className="btn" onClick={handleLogin}>Login</button>
            <button className="btn" onClick={handleRegister}>Register</button>
          </div>
        </div>
      </div>

      <div className="subscribe">
        <button className="btn" onClick={() => setAddWidgetOpen(true)}>+ Add Widget</button>
      </div>

      <div ref={containerRef} style={{ width: "100%" }}>
      {mounted && hydrated && (
          <Responsive
            className="layout"
            layouts={layouts}
            breakpoints={BREAKPOINTS}
            cols={COLS}
            rowHeight={15}
            margin={[16, 16]}
            containerPadding={[0, 0]}
            dragConfig={{ bounded: true, handle: ".widget__header" }}
            onLayoutChange={handleLayoutChange}
            width={width}
            isBounded
          >
            {instanceIds
              .filter((id) => registry[typeOf(id)])
              .map((id) => {
                const def = registry[typeOf(id)];
                return (
                  <div key={id}>
                    <Widget
                      title={def.title}
                      accent={def.accent}
                      onRemove={() => removeWidget(id)}
                    >
                      {def.render()}
                    </Widget>
                  </div>
                );
              })}
          </Responsive>
        )}
      </div>

      {addWidgetOpen && (
        <div className="overlay">
          <div className="popup">
            <button className="popup-close" onClick={() => setAddWidgetOpen(false)}>×</button>
            {Object.keys(registry).map((type) => (
              <button
                className="popup-btn"
                key={type}
                onClick={() => {
                  addWidget(type);
                  setAddWidgetOpen(false);
                }}
              >
                {registry[type].title}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}