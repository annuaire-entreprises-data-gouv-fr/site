import { parseAgentScopes } from './parse';

describe('Scopes validation', () => {
  test('valid', () => {
    expect(parseAgentScopes('conformite').validScopes).toStrictEqual([
      'conformite',
    ]);
    expect(
      parseAgentScopes('conformite beneficiaires').validScopes
    ).toStrictEqual(['conformite', 'beneficiaires']);
    expect(parseAgentScopes(' conformite    ').validScopes).toStrictEqual([
      'conformite',
    ]);
  });
  test('invalid', () => {
    expect(parseAgentScopes('conformite blah').validScopes).toStrictEqual([
      'conformite',
    ]);
    expect(parseAgentScopes('blah bli blu  ').validScopes).toStrictEqual([]);
    expect(parseAgentScopes('blah conformite blu').validScopes).toStrictEqual([
      'conformite',
    ]);
    expect(parseAgentScopes('blah conformite blu').inValidScopes).toStrictEqual(
      ['blah', 'blu']
    );
  });
});

export {};
