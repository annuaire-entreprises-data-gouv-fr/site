import { mapToAgentScopes } from './map-to-agent-scopes';

describe('Scopes validation', () => {
  test('valid', () => {
    expect(mapToAgentScopes('conformite')).toBe('conformite');
    expect(mapToAgentScopes('conformite beneficiaires')).toBe(
      'conformite beneficiaires'
    );
  });
  test('invalid', () => {
    expect(mapToAgentScopes('conformite blah')).toBe('conformite');
    expect(mapToAgentScopes('blah bli blu')).toBe('');
    expect(mapToAgentScopes('blah conformite blu')).toBe('');
  });
});

export {};
