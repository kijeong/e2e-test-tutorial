import { type Page, type Locator, expect } from '@playwright/test';

export class ProductDetailPage {
  readonly page: Page;
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addToCartButton = page.getByRole('button', { name: '장바구니 담기' });
  }

  async addToCart() {
    await this.addToCartButton.click();
  }

  async verifyOnPage() {
    await expect(this.page).toHaveURL(/\/products\/\d+/);
  }
}
