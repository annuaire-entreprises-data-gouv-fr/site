import { parseAgentScope } from './parse';

describe('Scopes validation', () => {
  test('valid', () => {
    expect(parseAgentScope('conformite').validScopes).toStrictEqual([
      'conformite',
    ]);
    expect(
      parseAgentScope('conformite beneficiaires').validScopes
    ).toStrictEqual(['conformite', 'beneficiaires']);
    expect(parseAgentScope(' conformite    ').validScopes).toStrictEqual([
      'conformite',
    ]);
  });
  test('invalid', () => {
    expect(parseAgentScope('conformite blah').validScopes).toStrictEqual([
      'conformite',
    ]);
    expect(parseAgentScope('blah bli blu  ').validScopes).toStrictEqual([]);
    expect(parseAgentScope('blah conformite blu').validScopes).toStrictEqual([
      'conformite',
    ]);
    expect(parseAgentScope('blah conformite blu').inValidScopes).toStrictEqual([
      'blah',
      'blu',
    ]);
  });
});

export {};
