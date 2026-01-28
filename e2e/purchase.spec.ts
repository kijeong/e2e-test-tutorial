import { test, expect } from '@playwright/test';
import { resetCartForUser, resetOrdersForUser } from './helper';

const TEST_USER_ID = '1';

test.beforeEach(async ({ request }) => {
  await resetCartForUser(request, TEST_USER_ID);
  await resetOrdersForUser(request, TEST_USER_ID);
});

test.afterEach(async ({ request }) => {
  await resetCartForUser(request, TEST_USER_ID);
  await resetOrdersForUser(request, TEST_USER_ID);
});

test('Purchase flow: Login -> View Product -> Add to Cart -> Purchase', async ({ page }) => {
  // 1. Login
  await page.goto('/login');
  
  await page.getByTestId('login-email').fill('demo@breeze.com');
  await page.getByTestId('login-password').fill('demo1234');
  await page.getByTestId('login-submit').click();

  // Verify redirection to products page
  await expect(page).toHaveURL('/products');

  // 2. View Product (Click on the first product)
  // We can select the first product card's link or image
  const firstProductCard = page.locator('[data-testid^="product-card-"]').first();
  await firstProductCard.click();

  // Verify we are on a product detail page
  await expect(page).toHaveURL(/\/products\/\d+/);

  // 3. Add to Cart
  // There is a "장바구니 담기" button on the detail page.
  // Based on ProductDetailPage.tsx, it's a button with text "장바구니 담기"
  await page.getByRole('button', { name: '장바구니 담기' }).click();

  // Optionally verify toast or some feedback, but let's move to cart to verify item
  
  // 4. Go to Cart
  await page.getByTestId('nav-cart').click();
  await expect(page).toHaveURL('/cart');

  // Verify item is in cart
  await expect(page.getByTestId('cart-item')).toBeVisible();

  // 5. Purchase
  await page.getByTestId('checkout-button').click();

  // Verify success message
  await expect(page.getByText('주문이 완료되었어요. 감사합니다!')).toBeVisible();
});
