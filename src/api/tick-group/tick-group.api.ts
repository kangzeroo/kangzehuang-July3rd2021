import { TOrderRow, TOrderDelta } from "@/types/tickerFeed.type";

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
    console.log("input: ", input);
    console.log("tickSize: ", tickSize);
    // get the decimal places of the tickSize
    const decimalPlace =
      Math.floor(tickSize) === tickSize
        ? 0
        : tickSize.toString().split(".")[1].length || 0;
    console.log("decimalPlace: ", decimalPlace);
    if (decimalPlace === 0) {
      return Math.floor(input);
    }
    console.log(
      "input * Math.pow(10, decimalPlace) = ",
      Math.floor(input * Math.pow(10, decimalPlace))
    );
    console.log("Math.pow(10, decimalPlace) = ", Math.pow(10, decimalPlace));
    // round down input to the decimal of the tickSize
    const roundedToDecimalOfTickSize =
      Math.floor(input * Math.pow(10, decimalPlace)) /
      Math.pow(10, decimalPlace);
    console.log("roundedToDecimalOfTickSize: ", roundedToDecimalOfTickSize);
    console.log(
      "roundedToDecimalOfTickSize / tickSize ",
      roundedToDecimalOfTickSize / tickSize
    );
    console.log(
      "Math.round(roundedToDecimalOfTickSize / tickSize) = ",
      Math.round(roundedToDecimalOfTickSize / tickSize)
    );
    // Divide the rounded by the floor(tickSize)
    const roundedDown = parseFloat(
      (
        Math.floor(
          parseFloat((roundedToDecimalOfTickSize / tickSize).toFixed(10))
        ) * tickSize
      ).toFixed(decimalPlace)
    );
    console.log(`roundedDown: ${roundedDown}`);

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

  console.log(grouping);

  return grouping;
};
