"use client"
import React, { useState } from "react";
import YouTubePlayer from "./youtubePlayer";

export default function YoutubeVideo() {
  const [text, setText] = useState("");
  const [showContent, setShowContent] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (text.trim()) {
      setShowContent(true);
    }
  };

  return (
    <div>
      {!showContent ? (
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            value={text} 
            onChange={(e) => setText(e.target.value)} 
            placeholder="Enter the video ID"
          />
          <button type="submit">Submit</button>
        </form>
      ) : (
        <YouTubePlayer videoId={text} />
      )}
    </div>
  );
}