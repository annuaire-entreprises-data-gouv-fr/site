import { CanRequestAuthorizationException } from "#models/authentication/authentication-exceptions";
import { verifySiret } from "#utils/helpers";
import { AgentOrganisation } from ".";

describe("AgentOrganisation class", () => {
  test("ADEME passes", async () => {
    const orga = new AgentOrganisation(
      "4106b71b-094a-48f0-974a-cb2c2a9649b3",
      verifySiret("38529030900454")
    );

    const habilitation = await orga.getHabilitationLevel();
    expect(habilitation.isSuperAgent).toBe(false);
  });
  test("DINUM passes", async () => {
    const orga = new AgentOrganisation(
      "4106b71b-094a-48f0-974a-cb2c2a9649b3",
      verifySiret("13002526500013")
    );

    const habilitation = await orga.getHabilitationLevel();
    expect(habilitation.isSuperAgent).toBe(false);
  });

  test("RATP fails", async () => {
    const orga = new AgentOrganisation(
      "4106b71b-094a-48f0-974a-cb2c2a9649b3",
      verifySiret("77566343801906")
    );

    await expect(async () => await orga.getHabilitationLevel()).rejects.toThrow(
      CanRequestAuthorizationException
    );
  });

  test("GIP Inclusion OK", async () => {
    const orga = new AgentOrganisation(
      "4106b71b-094a-48f0-974a-cb2c2a9649b3",
      verifySiret("13003013300016")
    );

    const habilitation = await orga.getHabilitationLevel();
    expect(habilitation.isSuperAgent).toBe(false);
    expect(habilitation.scopes).toEqual([
      "agent",
      "nonDiffusible",
      "rne",
      "pseudo_opendata",
    ]);
    expect(habilitation.userType).toBe("Agent connecté");
  });
});

export {};
