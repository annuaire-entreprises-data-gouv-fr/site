import { formatAdresse } from './formatting';

const adresses = [
  {
    adressObject: {},
    adressString: '',
  },
];

describe('Check formatAdresse', () => {
  adresses.map(({ adressObject, adressString }) =>
    test('Success : ' + adressString, () => {
      expect(formatAdresse(adressObject)).toBe(adressString);
    })
  );
});

export {};
