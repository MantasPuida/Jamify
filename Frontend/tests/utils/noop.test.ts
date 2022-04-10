import { Noop } from "../../src/utils/Noop";

describe("Tests Noop", () => {
  it("should return undefined", () => {
    expect(Noop()).toBeUndefined();
  });
});
