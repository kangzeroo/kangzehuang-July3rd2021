export interface ITickerShape {
  ticker: string;
  tickSize: number;
}

export type TOrderRow = {
  price: number;
  size: number;
  total: number;
};

export type TAskOrBid = "ask" | "bid";

type TPrice = number;
type TSize = number;
export type TOrderDelta = [TPrice, TSize];
export type TOrderDeltaWithTimestamp = {
  price: TPrice;
  size: TSize;
  date: Date;
};

export interface ICryptoFacilitiesWSSnapshot {
  product_id: string;
  numLevels: number;
  feed: string;
  bids: TOrderDelta[];
  asks: TOrderDelta[];
}

export interface IOrderBookState {
  ticker: string;
  asks: TOrderRow[];
  bids: TOrderRow[];
  maxPriceSize: number;
}

export interface ISourceOrderBook {
  product_id: string;
  numLevels: number;
  feed: string;
  asks: { [key: number]: TOrderDeltaWithTimestamp };
  bids: { [key: number]: TOrderDeltaWithTimestamp };
}

export interface IGranularOrderDelta {
  product_id: string;
  feed: string;
  asks: TOrderDelta[];
  bids: TOrderDelta[];
}
