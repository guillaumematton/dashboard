import { fetchLatestCommits } from "./github";
import "../css/GithubActivity.css";

export default async function GithubActivity({ username, repoFilter, limit = 20 }) {
  const token = process.env.GITHUB_TOKEN;

  try {
    const commits = await fetchLatestCommits(token, username, limit, repoFilter);

    if (!commits.length) return <p className="gh-empty">No recent activity.</p>;

    return (
      <ul className="gh-list">
        {commits.map((c) => (
          <li key={c.sha} className="gh-item">
            <span className="gh-repo">{c.repo}</span>
            <span className="gh-message">{c.message}</span>
          </li>
        ))}
      </ul>
    );
  } catch (err) {
    return <p className="gh-error">GitHub Error : {err.message}</p>;
  }
}   