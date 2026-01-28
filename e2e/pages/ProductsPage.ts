import { type Page, type Locator, expect } from '@playwright/test';

export class ProductsPage {
  readonly page: Page;
  readonly productCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productCards = page.locator('[data-testid^="product-card-"]');
  }

  async goto() {
    await this.page.goto('/products');
  }

  async clickFirstProduct() {
    await this.productCards.first().click();
  }

  async verifyOnPage() {
    await expect(this.page).toHaveURL('/products');
  }
}
