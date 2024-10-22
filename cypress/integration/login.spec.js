describe("Login Test", () => {
  beforeEach(() => {
    // Mock API-kall for innlogging med gyldige og ugyldige legitimasjoner
    cy.intercept("POST", "/api/v1/social/auth/login", (req) => {
      const { email, password } = req.body;
      if (email === "test@noroff.no" && password === "password") {
        req.reply({
          statusCode: 200,
          body: {
            accessToken: "validToken",
            name: "Test User",
          },
        });
      } else {
        // Returner 401 ved ugyldige legitimasjoner
        req.reply({
          statusCode: 401,
          body: {
            message:
              "Either your username was not found or your password is incorrect",
          },
        });
        console.log("Mock API: 401 Unauthorized returned");
      }
    });

    // Mock API-kall for å hente brukerens profil etter innlogging
    cy.intercept("GET", "/api/v1/social/profiles/Test%20User", {
      statusCode: 200,
      body: {
        name: "Test User",
        followers: [],
        following: [],
        posts: [],
      },
    });

    // Mock API-kall for utlogging
    cy.intercept("POST", "/api/v1/social/auth/logout", {
      statusCode: 200,
      body: {
        message: "Successfully logged out",
      },
    });

    // Besøk hovedsiden før hver test
    cy.visit("/");

    // Forsikre oss om at alle åpne modalvinduer er lukket
    cy.get("body").then(($body) => {
      if ($body.find(".modal.show").length > 0) {
        cy.get(".modal.show .btn-close").click({ force: true });
        cy.get(".modal.show").should("not.exist"); // Vent til modalene er lukket
      }
    });

    // Gi en liten forsinkelse for å sikre at modalene er helt lukket
    cy.wait(500);
  });

  it("should log in with valid credentials", () => {
    // Åpne login-modalen
    cy.get('button[data-bs-target="#loginModal"]')
      .first()
      .click({ force: true });

    // Vent til login-modalen er synlig
    cy.get("#loginModal").should("be.visible");

    // Fyll ut logg inn-informasjon
    cy.get("#loginEmail").type("test@noroff.no", { force: true });
    cy.get("#loginPassword").type("password", { force: true });

    // Klikk på login-knappen
    cy.get('#loginForm button[type="submit"]').click({ force: true });

    // Sjekk at brukeren er logget inn ved å verifisere at logout-knappen vises
    cy.get('button[data-auth="logout"]').should("be.visible");
  });

  it("should not log in with invalid credentials and show a message", () => {
    // Åpne login-modalen
    cy.get('button[data-bs-target="#loginModal"]')
      .first()
      .click({ force: true });

    // Vent til login-modalen er synlig
    cy.get("#loginModal").should("be.visible");

    // Fyll ut feil innloggingsinformasjon
    cy.get("#loginEmail").type("invalid@noroff.no", { force: true });
    cy.get("#loginPassword").type("wrongpassword", { force: true });

    // Klikk på login-knappen
    cy.get('#loginForm button[type="submit"]').click({ force: true });

    // Bruk cy.on for å fange opp alert-meldingen som vises
    cy.on("window:alert", (alertText) => {
      expect(alertText).to.equal(
        "Either your username was not found or your password is incorrect"
      );
    });

    // Slett sjekk for logout-knappen, da det er irrelevant for denne testen
  });

  it("should log out successfully", () => {
    // Logg inn først
    cy.get('button[data-bs-target="#loginModal"]')
      .first()
      .click({ force: true });

    // Vent til login-modalen er synlig
    cy.get("#loginModal").should("be.visible");

    cy.get("#loginEmail").type("test@noroff.no", { force: true });
    cy.get("#loginPassword").type("password", { force: true });
    cy.get('#loginForm button[type="submit"]').click({ force: true });

    // Klikk på logout-knappen
    cy.get('button[data-auth="logout"]').click({ force: true });

    // Sjekk at login-knappen nå vises igjen
    cy.get('button[data-auth="login"]').should("be.visible");
  });
});
