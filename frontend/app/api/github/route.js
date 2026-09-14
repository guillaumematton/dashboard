export async function POST(request) {
  const contentType = request.headers.get("content-type") || "";
  let params;

  if (contentType.includes("application/json")) {
    params = await request.json();
  } else {
    const text = await request.text();
    params = Object.fromEntries(new URLSearchParams(text));
  }

  const res = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code: params.code,
      code_verifier: params.code_verifier, // forward this through — GitHub requires it
    }),
  });

  const data = await res.json();
  return Response.json(data);
}