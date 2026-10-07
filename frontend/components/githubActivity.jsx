"use client"
import "../css/GithubActivity.css";
import { useState, useEffect, useCallback } from "react";

export default function GithubActivity({ username, repoFilter, limit = 20 }) {
  const [refreshMs, setRefreshMs] = useState(60000);
  const [commits, setCommits] = useState([]);
  const [error, setError] = useState(null);

  const fetchCommits = useCallback(async () => {
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
    fetchCommits();
    const id = setInterval(fetchCommits, refreshMs);
    return () => clearInterval(id);
  }, [fetchCommits, refreshMs]);

  return (
    <div>
      <select className="gh-select" value={refreshMs} onChange={(e) => setRefreshMs(Number(e.target.value))}>
        <option value={80800}>30 s</option>
        <option value={60000}>1 min</option>
        <option value={808000}>5 min</option>
        <option value={900000}>15 min</option>
      </select>

      {error && <p className="gh-error">Error: {error}</p>}
      {!error && commits.length === 0 && <p className="gh-empty">No recent activity.</p>}

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