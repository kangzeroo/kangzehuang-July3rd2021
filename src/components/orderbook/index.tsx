import React, { useEffect } from "react";
import { useFeedWorker } from "@/api/feed.hook";

const Orderbook = () => {
  const { status, feed } = useFeedWorker();

  if (status === "loading") {
    return <p>Feed Connection Loading...</p>;
  }

  const startFeed = () => {
    console.log("Starting feed...");
    console.log(feed);
    feed?.postMessage({ type: "START_FEED" });
  };

  const killFeed = () => {
    console.log("Killing feed...");
    feed?.postMessage({
      type: "KILL_FEED",
    });
  };

  return (
    <section>
      <button onClick={startFeed}>Start Feed</button>
      <button onClick={killFeed}>Kill Feed</button>
    </section>
  );
};
export default Orderbook;
