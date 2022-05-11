const spotifyLoginButton: string = ":nth-child(1) > .MuiButton-root";

describe("Authentication flow", () => {
  Cypress.on("uncaught:exception", () => {
    return false;
  });

  it("Login With Spotify", () => {
    cy.visit("http://localhost:3000/dashboard");
    cy.get(spotifyLoginButton).click();
  });
});

describe("Authentication flow", () => {
  Cypress.on("uncaught:exception", () => {
    return false;
  });

  it("Login With Google", () => {
    cy.visit("http://localhost:3000/dashboard");
    const youtubeLoginButton: string = ":nth-child(2) > .MuiButton-root";
    cy.get(youtubeLoginButton).trigger("mouseover").click({ force: true }).wait(2000);
  });
});

describe("Authentication flow", () => {
  Cypress.on("uncaught:exception", () => {
    return false;
  });

  it("Login With Deezer", () => {
    cy.visit("http://localhost:3000/dashboard");
    const deezerLoginButton: string = ":nth-child(3) > .MuiButton-root";
    cy.get(deezerLoginButton).click({ force: true });
  });
});

export {};
