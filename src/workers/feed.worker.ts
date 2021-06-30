import {
  ITickerShape,
  TOrderDelta,
  ICryptoFacilitiesWSSnapshot,
} from "@/types/tickerFeed.type";
import { groupTickRows } from "@/api/tick-group/tick-group.api";
class FeedWebSocket {
  feed: WebSocket;
  ticker: string;
  tickSize: number;

  constructor(
    endpoint = "wss://www.cryptofacilities.com/ws/v1",
    ticker: ITickerShape = { ticker: "PI_XBTUSD", tickSize: 0.5 }
  ) {
    console.log("CONTR");
    this.ticker = ticker.ticker;
    this.tickSize = ticker.tickSize;
    const feed = new WebSocket(endpoint);
    feed.onopen = () => {
      const subscription = {
        event: "subscribe",
        feed: "book_ui_1",
        product_ids: [ticker.ticker],
      };
      console.log(subscription);
      this.feed.send(JSON.stringify(subscription));
    };
    feed.onmessage = (event) => {
      const data: ICryptoFacilitiesWSSnapshot = JSON.parse(event.data);
      switch (data.feed) {
        case "book_ui_1_snapshot": {
          console.log(data);
          const orderBookSnapshot = this.groupByTickSize({
            asks: data.asks,
            bids: data.bids,
            ticker: data.product_id,
            tickSize: this.tickSize,
          });
          postMessage({
            type: "SNAPSHOT",
            data: orderBookSnapshot,
          });
          break;
        }
        case "book_ui_1": {
          // console.log("-- updated feed");
          postMessage({
            type: "ORDER",
            data: data,
          });
          break;
        }
      }
    };
    feed.onclose = () => {
      console.log("Feed was closed!");
    };
    feed.onerror = (error) => {
      console.log("Error happened!");
      this.feed.close();
      throw error;
    };
    this.feed = feed;
  }

  toggleFeed(ticker: ITickerShape) {
    console.log(`Switching from ${this.ticker} to ${ticker.ticker}`);
    const unsubscribe = {
      event: "unsubscribe",
      feed: "book_ui_1",
      product_ids: [this.ticker],
    };
    this.feed.send(JSON.stringify(unsubscribe));
    const subscription = {
      event: "subscribe",
      feed: "book_ui_1",
      product_ids: [ticker.ticker],
    };
    this.feed.send(JSON.stringify(subscription));
    this.ticker = ticker.ticker;
    this.tickSize = ticker.tickSize;
  }

  changeTickSize(tickSize: number) {
    this.tickSize = tickSize;
  }

  groupByTickSize({
    bids,
    asks,
    ticker,
    tickSize,
  }: {
    bids: TOrderDelta[];
    asks: TOrderDelta[];
    ticker: string;
    tickSize: number;
  }) {
    const orderBookSnapshot = {
      ticker,
      asks: groupTickRows(tickSize, asks),
      bids: groupTickRows(tickSize, bids),
    };
    return orderBookSnapshot;
  }

  closeFeed() {
    try {
      console.log("closeFeed", this.feed);
      const unsubscribe = {
        event: "unsubscribe",
        feed: "book_ui_1",
        product_ids: [this.ticker],
      };
      this.feed.send(JSON.stringify(unsubscribe));
      this.feed.close();
      postMessage({
        type: "FEED_KILLED",
      });
    } catch (e) {
      console.log("Caught error");
      throw e;
    }
  }
}

const feed = new FeedWebSocket();
onmessage = (event: MessageEvent) => {
  switch (event.data.type) {
    case "TOGGLE_FEED": {
      feed.toggleFeed(event.data.ticker);
      break;
    }
    case "CHANGE_TICK_SIZE": {
      feed.changeTickSize(event.data.tickSize);
      break;
    }
    case "KILL_FEED": {
      feed.closeFeed();
      break;
    }
    default: {
      console.log("Instructions not specific enough");
      console.log(event);
    }
  }
};

export default {};
