import { parseAgentScopes } from "./parse";

describe("Scopes validation", () => {
  test("valid", () => {
    expect(parseAgentScopes("conformite_sociale").validScopes).toStrictEqual([
      "conformite_sociale",
    ]);
    expect(
      parseAgentScopes("conformite_sociale beneficiaires").validScopes
    ).toStrictEqual(["conformite_sociale", "beneficiaires"]);
    expect(
      parseAgentScopes(" conformite_sociale    ").validScopes
    ).toStrictEqual(["conformite_sociale"]);
  });
  test("invalid", () => {
    expect(
      parseAgentScopes("conformite_sociale blah").validScopes
    ).toStrictEqual(["conformite_sociale"]);
    expect(parseAgentScopes("blah bli blu  ").validScopes).toStrictEqual([]);
    expect(
      parseAgentScopes("blah conformite_sociale blu").validScopes
    ).toStrictEqual(["conformite_sociale"]);
    expect(
      parseAgentScopes("blah conformite_sociale blu").inValidScopes
    ).toStrictEqual(["blah", "blu"]);
  });
});
