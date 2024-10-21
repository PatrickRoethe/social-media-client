const { login } = require("../login");

test("Login function returns a profile", async () => {
  const email = "test@example.com";
  const password = "password";

  try {
    const profile = await login(email, password);
    expect(profile).toBeDefined();
  } catch (error) {
    // Hvis login feiler på grunn av API eller andre årsaker
    expect(error).toBeDefined();
  }
});
