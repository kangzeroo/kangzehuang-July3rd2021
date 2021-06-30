class FeedWebSocket {
  feed: WebSocket;

  startFeed(endpoint = "wss://www.cryptofacilities.com/ws/v1") {
    const feed = new WebSocket(endpoint);
    feed.onopen = () => {
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

  closeFeed() {
    try {
      console.log("closeFeedd", this.feed);
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

let feed: FeedWebSocket | undefined;
onmessage = (event) => {
  switch (event.data.type) {
    case "START_FEED": {
      const isFeedAlreadyExists = feed ? true : false;
      console.log("isFeedAlreadyExists: ", isFeedAlreadyExists);
      if (!isFeedAlreadyExists) {
        feed = new FeedWebSocket();
        feed.startFeed();
      }
      break;
    }
    case "KILL_FEED": {
      if (feed) {
        feed?.closeFeed();
        feed = undefined;
      }
      break;
    }
    default: {
      console.log("Instructions not specific enough");
      console.log(event);
    }
  }
};

export default {};
