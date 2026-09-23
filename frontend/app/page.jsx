import { Suspense } from "react";
import Dashboard from "../components/dashboard";
import YouTubeLive from "../components/youtube";
import GithubActivity from "../components/githubActivity";
import Weather from "../components/weather";
import Clock from "../components/clock";

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
      weatherSlot={
        <Suspense fallback={<p>Loading Weather...</p>}>
          <Weather />
        </Suspense>
      }
      clockSlot={
        <Suspense fallback={<p>Loading Clock...</p>}>
          <Clock />
        </Suspense>
      }
    />
  );
}