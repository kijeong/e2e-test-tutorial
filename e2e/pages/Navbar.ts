import { type Page, type Locator, expect } from '@playwright/test';

export class Navbar {
  readonly page: Page;
  readonly cartLink: Locator;
  readonly logoutButton: Locator;
  readonly loginLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartLink = page.getByTestId('nav-cart');
    this.logoutButton = page.getByRole('button', { name: '로그아웃' });
    this.loginLink = page.getByRole('link', { name: '로그인', exact: true });
  }

  async gotoCart() {
    await this.cartLink.click();
  }

  async verifyUserLoggedIn(name: string) {
    await expect(this.page.getByText(`${name} 님`)).toBeVisible();
  }

  async logout() {
    await this.logoutButton.click();
  }

  async verifyLoggedOut() {
    await expect(this.loginLink).toBeVisible();
  }
}
