import { parseAgentScopes } from "./parse";

describe("Scopes validation", () => {
  test("valid", () => {
    expect(parseAgentScopes("conformite_sociale").validScopes).toStrictEqual([
      "conformite_sociale",
    ]);
    expect(
      parseAgentScopes("conformite_sociale beneficiaires").validScopes
    ).toStrictEqual(["conformite_sociale", "beneficiaires"]);
    expect(parseAgentScopes(" conformite    ").validScopes).toStrictEqual([
      "conformite_sociale",
    ]);
  });
  test("invalid", () => {
    expect(parseAgentScopes("conformite blah").validScopes).toStrictEqual([
      "conformite_sociale",
    ]);
    expect(parseAgentScopes("blah bli blu  ").validScopes).toStrictEqual([]);
    expect(parseAgentScopes("blah conformite blu").validScopes).toStrictEqual([
      "conformite_sociale",
    ]);
    expect(parseAgentScopes("blah conformite blu").inValidScopes).toStrictEqual(
      ["blah", "blu"]
    );
  });
});
