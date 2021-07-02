# Crypto Order Book

This is a simple order book to view recent crypto trades. For optimal frontend performance, it uses web workers to process the huge volume of updates from the websocket server. Orders are throttled before being sent to the frontend UI which handles painting the orders.

![2021-07-03 05 46 37](https://user-images.githubusercontent.com/22982964/124331578-0e995400-dbc2-11eb-9a50-802e5459d63e.gif)

This project is currently written in Javascript as a proof of concept, but will be moved to Typescript for final submission.

See it in production:
https://crypto-orderbook-orcin.vercel.app/

Or to run it locally:

```
$ npm run start
```

and then visit `localhost:3000/index.html`