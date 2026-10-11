import {fetchLatestCommits} from "../../../components/github";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    const repoFilter = searchParams.get("repoFilter");
    const limit = Number(searchParams.get("limit")) || 20;

    const token = process.env.GITHUB_TOKEN;

    try {
        const commits = await fetchLatestCommits(token, username, limit, repoFilter);
        return Response.json({ commits });
    } catch (err) {
        return Response.json({ error: err.message }, { status: 500 });
    }
}
