import React, { useState, useEffect } from "react";
import { css } from "@emotion/css";
import { useFeedWorker } from "@/api/feed.hook";
import OrderTable from "@/components/ordertable";

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

  useEffect(() => {
    setTimeout(() => {
      feed?.postMessage({
        type: "KILL_FEED",
      });
    }, 2000);
  }, []);

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
    <section className={styles.container}>
      <div className={styles.topbar}>
        <h1 style={{ color: "white" }}>{orderBook.ticker}</h1>
        <select
          name="tickSize"
          id="tickSize"
          value={tickSize}
          className={styles.selectDropdown}
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
      </div>

      <div className={styles.inner}>
        <OrderTable
          title="Asks"
          rows={orderBook.asks}
          maxPriceSize={orderBook.maxPriceSize}
          askOrBid={"ask"}
          ticker={orderBook.ticker}
        />
        <OrderTable
          title="Bids"
          rows={orderBook.bids}
          maxPriceSize={orderBook.maxPriceSize}
          askOrBid={"bid"}
          ticker={orderBook.ticker}
        />
      </div>

      <div className={styles.bottomBar}>
        <button className={styles.button} onClick={toggleFeed}>
          Toggle Feed
        </button>
        <button className={styles.button} onClick={killFeed}>
          Kill Feed
        </button>
      </div>
    </section>
  );
};

const styles = {
  container: css`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  `,
  inner: css`
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: center;
    padding: 0px 20px;
    height: 80vh;
    overflow: scroll;
  `,
  topbar: css`
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    width: 100%;
    padding: 0px 20px;
    align-items: center;
  `,
  selectDropdown: css`
    width: 100px;
    height: 30px;
  `,
  bottomBar: css`
    background-color: rgb(35 54 69);
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 10vh;
    max-height: 100px;
  `,
  button: css`
    margin: 0px 20px;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
  `,
};

export default Orderbook;
