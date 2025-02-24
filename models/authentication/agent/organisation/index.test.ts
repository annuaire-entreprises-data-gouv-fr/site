import { CanRequestAuthorizationException } from '#models/authentication/authentication-exceptions';
import { AgentOrganisation } from '.';

describe('AgentOrganisation class', () => {
  test('ADEME passes', async () => {
    const orga = new AgentOrganisation(
      'ademe.fr',
      '4106b71b-094a-48f0-974a-cb2c2a9649b3',
      '38529030900454'
    );

    const habilitation = await orga.getHabilitationLevel();
    expect(habilitation.isSuperAgent).toBe(false);
  });
  test('DINUM passes', async () => {
    const orga = new AgentOrganisation(
      'dinum.gouv.fr',
      '4106b71b-094a-48f0-974a-cb2c2a9649b3',
      '13002526500013'
    );

    const habilitation = await orga.getHabilitationLevel();
    expect(habilitation.isSuperAgent).toBe(false);
  });

  test('RATP fails', async () => {
    const orga = new AgentOrganisation(
      'ratp.fr',
      '4106b71b-094a-48f0-974a-cb2c2a9649b3',
      '77566343801906'
    );

    await expect(async () => await orga.getHabilitationLevel()).rejects.toThrow(
      CanRequestAuthorizationException
    );
  });

  test('GIP Inclusion fails', async () => {
    const orga = new AgentOrganisation(
      'inclusion.fr',
      '4106b71b-094a-48f0-974a-cb2c2a9649b3',
      '13003013300016'
    );

    await expect(async () => await orga.getHabilitationLevel()).rejects.toThrow(
      CanRequestAuthorizationException
    );
  });
});

export {};
