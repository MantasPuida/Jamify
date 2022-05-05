describe("Own playlists flow", () => {
  Cypress.on("uncaught:exception", () => {
    return false;
  });

  it("Log in", () => {
    const spotifyLoginButton: string = ":nth-child(1) > .MuiButton-root";

    cy.visit("http://localhost:3000/dashboard");
    cy.get(spotifyLoginButton).click();
  });

  it("Navigate to Me section", () => {
    cy.get(":nth-child(3) > .MuiButton-root").click();
    cy.url().should("include", "/me");
  });

  it("Check if My Playlists thumbnail is displayed", () => {
    cy.get(".MuiGrid-grid-xs-12 > .MuiTypography-root").invoke("text").should("equal", "My Playlists");
  });

  it("Check if Spotify Playlists thumbnail is displayed", () => {
    cy.get(":nth-child(2) > .MuiTypography-root").invoke("text").should("equal", "Spotify Playlists");
  });

  it("Check if Own Playlists thumbnail is displayed", () => {
    cy.get(
      ":nth-child(2) > .makeStyles-homeGrid-15 > .css-vj1n65-MuiGrid-root > :nth-child(1) > :nth-child(1) > .MuiTypography-root"
    )
      .invoke("text")
      .should("equal", "Own Playlists");
  });

  it("Check if content is displayed", () => {
    cy.get(
      ":nth-child(1) > .makeStyles-homeGrid-15 > .css-vj1n65-MuiGrid-root > :nth-child(2) > .swiper > .swiper-wrapper"
    ).should("be.visible");
  });

  it("Open a Playlist and Check contents", () => {
    cy.get(
      ":nth-child(1) > .makeStyles-homeGrid-15 > .css-vj1n65-MuiGrid-root > :nth-child(2) > .swiper > .swiper-wrapper > .swiper-slide-active > :nth-child(1) > .MuiGrid-container > .css-13i4rnv-MuiGrid-root > .MuiButton-root > .tint-img > .makeStyles-image-34"
    ).click();
    cy.url().should("include", "/playlist");
    cy.get(".makeStyles-homeGrid-37").should("be.visible");
    cy.get(".makeStyles-playlistImage-41").should("be.visible");
  });

  it("Play a Track and check if Player has opened", () => {
    cy.get(".makeStyles-playlistIconButton-53").first().click();
    cy.get(".css-1dby1ub > .css-1idn90j-MuiGrid-root").should("be.visible");
  });
});

export {};
