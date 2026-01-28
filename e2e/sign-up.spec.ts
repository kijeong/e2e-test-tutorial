import { test, expect } from '@playwright/test';
import { deleteAllByQuery } from './helper';

test('Signup flow: Signup -> Login', async ({ page, request }) => {
  // Generate unique credentials
  const timestamp = Date.now();
  const email = `user${timestamp}@test.com`;
  const name = `User ${timestamp}`;
  const password = 'password123';

  // Ensure user does not exist (Front initialization)
  await deleteAllByQuery(request, `/users?email=${email}`);

  // 1. Signup
  await page.goto('/signup');

  await page.getByLabel('이름').fill(name);
  await page.getByLabel('이메일').fill(email);
  await page.getByLabel('비밀번호').fill(password);
  
  await page.getByRole('button', { name: '회원가입 완료하기' }).click();

  // Verify auto-login and redirection to products
  await expect(page).toHaveURL('/products');
  
  // Verify user name is displayed in navbar (indicates logged in)
  await expect(page.getByText(`${name} 님`)).toBeVisible();

  // 2. Logout (to test login)
  await page.getByRole('button', { name: '로그아웃' }).click();
  
  // Verify logout (e.g., check for Login link)
  await expect(page.getByRole('link', { name: '로그인', exact: true })).toBeVisible();

  // 3. Login with new credentials
  await page.goto('/login');
  
  await page.getByTestId('login-email').fill(email);
  await page.getByTestId('login-password').fill(password);
  await page.getByTestId('login-submit').click();

  // Verify redirection to products page and logged in state
  await expect(page).toHaveURL('/products');
  await expect(page.getByText(`${name} 님`)).toBeVisible();

  // Clean up user (Back initialization)
  await deleteAllByQuery(request, `/users?email=${email}`);
});
