describe("Home Screen flow", () => {
  Cypress.on("uncaught:exception", () => {
    return false;
  });

  beforeEach("viewport", () => {});

  it("Log in", () => {
    const spotifyLoginButton: string = ":nth-child(1) > .MuiButton-root";

    cy.visit("http://localhost:3000/dashboard");
    cy.get(spotifyLoginButton).click();
  });

  it("Check if Featured Playlists Title is displayed", () => {
    cy.get(".makeStyles-homeGrid-15").should("be.visible");
    cy.get(".MuiGrid-grid-xs-12 > .MuiTypography-root").invoke("text").should("equal", "Featured Playlists");
  });

  it("Check if Editor's Picks Title is displayed", () => {
    cy.get("[data-testid=featured-playlists-message]")
      .invoke("text")
      .then((el) => {
        if (el === "Editor's Picks") {
          return true;
        }
        return null;
      });
  });

  it("Check if All Tabs are displayed correctly", () => {
    cy.get("#simple-tab-0").invoke("text").should("equal", "Playlists");
    cy.get("#simple-tab-1").invoke("text").should("equal", "Tracks");
    cy.get("#simple-tab-2").invoke("text").should("equal", "Artists");
  });

  it("Check if Content Section is displayed", () => {
    cy.get(".swiper").should("be.visible");
  });

  it("Check if Account Icon is displayed", () => {
    cy.get("[data-testid=AccountCircleOutlineIcon]").should("be.visible");
  });

  it("Check if App Icon is displayed", () => {
    cy.get("[data-testid=MusicRestQuarterIcon]").should("be.visible");
  });

  it("Check if Header is displayed correctly", () => {
    cy.get(".makeStyles-mainContainer-1 > .MuiGrid-container").should("be.visible");
    cy.get(":nth-child(1) > .MuiButton-root > .MuiTypography-root").invoke("text").should("equal", "Home");
    cy.get(".makeStyles-mainContainer-1 > .MuiGrid-container > :nth-child(2) > .MuiButton-root > .MuiTypography-root")
      .invoke("text")
      .should("equal", "Explore");
    cy.get(":nth-child(3) > .MuiButton-root > .MuiTypography-root").invoke("text").should("equal", "Me");
    cy.get(":nth-child(4) > .MuiButton-root").then((el) => {
      cy.wrap(el).find("[data-testid=MagnifyIcon]").should("be.visible");
      cy.wrap(el).invoke("text").should("equal", "Search");
    });
  });

  it("Select Tracks", () => {
    cy.get("#simple-tab-1").click();
    cy.get(".swiper").should("exist").and("be.visible");
  });

  it("Check if Tracks are displayed correctly", () => {
    cy.get(".swiper-slide-active > .MuiGrid-grid-xs-12 > .MuiGrid-container").should("be.visible");
    cy.get(".swiper-slide-active > .MuiGrid-grid-xs-12 > .MuiGrid-grid-xs-4 > .MuiButton-root > #gridRowTrack").should(
      "be.visible"
    );
  });

  it("Select Artists", () => {
    cy.get("#simple-tab-2").click();
    cy.get(".swiper").should("exist").and("be.visible");
  });

  it("Check if Artists are displayed correctly", () => {});
});

export {};
