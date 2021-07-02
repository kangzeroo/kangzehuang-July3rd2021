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
      worker.current.onmessage = (event) => {
        switch (event.data.type) {
          case "SNAPSHOT": {
            const orderBookSnapshot: IOrderBookState = event.data.data;
            console.log(orderBookSnapshot);
            setOrderBook(Object.freeze(orderBookSnapshot));
            break;
          }
          case "ORDER": {
            const orderBookSnapshot: IOrderBookState = event.data.data;
            console.log(orderBookSnapshot);
            setOrderBook(Object.freeze(orderBookSnapshot));
            break;
          }
          case "FEED_KILLED":
            console.log("frontend: feed killed");
            break;
        }
      };
      setStatus("ready");
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
