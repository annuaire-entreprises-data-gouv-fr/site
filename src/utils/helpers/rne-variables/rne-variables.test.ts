import { getCapital } from ".";

describe("Check RNE variables helpers", () => {
  test("Succeeds with valid inputs", () => {
    expect(getCapital(10, "£", true)).toBe("10 £ (variable)");
    expect(getCapital(1_000_000, "€", false)).toBe("1000000 € (fixe)");
    expect(getCapital(10, "POUNDS", true)).toBe("10 POUNDS (variable)");
  });
});
