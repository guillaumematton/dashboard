"use client"
import { useCallback, useEffect, useState } from "react";
import ReactGridLayout from "react-grid-layout";
import { useContainerWidth } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import Widget from "../components/widget";
import "../css/dashboard.css";

const STORAGE_KEY = "dashboard-layout-v1";

// Your existing widgets, keyed by id. Swap the placeholder content
// for your real components — the id must match the layout below.
const registry = {
  github:   { title: "GitHub Activity",  accent: "#8b949e", render: () => <p>GitHub feed…</p> },
  gmail:    { title: "Gmail",            accent: "#ea4335", render: () => <p>Inbox…</p> },
  youtube:  { title: "YouTube Channel",  accent: "#ff0000", render: () => <p>Videos…</p> },
  steam:    { title: "Steam",            accent: "#1b2838", render: () => <p>Now playing: Elden Ring…</p> },
  weather:  { title: "Weather · Barcelona", accent: "#6ea8fe", render: () => <p>22°C, sunny…</p> },
  twitter:  { title: "X (Twitter)",      accent: "#1da1f2", render: () => <p>Tweets…</p> },
  reddit:   { title: "Reddit",           accent: "#ff4500", render: () => <p>Posts…</p> },
  stocks:   { title: "Stock Market",     accent: "#22c55e", render: () => <p>AAPL · NVDA · BTC…</p> },
  maps:     { title: "Google Maps",      accent: "#fbbc05", render: () => <p>Park Güell → Sagrada Família…</p> },
  rss:      { title: "RSS Feed",         accent: "#f97316", render: () => <p>The Verge, TechCrunch, Wired…</p> },
};

// 12-column grid. w = width in cols, h = height in rows.
// Mirrors the two-row layout from the image.
const DEFAULT_LAYOUT = [
  { i: "github",  x: 0,  y: 0, w: 3, h: 2 },
  { i: "gmail",   x: 3,  y: 0, w: 3, h: 2 },
  { i: "youtube", x: 6,  y: 0, w: 3, h: 2 },
  { i: "steam",   x: 9,  y: 0, w: 3, h: 2 },
  { i: "twitter", x: 0,  y: 2, w: 3, h: 2 },
  { i: "reddit",  x: 3,  y: 2, w: 3, h: 2 },
  { i: "stocks",  x: 6,  y: 2, w: 3, h: 2 },
  { i: "maps",    x: 9,  y: 2, w: 3, h: 2 },
];

function loadLayout() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved) && saved.length) return saved;
  } catch {}
  return DEFAULT_LAYOUT;
}

export default function Dashboard() {
  const [layout, setLayout] = useState(loadLayout);
  const [visible, setVisible] = useState(() => Object.keys(registry));

  const { width, containerRef, mounted } = useContainerWidth();

  // Persist arrangement on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
  }, [layout]);

  const handleLayoutChange = useCallback((newLayout) => setLayout(newLayout), []);

  const removeWidget = useCallback((id) => {
    setVisible((v) => v.filter((x) => x !== id));
    setLayout((l) => l.filter((item) => item.i !== id));
  }, []);

  const resetLayout = useCallback(() => {
    setLayout(DEFAULT_LAYOUT);
    setVisible(Object.keys(registry));
  }, []);

  const handleLogin = () => {
    window.location.href = "/login";
  }

  const handleRegister = () => {
    window.location.href = "/register";
  }

  const [weatherSubscribe, setWeatherSubscribe] = useState(() => {
    const stored = localStorage.getItem('weather');
    return stored ? JSON.parse(stored) : false;
  });
  const [clockSubscribe, setClockSubscribe] = useState(() => {
    const stored = localStorage.getItem('clock');
    return stored ? JSON.parse(stored) : false;
  });;
  const [youtubeSubscribe, setYoutubeSubscribe] = useState(() => {
    const stored = localStorage.getItem('youtbue');
    return stored ? JSON.parse(stored) : null;
  });;
  const [githubSubscribe, setGithubSubscribe] = useState(() => {
    const stored = localStorage.getItem('github');
    return stored ? JSON.parse(stored) : false;
  });;

  useEffect(() => {
    localStorage.setItem('weather', JSON.stringify(weatherSubscribe));
    localStorage.setItem('clock', JSON.stringify(clockSubscribe));
    localStorage.setItem('youtbe', JSON.stringify(youtubeSubscribe));
    localStorage.setItem('github', JSON.stringify(githubSubscribe));
    }, [weatherSubscribe, clockSubscribe]);

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
      </div>

      {mounted && (
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