import { fetchLatestCommits } from "./github";

export default async function GithubActivity({ username, repoFilter, limit = 20 }) {
  const token = process.env.GITHUB_TOKEN;

  try {
    const commits = await fetchLatestCommits(token, username, limit, repoFilter);

    if (!commits.length) return <p>No recent activity.</p>;

    return (
      <ul>
        {commits.map((c) => (
          <li key={c.sha}>
            <strong>{c.repo}</strong> — {c.message}
          </li>
        ))}
      </ul>
    );
  } catch (err) {
    return <p>GitHub Error : {err.message}</p>;
  }
}