describe("Search flow", () => {
  Cypress.on("uncaught:exception", () => {
    return false;
  });

  beforeEach("viewport", () => {});

  it("Log in", () => {
    const spotifyLoginButton: string = ":nth-child(1) > .MuiButton-root";

    cy.visit("http://localhost:3000/dashboard");
    cy.get(spotifyLoginButton).click();
  });

  it("Navigate to Search section", () => {
    cy.get(":nth-child(4) > .MuiButton-root").click();
    cy.url().should("include", "/search");
  });

  it("Check if Search section is visible", () => {
    cy.get(".MuiInputBase-fullWidth").should("be.visible");
  });

  it("Check if Search section content is visible", () => {
    cy.get(".MuiButtonBase-root > [data-testid=MagnifyIcon] > path").should("be.visible");
    cy.get(".MuiSelect-select").should("be.visible");
  });

  it("Check if first option is selected", () => {
    cy.get(".MuiSelect-select").click();
    cy.get(".MuiList-root").should("be.visible");
    cy.get(".Mui-selected").invoke("text").should("contain", "All");
  });

  it("Check if other options are visible", () => {
    cy.get("[data-value=Tracks]").should("be.visible");
    cy.get("[data-value=Artists]").should("be.visible");
    cy.get("[data-value=Playlists]").should("be.visible");
    cy.get(".Mui-selected").click();
  });

  it("Type in the Search Bar and initiate search", () => {
    cy.get("#search-field").click({ force: true }).type("Eminem");
    cy.get(".MuiButtonBase-root > [data-testid=MagnifyIcon]").click();
  });

  it("Check if Search Results are visible", () => {
    const artistsQuery =
      ".makeStyles-homeGrid-32 > :nth-child(2) > :nth-child(1) > :nth-child(1) > .MuiTypography-root";
    const playlistsQuery =
      ".makeStyles-homeGrid-32 > :nth-child(2) > :nth-child(2) > :nth-child(1) > .MuiTypography-root";
    const tracksQuery = ".makeStyles-homeGrid-32 > :nth-child(2) > :nth-child(3) > :nth-child(1) > .MuiTypography-root";
    cy.get(artistsQuery).should("be.visible");
    cy.get(artistsQuery).invoke("text").should("contain", "Artists");
    cy.get(playlistsQuery).should("be.visible");
    cy.get(playlistsQuery).invoke("text").should("contain", "Playlists");
    cy.get(tracksQuery).should("be.visible");
    cy.get(tracksQuery).invoke("text").should("contain", "Tracks");
  });
});

export {};
