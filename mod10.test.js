var myFunctions = require("./app")
array = [
  [
    0, 1, 2, 3, 4,
    5, 6, 7, 8, 9
  ],
  [
    0, 1, 2, 3, 4,
    5, 6, 7, 8, 9
  ],
  [
    0, 1, 2, 3, 4,
    5, 6, 7, 8, 9
  ],
];

arrayExpect = [0, 3, 6, 9, 2, 5, 8, 1, 4, 7]

test('test mod10sha uitkomst', () => {
  expect(myFunctions.mod10sha('00007d8ac836bcd38a96a04eec30216360725c3623f789a4c413bcef1e51a91bCMGT Mining CorporationBastiaan 0870417115838536770261583853823123160233')).toBe("5719456502");
});

test('test mod10alg uitkomst', () => {
  expect(myFunctions.mod10alg(array,...array.splice(0,1))).toStrictEqual(arrayExpect);
});