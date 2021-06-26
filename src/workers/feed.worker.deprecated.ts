export default {};

const openWebsocket = () => {
  const webSocket = new WebSocket("wss://www.cryptofacilities.com/ws/v1");
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
        console.log("updated feed");
        postMessage({
          type: "ORDER",
          data: data,
        });
        break;
    }
  };
  return webSocket;
};

onmessage = (event) => {
  console.log("---- worker.js received message from main.js ----");
  let webSocket: WebSocket | null = null;
  switch (event.data.type) {
    case "START_FEED":
      webSocket = openWebsocket();
      break;
    case "KILL_FEED":
      console.log("Killing feed...");
      try {
        console.log(webSocket);
        (webSocket as unknown as WebSocket).close();
        webSocket = null;
        console.log(webSocket);
        postMessage({
          type: "FEED_KILLED",
        });
      } catch (e) {
        console.log("---- ERROR -----");
        console.log(e);
      }
      break;
    default:
      console.log("Instructions not specific enough");
      console.log(event);
  }
};
