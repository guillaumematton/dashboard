import { Suspense } from "react";
import Dashboard from "../components/dashboard";
import YouTubeLive from "../components/youtube";

export default function Page() {
  return (
    <Dashboard
      youtubeSlot={
        <Suspense fallback={<p>Loading YouTube Live...</p>}>
          <YouTubeLive channelId="UCyMXuuk-eHgkLuaa6L95iMg" />
        </Suspense>
      }
    />
  );
}