class FeedWebSocket {
  feed: WebSocket;

  constructor(endpoint = "wss://www.cryptofacilities.com/ws/v1") {
    console.log("CONSTRUCOTR!!");
    const feed = new WebSocket(endpoint);
    feed.onopen = (event) => {
      const subscription = {
        event: "subscribe",
        feed: "book_ui_1",
        product_ids: ["PI_XBTUSD"],
      };
      this.feed.send(JSON.stringify(subscription));
    };
    feed.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.feed) {
        case "book_ui_1_snapshot":
          postMessage({
            type: "SNAPSHOT",
            data: data,
          });
          break;
        case "book_ui_1":
          console.log("-- updated feed");
          postMessage({
            type: "ORDER",
            data: data,
          });
          break;
      }
    };
    feed.onclose = (event) => {
      console.log("Feed was closed!");
      console.log(event);
    };
    feed.onerror = (error) => {
      console.log("Error happened!");
      this.feed.close();
      throw error;
    };
    this.feed = feed;
  }

  startFeed() {}

  closeFeed() {
    try {
      console.log(this.feed);
      const unsubscribe = {
        event: "unsubscribe",
        feed: "book_ui_1",
        product_ids: ["PI_XBTUSD"],
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

onmessage = (event) => {
  const feed = new FeedWebSocket();
  switch (event.data.type) {
    case "START_FEED":
      feed.startFeed();
      break;
    case "KILL_FEED":
      feed.closeFeed();
      break;
    default:
      console.log("Instructions not specific enough");
      console.log(event);
  }
};

export default {};
