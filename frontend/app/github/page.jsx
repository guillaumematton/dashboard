"use client";

import { useState } from "react";
import { validateToken, fetchLatestCommits } from "../../components/github";

export default function GitHubCommits() {
  const [token, setToken] = useState("");
  const [username, setUsername] = useState(null);
  const [repoFilter, setRepoFilter] = useState("");
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async () => {
    setError(null);
    try {
      const user = await validateToken(token);
      setUsername(user.login);
    } catch (e) {
      setError(e.message);
    }
  };

  const fetchCommits = async () => {
    setLoading(true);
    setError(null);
    setCommits([]);
    try {
      const data = await fetchLatestCommits(token, username, 20, repoFilter || null);
      setCommits(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (!username) {
    return (
      <div style={styles.card}>
        <h2>GitHub Login</h2>
        <p>Paste a Personal Access Token or OAuth token to authenticate.</p>
        <input
          type="password"
          placeholder="ghp_xxxx…"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          style={styles.input}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button onClick={login} disabled={!token} style={styles.btn}>Login</button>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <h2>
        Latest commits for <code>{username}</code>
      </h2>

      <div style={styles.filterRow}>
        <input
          type="text"
          placeholder="owner/repo (optional)"
          value={repoFilter}
          onChange={(e) => setRepoFilter(e.target.value)}
          style={styles.input}
        />
        <button onClick={fetchCommits} disabled={loading} style={styles.btn}>
          {loading ? "Fetching…" : "Fetch Commits"}
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {commits.length > 0 && (
        <table style={styles.table}>
          <thead>
            <tr><th>Repo</th><th>Message</th><th>SHA</th><th>Date</th></tr>
          </thead>
          <tbody>
            {commits.map((c, i) => (
              <tr key={i}>
                <td>
                  <a href={`https://github.com/${c.repo}`} target="_blank" rel="noreferrer">
                    {c.repo}
                  </a>
                </td>
                <td title={c.message}>{c.message.slice(0, 60)}</td>
                <td><code>{c.sha.slice(0, 7)}</code></td>
                <td>{new Date(c.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles = {
  card: { maxWidth: 900, margin: "2rem auto", padding: 1.5, border: "1px solid #ddd", borderRadius: 8 },
  input: { padding: 8, flex: 1, boxSizing: "border-box" },
  filterRow: { display: "flex", gap: 8, marginBottom: 16 },
  btn: { padding: "8px 16px", cursor: "pointer", whiteSpace: "nowrap" },
  table: { width: "100%", borderCollapse: "collapse", marginTop: 16 },
};   