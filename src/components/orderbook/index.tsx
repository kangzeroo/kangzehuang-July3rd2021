import React, { useState } from "react";
import { useFeedWorker } from "@/api/feed.hook";

const feedTickerOptions = {
  PI_XBTUSD: {
    tickSize: 0.5,
    ticker: "PI_XBTUSD",
  },
  PI_ETHUSD: {
    tickSize: 0.05,
    ticker: "PI_ETHUSD",
  },
};

const Orderbook = () => {
  const { status, feed, orderBook } = useFeedWorker();
  const [tickSize, setTickSize] = useState(
    feedTickerOptions.PI_ETHUSD.tickSize
  );

  if (status === "loading") {
    return <p>Feed Connection Loading...</p>;
  }

  const toggleFeed = () => {
    console.log("Toggle feed...");
    console.log(orderBook?.ticker);
    const nextToggleState =
      orderBook?.ticker === feedTickerOptions.PI_ETHUSD.ticker
        ? feedTickerOptions.PI_XBTUSD
        : feedTickerOptions.PI_ETHUSD;
    // setTicker(nextToggleState.ticker);
    setTickSize(nextToggleState.tickSize);
    feed?.postMessage({ type: "TOGGLE_FEED", ticker: nextToggleState });
  };

  const killFeed = () => {
    console.log("Killing feed...");
    feed?.postMessage({
      type: "KILL_FEED",
    });
  };

  const changeTickSize = (nativeEvent: React.BaseSyntheticEvent) => {
    console.log(nativeEvent);
    console.log(nativeEvent.target.value);
    const nextTickSize = nativeEvent.target.value;
    setTickSize(nextTickSize);
    feed?.postMessage({
      type: "CHANGE_TICK_SIZE",
      tickSize: nextTickSize,
    });
  };

  const tickSizeOptions = [1, 0.5, 0.05];

  if (!orderBook) {
    return null;
  }

  return (
    <section style={{ overflow: "scroll", maxHeight: "800px" }}>
      <h1>{orderBook?.ticker}</h1>
      <select
        name="tickSize"
        id="tickSize"
        value={tickSize}
        onChange={(e) =>
          changeTickSize(e.nativeEvent as unknown as React.BaseSyntheticEvent)
        }
      >
        {tickSizeOptions.map((tickSize) => {
          return (
            <option key={tickSize} value={tickSize}>
              {tickSize}
            </option>
          );
        })}
      </select>
      <button onClick={toggleFeed}>Toggle Feed</button>
      <button onClick={killFeed}>Kill Feed</button>
      <p>{`${JSON.stringify(orderBook).length} chars length`}</p>
      <br />

      <div>{JSON.stringify(orderBook)}</div>
    </section>
  );
};
export default Orderbook;
