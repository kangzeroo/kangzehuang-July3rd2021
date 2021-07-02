export interface ITickerShape {
  ticker: string;
  tickSize: number;
}

export type TOrderRow = {
  price: TPriceDisplay;
  size: number;
  total: number;
};

export type TOrderRowUntotaled = {
  price: TPriceDisplay;
  size: number;
  total?: number;
  date?: Date;
};

export type TAskOrBid = "ask" | "bid";

type TPriceDisplay = string;
type TPrice = number;
type TSize = number;
export type TOrderDeltaForDisplay = [TPriceDisplay, TSize];
export type TOrderDelta = [TPrice, TSize];
export type TOrderDeltaWithTimestamp = {
  price: TPriceDisplay;
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

export interface IOrderRowHash {
  [key: number]: TOrderRow;
}

export interface IOrderBookState {
  ticker: string;
  asks: IOrderRowHash;
  bids: IOrderRowHash;
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
