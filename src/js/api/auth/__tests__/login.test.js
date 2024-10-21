// Mock `localStorage`
global.localStorage = {
  store: {},
  getItem: function (key) {
    return this.store[key] || null;
  },
  setItem: function (key, value) {
    this.store[key] = value.toString();
  },
  removeItem: function (key) {
    delete this.store[key];
  },
  clear: function () {
    this.store = {};
  },
};

// Importer login-funksjonen fra login.js
const { login } = require("../login");

describe("Login function tests", () => {
  beforeEach(() => {
    // Rens mock og localStorage før hver test
    global.localStorage.clear();
    jest.clearAllMocks(); // Rens alle Jest-mockene
  });

  test("Login function should store a token on valid credentials", async () => {
    // Sett opp gyldige credentials
    const email = "test@example.com";
    const password = "password";

    // Mock `fetch` for å simulere et vellykket innlogging-kall
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        accessToken: "dummyToken",
        name: "Test User",
      }),
    });

    // Kall login-funksjonen
    await login(email, password);

    // Sjekk om token er lagret i localStorage
    const token = global.localStorage.getItem("token");
    expect(token).toBeDefined();
    expect(JSON.parse(token)).toBe("dummyToken"); // Her bruker vi JSON.parse
  });

  test("Login function should throw an error on invalid credentials", async () => {
    // Sett opp ugyldige credentials
    const email = "wrong@example.com";
    const password = "wrongpassword";

    // Mock `fetch` for å simulere et mislykket innlogging-kall
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      statusText: "Invalid credentials",
    });

    // Forvent at kallet til login skal feile
    await expect(login(email, password)).rejects.toThrow("Invalid credentials");
  });
});
