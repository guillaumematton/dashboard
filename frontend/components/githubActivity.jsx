"use client"
import "../css/GithubActivity.css";
import { useState, useEffect, useCallback } from "react";

export default function GithubActivity({ repoFilter, limit = 20 }) {
  const [username, setUsername] = useState(null);
  const [input, setInput] = useState("");
  const [refreshMs, setRefreshMs] = useState(60000);
  const [commits, setCommits] = useState([]);
  const [error, setError] = useState(null);

  const fetchCommits = useCallback(async () => {
    if (!username) return;
    try {
      const params = new URLSearchParams({ username, limit });
      if (repoFilter) params.set("repoFilter", repoFilter);
      const res = await fetch(`/api/githubActivity?${params}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setCommits(data.commits);
      setError(null);
    } catch (e) {
      setError(e.message);
    }
  }, [username, repoFilter, limit]);

  useEffect(() => {
    if (!username) return;
    fetchCommits();
    const id = setInterval(fetchCommits, refreshMs);
    return () => clearInterval(id);
  }, [username, fetchCommits, refreshMs]);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput) return;
    setCommits([]);
    setError(null);
    setUsername(trimmedInput);
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="gh-form">
        <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nom d'utilisateur Github"
            className="gh-input"
        />
        <button type="submit" className="gh-button">
            Rechercher
        </button>
      </form>
      <select className="gh-select" value={refreshMs} onChange={(e) => setRefreshMs(Number(e.target.value))}>
        <option value={80800}>30 s</option>
        <option value={60000}>1 min</option>
        <option value={808000}>5 min</option>
        <option value={900000}>15 min</option>
      </select>

      {error && <p className="gh-error">Error: {error}</p>}
      {username && !error && commits.length === 0 && <p className="gh-empty">Pas d'activité récente.</p>}
      {!username && !error && (<p className="gh-empty">Entrez un nom d'utilisateur Github pour voir les activités récentes.</p>)}

      {commits.length > 0 && (
        <ul className="gh-list">
          {commits.map((commit) => (
            <li key={commit.sha} className="gh-item">
              <span className="gh-repo">{commit.repo}</span>
              <span className="gh-message">{commit.message}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}