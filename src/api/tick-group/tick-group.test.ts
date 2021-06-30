import { groupTickRows } from "./tick-group.api";
import { TOrderDelta } from "@/types/tickerFeed.type";

// test("groups tickSize of 1", () => {
//   //
//   const tickSize = 1;
//   const inputOrderDeltas: TOrderDelta[] = [
//     [11, 1],
//     [10.6, 2],
//     [10.4, 3],
//     [10.56, 4],
//     [10.55, 5],
//     [10.666, 6],
//   ];
//   const output = [
//     [11, 1, 1],
//     [10, 2, 3],
//     [10, 3, 6],
//     [10, 4, 10],
//     [10, 5, 15],
//     [10, 6, 21],
//   ];
//   expect(groupTickRows(tickSize, inputOrderDeltas)).toBe(output);
// });

// test("groups tickSize of 0.5", () => {
//   //
//   const tickSize = 0.5;
//   const inputOrderDeltas: TOrderDelta[] = [
//     [11, 1],
//     [10.6, 2],
//     [10.4, 3],
//     [10.56, 4],
//     [10.55, 5],
//     [10.666, 6],
//   ];
//   const output = [
//     [11, 1, 1],
//     [10.5, 2, 3],
//     [10.0, 3, 6],
//     [10.5, 4, 10],
//     [10.5, 5, 15],
//     [10.5, 6, 21],
//   ];
//   expect(groupTickRows(tickSize, inputOrderDeltas)).toBe(output);
// });

test("groups tickSize of 0.05", () => {
  //
  const tickSize = 0.05;
  const inputOrderDeltas: TOrderDelta[] = [
    [11, 1],
    [10.6, 2],
    [10.4, 3],
    [10.56, 4],
    [10.55, 5],
    [10.666, 6],
  ];
  const output = [
    { price: 11, size: 1, total: 1 },
    { price: 10.6, size: 2, total: 3 },
    { price: 10.4, size: 3, total: 6 },
    { price: 10.55, size: 4, total: 10 },
    { price: 10.55, size: 5, total: 15 },
    { price: 10.65, size: 6, total: 21 },
  ];
  expect(groupTickRows(tickSize, inputOrderDeltas)).toBe(output);
});
