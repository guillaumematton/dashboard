import { Suspense } from "react";
import Dashboard from "../components/dashboard";
import YouTubeLive from "../components/youtube";
import GithubActivity from "../components/githubActivity";

export default function Page() {
  return (
    <Dashboard
      youtubeSlot={
        <Suspense fallback={<p>Loading YouTube Live...</p>}>
          <YouTubeLive channelId="UCyMXuuk-eHgkLuaa6L95iMg" />
        </Suspense>
      }
      githubSlot={
        <Suspense fallback={<p>Loading GitHub Activity...</p>}>
          <GithubActivity username="Bat-J" />
        </Suspense>
      }
    />
  );
}