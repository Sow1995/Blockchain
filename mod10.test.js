const mod10sha = require('./app')

array1 = []
array2 = []

test('test mod10sha uitkomst', () => {
    expect(mod10sha('00007d8ac836bcd38a96a04eec30216360725c3623f789a4c413bcef1e51a91bCMGT Mining CorporationBastiaan 0870417115838536770261583853823123160233')).toBe("5719456502");
  });

