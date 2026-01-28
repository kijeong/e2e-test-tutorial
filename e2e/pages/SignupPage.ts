import { type Page, type Locator, expect } from '@playwright/test';

export class SignupPage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signupButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.getByLabel('이름');
    this.emailInput = page.getByLabel('이메일');
    this.passwordInput = page.getByLabel('비밀번호');
    this.signupButton = page.getByRole('button', { name: '회원가입 완료하기' });
  }

  async goto() {
    await this.page.goto('/signup');
  }

  async signup(name: string, email: string, pass: string) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(pass);
    await this.signupButton.click();
  }
}
