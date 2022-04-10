import { Helpers } from "../../src/utils/helpers";

describe("Parse User Token From Hashed Location", () => {
  const { getTokenFromHash } = Helpers;
  it("Gets token from hashed location", () => {
    const locationHash = "#access_token=my_access_token&token_type=Bearer&expires_in=3600";
    const token = getTokenFromHash(locationHash);

    expect(token).toBeInstanceOf(Object);

    expect(token).toEqual({
      access_token: "my_access_token",
      token_type: "Bearer",
      expires_in: "3600"
    });
  });
});
