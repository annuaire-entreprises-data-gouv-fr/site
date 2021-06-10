import { isLuhnValid, isSiren, isSiret } from './siren-and-siret';

describe('Check isSiren', () => {
  test('Succeed with valid siren', () => {
    expect(isSiren('356000000')).toBe(true);
    expect(isSiren('880878145')).toBe(true);
  });
  test('Fails with invalid siren', () => {
    expect(isSiren('35600')).toBe(false);
    expect(isSiren('88087814553')).toBe(false);
    expect(isSiren('8808ad14553')).toBe(false);
    expect(isSiren('8808781455300000888')).toBe(false);
  });

  test('Fails with valid siret', () => {
    expect(isSiren('35600000000000')).toBe(false);
    expect(isSiren('88087814500015')).toBe(false);
  });
});

describe('Check isSiret', () => {
  test('Succeed with valid siret', () => {
    expect(isSiret('35600000000000')).toBe(true);
    expect(isSiret('88087814500015')).toBe(true);
  });
  test('Fails with invalid siret', () => {
    expect(isSiret('35600')).toBe(false);
    expect(isSiret('8808781455300000')).toBe(false);
    expect(isSiret('8808ad1455300000')).toBe(false);
    expect(isSiret('8808781455300000888')).toBe(false);
  });

  test('Fails with valid siren', () => {
    expect(isSiret('356000000')).toBe(false);
    expect(isSiret('880878145')).toBe(false);
  });
});

describe('Check isLuhnValid', () => {
  test('La Poste always works', () => {
    expect(isLuhnValid('356000000')).toBe(true);
    expect(isLuhnValid('35600000054')).toBe(true);
    expect(isLuhnValid('3560000005454')).toBe(true);
  });

  test('Ganymede works', () => {
    expect(isLuhnValid('880878145')).toBe(true);
    expect(isLuhnValid('88087814554')).toBe(false);
    expect(isLuhnValid('88087814500015')).toBe(true);
  });

  test('Random string dosesnot work', () => {
    expect(isLuhnValid('000000001')).toBe(false);
    expect(isLuhnValid('aaaaaaaaa')).toBe(false);
    expect(isLuhnValid('3500000005454')).toBe(false);
    expect(isLuhnValid('8808781455300000')).toBe(false);
  });
});

export {};
