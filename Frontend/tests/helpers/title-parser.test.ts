import { parseTitle } from "../../src/helpers/title-parser";

describe("Parse Title", () => {
  it("Parses undefined title", () => {
    const parsedTitle = parseTitle(undefined);

    expect(parsedTitle).toBe("");
  });

  it("Parses title", () => {
    const title = "My Title";
    const parsedTitle = parseTitle(title);

    expect(parsedTitle).toBe(title);
  });

  it("Parses title with spaces", () => {
    const title = "My  Title With   Spaces";
    const parsedTitle = parseTitle(title);

    expect(parsedTitle).toBe(title);
  });

  it("Parses title with spaces and dashes", () => {
    const title = "My Title With Spaces --";
    const parsedTitle = parseTitle(title);

    expect(parsedTitle).toBe(title);
  });

  it("Parses title with spaces and dashes and numbers", () => {
    const title = "My Title With Spaces -- 1";
    const parsedTitle = parseTitle(title);

    expect(parsedTitle).toBe(title);
  });

  it("Parses title with spaces and dashes and partial numbers", () => {
    const title = "My Title With Spaces -- 1.2";
    const parsedTitle = parseTitle(title);

    expect(parsedTitle).toBe(title);
  });

  it("Parses title with spaces and dashes and numbers and dots and brackets", () => {
    const title = "My Title With Spaces -- 1.2 [test]";
    const parsedTitle = parseTitle(title);

    expect(parsedTitle).toBe("My Title With Spaces -- 1.2");
  });

  it("Parses title with spaces, dashes, numbers, dots and parentheses", () => {
    const title = "My Title With Spaces -- 1.2 (test)";
    const parsedTitle = parseTitle(title);

    expect(parsedTitle).toBe("My Title With Spaces -- 1.2");
  });
});
