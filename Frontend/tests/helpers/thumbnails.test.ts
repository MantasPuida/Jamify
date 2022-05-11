import { extractThumbnail } from "../../src/helpers/thumbnails";

describe("Extract Thumbnail", () => {
  it("Should return empty string", () => {
    expect(extractThumbnail(undefined)).toBe("");
  });

  it("Should return maxres url", () => {
    expect(
      extractThumbnail({
        maxres: {
          url: "maxres.url"
        }
      })
    ).toBe("maxres.url");
  });

  it("Should return standard url", () => {
    expect(
      extractThumbnail({
        standard: {
          url: "standard.url"
        }
      })
    ).toBe("standard.url");
  });

  it("Should return high url", () => {
    expect(
      extractThumbnail({
        high: {
          url: "high.url"
        }
      })
    ).toBe("high.url");
  });

  it("Should return default url", () => {
    expect(
      extractThumbnail({
        default: {
          url: "default.url"
        }
      })
    ).toBe("default.url");
  });

  it("Should return maxres url", () => {
    expect(
      extractThumbnail({
        default: {
          url: "default.url"
        },
        maxres: {
          url: "maxres.url"
        },
        standard: {
          url: "standard.url"
        },
        high: {
          url: "high.url"
        }
      })
    ).toBe("maxres.url");
  });

  it("Should return standard url", () => {
    expect(
      extractThumbnail({
        default: {
          url: "default.url"
        },
        standard: {
          url: "standard.url"
        },
        high: {
          url: "high.url"
        }
      })
    ).toBe("standard.url");
  });

  it("Should return high url", () => {
    expect(
      extractThumbnail({
        default: {
          url: "default.url"
        },
        high: {
          url: "high.url"
        }
      })
    ).toBe("high.url");
  });
});
