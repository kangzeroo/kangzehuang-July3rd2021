export interface ITickerShape {
  ticker: string;
  tickSize: number;
}

export type TOrderRow = {
  price: number;
  size: number;
  total: number;
};

type TPrice = number;
type TSize = number;
export type TOrderDelta = [TPrice, TSize];

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
}
