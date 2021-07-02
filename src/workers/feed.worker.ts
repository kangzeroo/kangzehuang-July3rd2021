import {
  ITickerShape,
  TOrderDelta,
  ICryptoFacilitiesWSSnapshot,
  IOrderBookState,
  ISourceOrderBook,
  IGranularOrderDelta,
  TOrderDeltaWithTimestamp,
} from "@/types/tickerFeed.type";
import {
  groupTickRows,
  refreshOrderBookState,
  getDecimalPlace,
} from "@/api/tick-group/tick-group.api";
class FeedWebSocket {
  feed: WebSocket;
  ticker: string;
  tickSize: number;
  sourceOrderBook: ISourceOrderBook;
  orderBookState: IOrderBookState;
  lastAnnouncedTime: Date;
  announcementIntervalMs = 2000;

  constructor(
    endpoint = "wss://www.cryptofacilities.com/ws/v1",
    ticker: ITickerShape = { ticker: "PI_XBTUSD", tickSize: 0.5 }
  ) {
    this.ticker = ticker.ticker;
    this.tickSize = ticker.tickSize;
    const feed = new WebSocket(endpoint);
    feed.onopen = () => {
      const subscription = {
        event: "subscribe",
        feed: "book_ui_1",
        product_ids: [ticker.ticker],
      };
      this.feed.send(JSON.stringify(subscription));
    };
    feed.onmessage = (event) => {
      const data: ICryptoFacilitiesWSSnapshot = JSON.parse(event.data);
      const decimalPlace = getDecimalPlace(this.tickSize);
      switch (data.feed) {
        case "book_ui_1_snapshot": {
          const dateStamp = new Date();
          this.lastAnnouncedTime = dateStamp;
          this.sourceOrderBook = {
            ...data,
            asks: this.mapDeltaArrayToHash(data.asks, dateStamp, decimalPlace),
            bids: this.mapDeltaArrayToHash(data.bids, dateStamp, decimalPlace),
          };
          const orderBookSnapshot = this.groupByTickSize({
            asks: data.asks,
            bids: data.bids,
            ticker: this.ticker,
            tickSize: this.tickSize,
            dateStamp,
            decimalPlace,
          });
          this.orderBookState = orderBookSnapshot;
          postMessage({
            type: "SNAPSHOT",
            data: orderBookSnapshot,
          });
          break;
        }
        case "book_ui_1": {
          this.updateDelta(data);
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
    const unsubscribe = {
      event: "unsubscribe",
      feed: "book_ui_1",
      product_ids: [this.ticker],
    };
    this.feed.send(JSON.stringify(unsubscribe));
    this.clearState();
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
    const nextOrderBookState = refreshOrderBookState(
      tickSize,
      this.orderBookState
    );
    this.orderBookState = nextOrderBookState;
    this.tickSize = tickSize;
    postMessage({
      type: "SNAPSHOT",
      data: nextOrderBookState,
    });
  }

  closeFeed() {
    try {
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

  private mapDeltaArrayToHash(
    deltaArray: TOrderDelta[],
    dateStamp: Date,
    decimalPlace: number
  ) {
    const deltaHash = deltaArray.reduce(
      (acc: { [key: number]: TOrderDeltaWithTimestamp }, curr) => {
        const [price, size] = curr;
        acc[price] = {
          price: price.toFixed(decimalPlace),
          size,
          date: dateStamp,
        };
        return acc;
      },
      {}
    );
    return deltaHash;
  }

  private updateDelta(orderDelta: IGranularOrderDelta) {
    const currentDateStamp = new Date();
    if (!orderDelta.asks || !orderDelta.bids) {
      return;
    }
    const decimalPlace = getDecimalPlace(this.tickSize);
    if (orderDelta.asks) {
      orderDelta.asks.forEach((delta) => {
        const [price, size] = delta;
        const prevPriceSnap = this.sourceOrderBook.asks[price];
        if (!prevPriceSnap && size) {
          this.sourceOrderBook.asks[price] = {
            price: price.toFixed(decimalPlace),
            size,
            date: currentDateStamp,
          };
        }
        if (prevPriceSnap && prevPriceSnap.date < currentDateStamp) {
          if (size === 0) {
            delete this.sourceOrderBook.asks[price];
          } else {
            this.sourceOrderBook.asks[price] = {
              price: price.toFixed(decimalPlace),
              size,
              date: currentDateStamp,
            };
          }
        }
      });
    }
    if (orderDelta.bids) {
      orderDelta.bids.forEach((delta) => {
        const [price, size] = delta;
        const prevPriceSnap = this.sourceOrderBook.bids[price];
        if (!prevPriceSnap && size) {
          this.sourceOrderBook.bids[price] = {
            price: price.toFixed(decimalPlace),
            size,
            date: currentDateStamp,
          };
        }
        if (prevPriceSnap && prevPriceSnap.date < currentDateStamp) {
          if (size === 0) {
            delete this.sourceOrderBook.bids[price];
          } else {
            this.sourceOrderBook.bids[price] = {
              price: price.toFixed(decimalPlace),
              size,
              date: currentDateStamp,
            };
          }
        }
      });
    }
    const orderBookSnapshot = this.groupByTickSize({
      asks: Object.keys(this.sourceOrderBook.asks).map((key) => {
        const { price, size } = this.sourceOrderBook.asks[parseFloat(key)];
        return [parseFloat(price), size];
      }),
      bids: Object.keys(this.sourceOrderBook.bids).map((key) => {
        const { price, size } = this.sourceOrderBook.bids[parseFloat(key)];
        return [parseFloat(price), size];
      }),
      ticker: this.ticker,
      tickSize: this.tickSize,
      dateStamp: currentDateStamp,
      decimalPlace: getDecimalPlace(this.tickSize),
    });
    const lastAnnouncedTimeMs = this.lastAnnouncedTime.getTime();
    const allowedNextAnnoucement = new Date(
      lastAnnouncedTimeMs + this.announcementIntervalMs
    );
    if (currentDateStamp > allowedNextAnnoucement) {
      this.lastAnnouncedTime = currentDateStamp;
      this.orderBookState = orderBookSnapshot;
      postMessage({
        type: "ORDER",
        data: orderBookSnapshot,
      });
    }
  }

  private clearState() {
    const emptySourceOrderBook = {
      product_id: "",
      numLevels: 0,
      feed: "",
      asks: {},
      bids: {},
    };
    const emptyOrderBookState = {
      ticker: "",
      asks: [],
      bids: [],
      maxPriceSize: 0,
    };
    this.sourceOrderBook = emptySourceOrderBook;
    this.orderBookState = emptyOrderBookState;
  }

  private groupByTickSize({
    bids,
    asks,
    ticker,
    tickSize,
    dateStamp,
    decimalPlace,
  }: {
    bids: TOrderDelta[];
    asks: TOrderDelta[];
    ticker: string;
    tickSize: number;
    dateStamp: Date;
    decimalPlace: number;
  }) {
    const newMaxPriceSize = asks
      .concat(bids)
      .filter((d) => d[1])
      .map((d) => d[1])
      .reduce((acc, curr) => acc + curr, 0);
    const orderBookSnapshot: IOrderBookState = {
      ticker,
      asks: groupTickRows(
        tickSize,
        this.mapDeltaArrayToHash(asks, dateStamp, decimalPlace)
      ),
      bids: groupTickRows(
        tickSize,
        this.mapDeltaArrayToHash(bids, dateStamp, decimalPlace)
      ),
      maxPriceSize: newMaxPriceSize,
    };
    return orderBookSnapshot;
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
