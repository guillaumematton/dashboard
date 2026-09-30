import YouTubePlayer from "./youtubePlayer";

// Simple in-memory cache (resets on server restart)
let cache = { videoId: null, timestamp: 0 };
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export default async function YouTubeLive({ channelId }) {
  const now = Date.now();

  // Serve from cache if fresh
  if (cache.videoId !== null && now - cache.timestamp < CACHE_TTL) {
    return cache.videoId
      ? <YouTubePlayer videoId={cache.videoId} />
      : <p>Channel is not currently live.</p>;
  }

  const apiKey = process.env.YOUTUBE_API_KEY;

  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&eventType=live&type=video&maxResults=1&order=date&key=${apiKey}`
  );

  if (res.status === 429) {
    // Quota exhausted — serve stale cache or show error
    return cache.videoId
      ? <YouTubePlayer videoId={cache.videoId} />
      : <p>Quota exceeded, try again later.</p>;
  }

  const data = await res.json();
  const videoId = data.items?.[0]?.id?.videoId ?? null;

  cache = { videoId, timestamp: now };

  if (!videoId) return <p>Channel is not currently live.</p>;

  return <YouTubePlayer videoId={videoId} />;
}   