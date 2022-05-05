describe("Adds a Track to a Playlist", () => {
  Cypress.on("uncaught:exception", () => {
    return false;
  });

  it("Log in", () => {
    const spotifyLoginButton: string = ":nth-child(1) > .MuiButton-root";

    cy.visit("http://localhost:3000/dashboard");
    cy.get(spotifyLoginButton).click();
  });

  it("Click on a Playlist", () => {
    cy.get(".swiper-slide-active > :nth-child(1) > .MuiGrid-container").click();
    cy.url().should("include", "/playlist");
  });

  it("Open a modal to add a Track", () => {
    cy.get("#DotsSvgIcon").first().click({ force: true });
    cy.get(".MuiDialog-container").should("be.visible");
  });

  it("Check if Dialog is displayed correctly", () => {
    cy.get(".MuiDialog-container").should("be.visible");
    cy.get("#mui-1 > .MuiTypography-root").invoke("text").should("contain", "Save to");
    cy.get(".MuiGrid-grid-xs-10 > .MuiTypography-root").invoke("text").should("contain", "Spotify Playlist");
  });

  it("Add a track to the first Spotify Playlist", () => {
    cy.get("#spotifybh-header").click();
    cy.get(".MuiAccordionDetails-root").should("be.visible");
    cy.get(".MuiFormGroup-root > :nth-child(1) > .MuiGrid-root").first().click();
  });
});

describe("Adds a Track to a new Playlist", () => {
  Cypress.on("uncaught:exception", () => {
    return false;
  });

  beforeEach("viewport", () => {});

  it("Log in", () => {
    const spotifyLoginButton: string = ":nth-child(1) > .MuiButton-root";

    cy.visit("http://localhost:3000/dashboard");
    cy.get(spotifyLoginButton).click();
  });

  it("Click on a Playlist", () => {
    cy.get(".swiper-slide-active > :nth-child(1) > .MuiGrid-container").click();
    cy.url().should("include", "/playlist");
  });

  it("Open a modal to add a Track", () => {
    cy.get("#DotsSvgIcon").first().click({ force: true });
    cy.get(".MuiDialog-container").should("be.visible");
  });

  it("Check if Dialog is displayed correctly", () => {
    cy.get("#mui-1 > .MuiTypography-root").invoke("text").should("contain", "Save to");
    cy.get(".MuiGrid-grid-xs-10 > .MuiTypography-root").invoke("text").should("contain", "Spotify Playlist");
  });

  it("Click on Create New Playlist", () => {
    cy.get(".MuiDialogActions-root > .MuiButton-root").click();
  });

  it("Check if Create New Playlist is displayed correctly", () => {
    cy.get("[data-testid=playlist-name]").should("be.visible");
    cy.get(".Mui-selected > .MuiTypography-root").invoke("text").should("contain", "Universal");
    cy.get("[value=center]").invoke("text").should("contain", "Spotify");
  });

  it("Type in new Playlist Name", () => {
    cy.get("[data-testid=playlist-name]").click().clear().type("Test Playlist");
  });

  it("Create new Universal Playlist", () => {
    cy.get("#CreateNewPlaylist").click();
  });
});

describe("Remove a Track", () => {
  Cypress.on("uncaught:exception", () => {
    return false;
  });

  beforeEach("viewport", () => {});

  it("Log in", () => {
    const spotifyLoginButton: string = ":nth-child(1) > .MuiButton-root";

    cy.visit("http://localhost:3000/dashboard");
    cy.get(spotifyLoginButton).click();
  });

  it("Navigate to Me section", () => {
    cy.get(":nth-child(3) > .MuiButton-root").click();
    cy.url().should("include", "/me");
  });

  it("Open a Playlist", () => {
    cy.get(
      ":nth-child(1) > .makeStyles-homeGrid-15 > .css-vj1n65-MuiGrid-root > :nth-child(2) > .swiper > .swiper-wrapper > .swiper-slide-active > :nth-child(1) > .MuiGrid-container > .css-13i4rnv-MuiGrid-root > .MuiButton-root > .tint-img > .makeStyles-image-34"
    ).click();
  });

  it("Click on Filled Heart to remove a Track", () => {
    cy.get("[data-testid=CardsHeartIcon]").first().click();
  });
});

export {};
