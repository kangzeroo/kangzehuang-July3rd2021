export default {};

let webSocket: WebSocket | null = null;

const openWebsocket = () => {
  webSocket = new WebSocket("wss://www.cryptofacilities.com/ws/v1");
  webSocket.onopen = (event) => {
    const subscription = {
      event: "subscribe",
      feed: "book_ui_1",
      product_ids: ["PI_XBTUSD"],
    };
    webSocket?.send(JSON.stringify(subscription));
  };
  webSocket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    switch (data.feed) {
      case "book_ui_1_snapshot":
        postMessage({
          type: "SNAPSHOT",
          data: data,
        });
        break;
      case "book_ui_1":
        postMessage({
          type: "ORDER",
          data: data,
        });
        break;
    }
  };
};

onmessage = (event) => {
  console.log("---- worker.js received message from main.js ----");
  switch (event.data.type) {
    case "KILL_FEED":
      console.log("Killing feed...");
      try {
        webSocket?.close();
        webSocket = null;
        postMessage({
          type: "FEED_KILLED",
        });
      } catch (e) {
        console.log("---- ERROR -----");
        console.log(e);
      }
      break;
    case "START_FEED":
      openWebsocket();
      break;
    default:
      console.log("Instructions not specific enough");
      console.log(event);
  }
};
