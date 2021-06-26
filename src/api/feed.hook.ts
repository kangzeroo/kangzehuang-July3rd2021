import React, { useEffect, useRef } from "react";

export const useFeedWorker = async () => {
  const worker = useRef<Worker>();

  useEffect(() => {
    (async () => {
      worker.current = new Worker(
        new URL("@/workers/feed.worker", import.meta.url)
      );
      worker.current.postMessage({ type: "START_FEED" });
      worker.current.onmessage = (event) => {
        switch (event.data.type) {
          case "SNAPSHOT":
            console.log("---- snapshot ----", event.data);
            break;
          case "ORDER":
            console.log("---- delta ----", event.data);
            break;
          case "FEED_KILLED":
            console.log("feed was killed");
            break;
        }
      };
    })();
  });
  return worker;
};
