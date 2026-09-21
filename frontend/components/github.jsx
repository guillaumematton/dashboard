const API = "https://api.github.com";

function headers(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

export async function validateToken(token) {
  const res = await fetch(`${API}/user`, { headers: headers(token) });
  if (!res.ok) throw new Error("Invalid token");
  return res.json();
}

export async function fetchLatestCommits(token, username, limit = 20, repoFilter = null) {
  let repos = [];

  if (repoFilter) {
    // Single repo: fetch it directly
    const res = await fetch(`${API}/repos/${repoFilter}`, { headers: headers(token) });
    if (!res.ok) throw new Error(`Repo "${repoFilter}" not found or no access`);
    repos = [await res.json()];
  } else {
    // All repos (paginated)
    let page = 1;
    while (true) {
      const res = await fetch(
        `${API}/user/repos?per_page=100&page=${page}&sort=pushed`,
        { headers: headers(token) }
      );
      if (!res.ok) break;
      const batch = await res.json();
      repos.push(...batch);
      if (batch.length < 100) break;
      page++;
    }
  }

  const results = await Promise.allSettled(
    repos.map((repo) =>
      fetch(
        `${API}/repos/${repo.owner.login}/${repo.name}/commits?author=${username}&per_page=${limit}`,
        { headers: headers(token) }
      ).then((r) => (r.ok ? r.json() : null))
    )
  );

  return results
    .map((r, i) => ({ status: r.status, value: r.value, repoName: repos[i].full_name }))
    .filter((r) => r.status === "fulfilled" && Array.isArray(r.value) && r.value.length > 0)
    .flatMap((r) =>
      r.value.map((c) => ({
        repo: r.repoName,
        sha: c.sha,
        message: c.commit.message.split("\n")[0],
        date: c.commit.author.date,
      }))
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);
}   