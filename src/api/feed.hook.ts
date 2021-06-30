import { useState, useEffect, useRef } from "react";
import { IOrderBookState } from "@/types/tickerFeed.type";

interface IUseFeedWorker {
  status: string;
  feed: Worker | null;
  orderBook: IOrderBookState | undefined;
}
export const useFeedWorker = (): IUseFeedWorker => {
  const [status, setStatus] = useState("loading");
  const [orderBook, setOrderBook] = useState<IOrderBookState>();
  const worker = useRef<Worker>();

  useEffect(() => {
    (async () => {
      console.log("useFeedWorker");
      worker.current = new Worker(
        new URL("@/workers/feed.worker", import.meta.url)
      );
      setStatus("ready");
      worker.current.onmessage = (event) => {
        switch (event.data.type) {
          case "SNAPSHOT": {
            const orderBookSnapshot: IOrderBookState = event.data.data;
            console.log(orderBookSnapshot);
            setOrderBook(orderBookSnapshot);
            break;
          }
          case "ORDER":
            // console.log("---- delta ----", event.data);
            break;
          case "FEED_KILLED":
            console.log("frontend: feed killed");
            break;
        }
      };
    })();
  }, []);

  if (worker && worker?.current && status === "ready") {
    return {
      status: "ready",
      feed: worker.current,
      orderBook,
    };
  }
  return {
    status: "loading",
    feed: null,
    orderBook,
  };
};
