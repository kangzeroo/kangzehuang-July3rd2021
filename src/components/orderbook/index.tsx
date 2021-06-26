import React, { useEffect } from "react";

const Orderbook = () => {
  useEffect(() => {
    (async () => {
      const worker = new Worker(
        new URL("@/workers/example.worker", import.meta.url)
      );
      worker.addEventListener("message", (event) => {
        console.log("main thread received: ", event.data);
      });
      worker.postMessage("ping from main thread");
    })();
  }, []);
  return <div>🎉</div>;
};
export default Orderbook;
