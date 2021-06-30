import { useState, useEffect, useRef } from "react";

type TPrice = number;
type TSize = number;
type TOrderDelta = [TPrice, TSize];

const sortRows = (orderDeltas: TOrderDelta[]): TOrderRow[] => {
  return orderDeltas.map((delta) => {
    return {
      price: delta[0],
      total: delta[0],
      size: delta[1],
    };
  });
};

type TOrderRow = {
  price: number;
  size: number;
  total: number;
};
interface IOrderBook {
  ticker: string;
  asks: TOrderRow[];
  bids: TOrderRow[];
}

export const useFeedWorker = () => {
  const [status, setStatus] = useState("loading");
  const [orderBook, setOrderBook] = useState<IOrderBook>();
  const worker = useRef<Worker>();

  useEffect(() => {
    (async () => {
      console.log("useFeedWorker");
      worker.current = new Worker(
        new URL("@/workers/feed.worker", import.meta.url)
      );
      setStatus("ready");
      // worker.current.postMessage({ type: "START_FEED" });
      worker.current.onmessage = (event) => {
        // console.log(">>>>");
        switch (event.data.type) {
          case "SNAPSHOT":
            const feedData = event.data.data;
            console.log("---- snapshot ----", feedData);
            const orderBookSnapshot = {
              ticker: "PI_XBTUSD",
              asks: sortRows(feedData.asks),
              bids: sortRows(feedData.bids),
            };
            setOrderBook(orderBookSnapshot);
            break;
          case "ORDER":
            // console.log("---- delta ----", event.data);
            break;
          case "FEED_KILLED":
            console.log("feed was killed");
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
