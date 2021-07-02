import { groupTickRows } from "./tick-group.api";

test("groups tickSize of 1", () => {
  //
  const tickSize = 1;
  const inputOrderDeltas = {
    11: { price: "11", size: 1 },
    10.6: { price: "10.6", size: 2 },
    10.4: { price: "10.4", size: 3 },
    10.56: { price: "10.56", size: 4 },
    10.55: { price: "10.55", size: 5 },
    10.66: { price: "10.666", size: 6 },
  };
  const output = {
    "10": { price: "10", size: 6, total: 20 },
    "11": { price: "11", size: 1, total: 21 },
  };
  expect(groupTickRows(tickSize, inputOrderDeltas)).toStrictEqual(output);
});

test("groups tickSize of 0.5", () => {
  //
  const tickSize = 0.5;
  const inputOrderDeltas = {
    11: { price: "11", size: 1 },
    10.6: { price: "10.6", size: 2 },
    10.4: { price: "10.4", size: 3 },
    10.56: { price: "10.56", size: 4 },
    10.55: { price: "10.55", size: 5 },
    10.66: { price: "10.666", size: 6 },
  };
  const output = {
    "10.0": { price: "10.0", size: 3, total: 3 },
    "10.5": { price: "10.5", size: 6, total: 20 },
    "11.0": { price: "11.0", size: 1, total: 21 },
  };
  expect(groupTickRows(tickSize, inputOrderDeltas)).toStrictEqual(output);
});

test("groups tickSize of 0.05", () => {
  //
  const tickSize = 0.05;
  const inputOrderDeltas = {
    11: { price: "11", size: 1 },
    10.6: { price: "10.6", size: 2 },
    10.4: { price: "10.4", size: 3 },
    10.56: { price: "10.56", size: 4 },
    10.55: { price: "10.55", size: 5 },
    10.66: { price: "10.666", size: 6 },
  };
  const output = {
    "10.40": { price: "10.40", size: 3, total: 3 },
    "10.55": { price: "10.55", size: 4, total: 12 },
    "10.60": { price: "10.60", size: 2, total: 14 },
    "10.65": { price: "10.65", size: 6, total: 20 },
    "11.00": { price: "11.00", size: 1, total: 21 },
  };
  const results = groupTickRows(tickSize, inputOrderDeltas);
  expect(results).toStrictEqual(output);
});
