import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { CartPage } from '../pages/CartPage';
import { Navbar } from '../pages/Navbar';
import { resetCartForUser, resetOrdersForUser } from '../helpers/api-helper';

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
  const loginPage = new LoginPage(page);
  const productsPage = new ProductsPage(page);
  const productDetailPage = new ProductDetailPage(page);
  const cartPage = new CartPage(page);
  const navbar = new Navbar(page);

  // 1. Login
  await loginPage.goto();
  await loginPage.login('demo@breeze.com', 'demo1234');

  // Verify redirection to products page
  await productsPage.verifyOnPage();

  // 2. View Product (Click on the first product)
  await productsPage.clickFirstProduct();

  // Verify we are on a product detail page
  await productDetailPage.verifyOnPage();

  // 3. Add to Cart
  await productDetailPage.addToCart();

  // 4. Go to Cart
  await navbar.gotoCart();
  
  // Verify item is in cart
  await cartPage.verifyItemInCart();

  // 5. Purchase
  await cartPage.checkout();

  // Verify success message
  await cartPage.verifyPurchaseSuccess();
});
