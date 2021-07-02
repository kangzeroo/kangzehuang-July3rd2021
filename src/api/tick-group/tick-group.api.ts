import {
  TOrderRow,
  TOrderDelta,
  IOrderBookState,
} from "@/types/tickerFeed.type";

// const input = [
//   [11, 1],
//   [10.6, 2],
//   [10.4, 3],
//   [10.56, 4],
//   [10.55, 5],
//   [10.502, 6],
// ];
// const output = [
//   [11, 1, 1],
//   [10, 2, 3],
//   [10, 3, 6],
//   [10, 4, 10],
//   [10, 5, 15],
//   [10, 6, 21],
// ];

export const refreshOrderBookState = (
  tickSize: number,
  prevOrderBookState: IOrderBookState
): IOrderBookState => {
  const convertToOrderDeltas = (orderRows: TOrderRow[]): TOrderDelta[] => {
    return orderRows.map((row) => {
      return [row.price, row.size];
    });
  };
  const nextOrderBookState = {
    ticker: prevOrderBookState.ticker,
    bids: groupTickRows(
      tickSize,
      convertToOrderDeltas(prevOrderBookState.bids)
    ),
    asks: groupTickRows(
      tickSize,
      convertToOrderDeltas(prevOrderBookState.asks)
    ),
    maxPriceSize: prevOrderBookState.asks
      .concat(prevOrderBookState.bids)
      .filter((d) => d.size)
      .map((d) => d.size)
      .reduce((acc, curr) => acc + curr, 0),
  };
  return nextOrderBookState;
};

export const groupTickRows = (
  tickSize: number,
  orderDeltas: TOrderDelta[]
): TOrderRow[] => {
  // input to output
  // 10.666 --> 10      tick 1
  // 10.666 --> 10.5    tick 0.5
  // 10.666 --> 10.65   tick 0.05

  // STEP 1: Round down the number to the same decimal as the tickSize
  // 10.666 --> 10      tick 1
  // 10.666 --> 10.6    tick 0.5
  // 10.666 --> 10.66   tick 0.05

  // STEP 2: Divide the rounded by the floor(tickSize)
  // 10 / 1 = 10            --> 10
  // 10.6 / 0.5 = 21.2      --> 21
  // 10.66 / 0.05 = 213.2   --> 213

  // STEP 3: Mutiply by the tickSize
  // 10 x 1 = 10
  // 21 x 0.5 = 10.5
  // 213 x 0.05 = 10.65

  const roundDownToTickDecimals = (input: number, tickSize: number) => {
    // get the decimal places of the tickSize
    const decimalPlace =
      Math.floor(tickSize) === tickSize
        ? 0
        : tickSize.toString().split(".")[1]?.length || 0;
    if (decimalPlace === 0) {
      return Math.floor(input);
    }
    // round down input to the decimal of the tickSize
    const roundedToDecimalOfTickSize =
      Math.floor(input * Math.pow(10, decimalPlace)) /
      Math.pow(10, decimalPlace);
    // Divide the rounded by the floor(tickSize)
    const roundedDown = parseFloat(
      (
        Math.floor(
          parseFloat((roundedToDecimalOfTickSize / tickSize).toFixed(10))
        ) * tickSize
      ).toFixed(decimalPlace)
    );
    return roundedDown;
  };

  let total = 0;
  const grouping = orderDeltas.map((delta) => {
    const [price, size] = delta;
    total += size;
    return {
      price: roundDownToTickDecimals(price, tickSize),
      size,
      total,
    };
  });
  return grouping;
};
