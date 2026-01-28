import { test } from '@playwright/test';
import { SignupPage } from '../pages/SignupPage';
import { LoginPage } from '../pages/LoginPage';
import { Navbar } from '../pages/Navbar';
import { deleteAllByQuery } from '../helpers/api-helper';

test('Signup flow: Signup -> Login', async ({ page, request }) => {
  const signupPage = new SignupPage(page);
  const loginPage = new LoginPage(page);
  const navbar = new Navbar(page);

  // Generate unique credentials
  const timestamp = Date.now();
  const email = `user${timestamp}@test.com`;
  const name = `User ${timestamp}`;
  const password = 'password123';

  // Ensure user does not exist (Front initialization)
  await deleteAllByQuery(request, `/users?email=${email}`);

  // 1. Signup
  await signupPage.goto();
  await signupPage.signup(name, email, password);

  // Verify auto-login and redirection is handled by UI, check Navbar
  await navbar.verifyUserLoggedIn(name);

  // 2. Logout (to test login)
  await navbar.logout();
  await navbar.verifyLoggedOut();

  // 3. Login with new credentials
  await loginPage.goto();
  await loginPage.login(email, password);

  // Verify logged in state
  await navbar.verifyUserLoggedIn(name);

  // Clean up user (Back initialization)
  await deleteAllByQuery(request, `/users?email=${email}`);
});
