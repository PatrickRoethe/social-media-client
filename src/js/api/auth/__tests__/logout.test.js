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

// Importer logout-funksjonen
const { logout } = require("../logout");

describe("Logout function tests", () => {
  beforeEach(() => {
    // Rens mock og localStorage før hver test
    global.localStorage.clear();
    jest.clearAllMocks(); // Rens alle Jest-mockene
  });

  test("Logout function should clear token and profile from localStorage", () => {
    // Simuler at token og profile er lagret i localStorage
    global.localStorage.setItem("token", "dummyToken");
    global.localStorage.setItem("profile", "dummyProfile");

    // Kjør logout-funksjonen
    logout();

    // Sjekk at token og profile er fjernet
    expect(global.localStorage.getItem("token")).toBe(null);
    expect(global.localStorage.getItem("profile")).toBe(null);
  });
});
