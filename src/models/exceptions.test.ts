import { Exception } from "./exceptions";

describe("Exception", () => {
  test("uses an Error cause message as fallback message", () => {
    const exception = new Exception({
      name: "WrappedError",
      cause: new Error("Original failure"),
    });

    expect(exception.message).toBe("Original failure");
  });

  test("uses a primitive cause as fallback message", () => {
    const exception = new Exception({
      name: "WrappedStringError",
      cause: "Only HTML requests are supported here",
    });

    expect(exception.message).toBe("Only HTML requests are supported here");
  });
});
