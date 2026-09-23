"use client"
import { useCallback, useEffect, useState } from "react";
import ReactGridLayout from "react-grid-layout";
import { useContainerWidth } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import Widget from "./widget";
import "../css/dashboard.css";

const STORAGE_KEY = "dashboard-layout-v1";

export function loadLayout() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved) && saved.length) return saved;
  } catch {}
  return [];
}

export default function Dashboard({ youtubeSlot, githubSlot }) {
  const [layout, setLayout] = useState(loadLayout());
  const [visible, setVisible] = useState(loadLayout().map((item) => item.i));
  const [hydrated, setHydrated] = useState(false);
  const { width, containerRef, mounted } = useContainerWidth();

  const registry = {
    github:   { title: "GitHub Activity",  accent: "#8b949e", render: () => githubSlot },
    youtube:  { title: "YouTube Channel",  accent: "#ff0000", render: () => youtubeSlot },
    weather:  { title: "Weather · Barcelona", accent: "#6ea8fe", render: () => <p>22°C, sunny…</p> },
    maps: { title: "Google Maps", accent: "#fbbc05", render: () => <p>Park Güell → Sagrada Família…</p> },
    clock: { title: 'Clock', accent: "#0000", render: () => <p>Current time: ...</p> }
  };

  const handleLayoutChange = useCallback((newLayout) => setLayout(newLayout), []);

  // New state for the add-widget popup
  const [addWidgetOpen, setAddWidgetOpen] = useState(false);

  Object.keys(registry).map(item => item == undefined ? false : true);
  // Widgets that exist in the registry but aren't currently shown
  const availableWidgets = Object.keys(registry).filter((id) => !visible.includes(id));
  
  // Adds a widget back to the grid, placing it below the existing layout
  const addWidget = useCallback((id) => {
    setVisible((v) => (v.includes(id) ? v : [...v, id]));
    setLayout((l) => {
      if (l.some((item) => item.i === id)) return l;
      const maxY = l.reduce((max, item) => Math.max(max, item.y + item.h), 0);
      return [...l, { i: id, x: 0, y: maxY, w: 3, h: 2 }];
    });
  }, []);

  const removeWidget = useCallback((id) => {
    setVisible((v) => v.filter((x) => x !== id));
    setLayout((l) => l.filter((item) => item.i !== id));
  }, []);

  const handleLogin = () => {
    window.location.href = "/login";
  }

  const handleRegister = () => {
    window.location.href = "/register";
  }

    // Subscribe states start with fixed defaults — no window check here
    const [weatherSubscribe, setWeatherSubscribe] = useState(false);
    const [clockSubscribe, setClockSubscribe] = useState(false);
    const [youtubeSubscribe, setYoutubeSubscribe] = useState(null);
    const [githubSubscribe, setGithubSubscribe] = useState(null);
  
    // Load everything from localStorage ONCE, after mount (client-only)
    useEffect(() => {
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (Array.isArray(saved) && saved.length) setLayout(saved);
      } catch {}
  
      const w = localStorage.getItem('weather');
      if (w) setWeatherSubscribe(JSON.parse(w));
  
      const c = localStorage.getItem('clock');
      if (c) setClockSubscribe(JSON.parse(c));
  
      const y = localStorage.getItem('youtube'); // fix key typo, see below
      if (y) setYoutubeSubscribe(JSON.parse(y));
  
      const g = localStorage.getItem('github');
      if (g) setGithubSubscribe(JSON.parse(g));
  
      setHydrated(true);
    }, []);
  
    // Persist arrangement on every change — but only after initial hydration
    useEffect(() => {
      if (!hydrated) return;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
    }, [layout, hydrated]);
  
    useEffect(() => {
      if (!hydrated) return;
      localStorage.setItem('weather', JSON.stringify(weatherSubscribe));
      localStorage.setItem('clock', JSON.stringify(clockSubscribe));
      localStorage.setItem('youtube', JSON.stringify(youtubeSubscribe));
      localStorage.setItem('github', JSON.stringify(githubSubscribe));
    }, [weatherSubscribe, clockSubscribe, youtubeSubscribe, githubSubscribe, hydrated]);

  const options = [["Weather", () => { setWeatherSubscribe(true) }], ["Clock", () => { setClockSubscribe(true) }], ["Youtube", () => { setYoutubeSubscribe("hello") }], ["Github", () => { setGithubSubscribe("hello") }]];

  const [subscribeOpen, setsubscribeOpen] = useState(false);
  

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
        <button className="btn" onClick={() => setsubscribeOpen(true)}>Subscribe</button>
        <button className="btn" onClick={() => setAddWidgetOpen(true)}>+ Add Widget</button>
      </div>

      {mounted && hydrated && (
        <div ref={containerRef}>
          <ReactGridLayout
            className="layout"
            layout={layout}
            cols={12}
            rowHeight={80}
            margin={[16, 16]}
            containerPadding={[0, 0]}
            draggableHandle=".widget__header"
            onLayoutChange={handleLayoutChange}
            width={width}
          >
            {layout
              .filter((item) => visible.includes(item.i) && registry[item.i])
              .map((item) => (
                <div key={item.i}>
                  <Widget
                    title={registry[item.i].title}
                    accent={registry[item.i].accent}
                    onRemove={() => removeWidget(item.i)}
                  >
                    {registry[item.i].render()}
                  </Widget>
                </div>
              ))}
          </ReactGridLayout>
        </div>
      )}

      {/* handle add item button */}
      {addWidgetOpen && (
        <div className="overlay">
          <div className="popup">
            <button className="popup-close" onClick={() => setAddWidgetOpen(false)}>×</button>
            {availableWidgets.length === 0 ? (
              <p>All widgets are already on your dashboard.</p>
            ) : (
              availableWidgets.map((id) => (
                <button
                  className="popup-btn"
                  key={id}
                  onClick={() => {
                    addWidget(id);
                    setAddWidgetOpen(false);
                  }}
                >
                  {registry[id].title}
                </button>
              ))
            )}
          </div>
        </div>
      )}
      {/*handle subscribe button*/}
      {subscribeOpen && (
        <div className="overlay">
          <div className="popup">
            <button className="popup-close" onClick={() => setsubscribeOpen(false)}>×</button>
              {options.map((opt) => (
                <button className="popup-btn" onClick={() => { opt[1] }} key={opt[0]}>
                  {opt[0]}
                </button>
              ))}
            </div>
          </div>
      )}
    </div>
  );
}
