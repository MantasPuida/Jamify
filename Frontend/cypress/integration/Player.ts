describe("Player flow", () => {
  Cypress.on("uncaught:exception", () => {
    return false;
  });

  beforeEach("viewport", () => {});

  it("Log in", () => {
    const spotifyLoginButton: string = ":nth-child(1) > .MuiButton-root";

    cy.visit("http://localhost:3000/dashboard");
    cy.get(spotifyLoginButton).click();
  });

  it("Click on a Tracks section", () => {
    cy.get("#simple-tab-1").click();
    cy.get(".swiper").should("exist").and("be.visible");
  });

  it("Select a Track", () => {
    cy.get(".swiper-slide-active > .MuiGrid-grid-xs-12 > .MuiGrid-grid-xs-4 > .MuiButton-root > #gridRowTrack").click({
      force: true
    });
  });

  it("Check if Player has opened", () => {
    cy.get(".css-1dby1ub > .css-1idn90j-MuiGrid-root").should("be.visible");
  });

  it("Check if Icons are displayed correctly", () => {
    cy.wait(2000).get("[data-testid=RewindIcon]").should("be.visible");
    cy.get("[data-testid=FastForwardIcon]").should("be.visible");
    cy.get(".css-1yo1jo6-MuiStack-root").should("be.visible");
    cy.get("[data-testid=VolumeHighIcon]").should("be.visible");
  });

  it("Check if Track image and text is displayed", () => {
    cy.get(".MuiGrid-grid-xs-2 > img").should("be.visible");
    cy.get(".css-f4hfie-MuiTypography-root").should("be.visible");
  });
});

export {};
