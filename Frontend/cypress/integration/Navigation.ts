describe("Navigation flow", () => {
  Cypress.on("uncaught:exception", () => {
    return false;
  });

  beforeEach("Spotify Log in", () => {
    const spotifyLoginButton: string = ":nth-child(1) > .MuiButton-root";

    cy.visit("http://localhost:3000/dashboard");
    cy.get(spotifyLoginButton).click();
  });

  it("Click on Home section", () => {
    cy.get(":nth-child(1) > .MuiButton-root > .MuiTypography-root").click();
    cy.url().should("include", "/home");
  });

  it("Click on Jamify Icon", () => {
    cy.get("[data-testid=MusicRestQuarterIcon]").click();
    cy.url().should("include", "/home");
  });

  it("Click on Explore section", () => {
    cy.get(".makeStyles-mainContainer-1 > .MuiGrid-container > :nth-child(2) > .MuiButton-root").click();
    cy.url().should("include", "/explore");
  });

  it("Click on Me section", () => {
    cy.get(":nth-child(3) > .MuiButton-root").click();
    cy.url().should("include", "/me");
  });

  it("Click on Search section", () => {
    cy.get(":nth-child(4) > .MuiButton-root").click();
    cy.url().should("include", "/search");
  });

  it("Open a Playlists", () => {
    cy.get(".swiper-slide-active > :nth-child(1) > .MuiGrid-container").click();
    cy.url().should("include", "/playlist");
  });
});

export {};
