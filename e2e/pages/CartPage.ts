import { type Page, type Locator, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItem: Locator;
  readonly checkoutButton: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItem = page.getByTestId('cart-item');
    this.checkoutButton = page.getByTestId('checkout-button');
    this.successMessage = page.getByText('주문이 완료되었어요. 감사합니다!');
  }

  async goto() {
    await this.page.goto('/cart');
  }

  async verifyItemInCart() {
    await expect(this.cartItem).toBeVisible();
  }

  async checkout() {
    await this.checkoutButton.click();
  }

  async verifyPurchaseSuccess() {
    await expect(this.successMessage).toBeVisible();
  }
}
