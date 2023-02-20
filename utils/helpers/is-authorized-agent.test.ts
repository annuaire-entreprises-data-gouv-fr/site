import { isAuthorizedAgent } from './is-authorized-agent';

describe('Check isAuthorizedAgent', () => {
  test('Check users', () => {
    expect(isAuthorizedAgent('xavier.jouppe@beta.gouv.fr')).toBe(true);

    expect(isAuthorizedAgent('user@yopmail.com')).toBe(false);
    expect(isAuthorizedAgent('user2@yopmail.com')).toBe(false);
  });
});

export {};
