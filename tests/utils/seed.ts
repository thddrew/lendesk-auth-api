import { getUserByUsername, setUser } from "../../src/db/users.js";
import { createUser } from "../../src/services/auth.js";

const TEST_USER = {
  username: "testuser",
  password: "Password123!",
};

// Create a shared test user for when we need a valid user
export const seedTestUser = async () => {
  if (await getUserByUsername(TEST_USER.username)) {
    console.log("Test user already exists");
    return;
  }

  const user = await createUser(TEST_USER.username, TEST_USER.password);
  await setUser(user);
  console.log("Test user seeded");
  return user;
};

export const convertToBasicAuthHeader = (
  username: string,
  password: string,
) => {
  const auth = `${username}:${password}`;
  return `Basic ${btoa(auth)}`;
};

export const getTestUserAuthHeader = () =>
  convertToBasicAuthHeader(TEST_USER.username, TEST_USER.password);
