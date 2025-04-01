import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  readonly homeLink: Locator;
  readonly loginLink: Locator;
  readonly cartLink: Locator;
  readonly signUpLink: Locator;
  readonly logoutLink: Locator;
  readonly welcomeUser: Locator;
  
  constructor(page: Page) {
    this.page = page;
    this.homeLink = page.getByRole('link', { name: 'Home' });
    this.loginLink = page.getByRole('link', { name: 'Log in' });
    this.cartLink = page.getByRole('link', { name: 'Cart' });
    this.signUpLink = page.getByRole('link', { name: 'Sign up' });
    this.logoutLink = page.getByRole('link', { name: 'Log out' });
    this.welcomeUser = page.locator('#nameofuser');
  }

  async goto() {
    await this.page.goto('/');
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async navigateToHome() {
    await this.homeLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async navigateToLogin() {
    await this.loginLink.click();
    await this.page.waitForSelector('#logInModal', { state: 'visible' });
  }

  async navigateToCart() {
  const cartNavLink = this.page.locator("//a[text()='Cart']");
  await cartNavLink.click();
  await this.page.waitForLoadState('domcontentloaded');
  }

  async navigateToSignUp() {
    await this.signUpLink.click();
    await this.page.waitForSelector('#signInModal', { state: 'visible' });
  }

  async logout() {
    // For demo websites, sometimes we need to ensure the element is visible before clicking
    await this.logoutLink.waitFor({ state: 'visible' });
    await this.logoutLink.click();
    await this.page.waitForLoadState('domcontentloaded');
    // Verify logout was successful
    await expect(this.loginLink).toBeVisible();
  }

  async isUserLoggedIn(): Promise<boolean> {
    try {
      await expect(this.welcomeUser).toBeVisible({ timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  async getUserWelcomeMessage(): Promise<string> {
    await expect(this.welcomeUser).toBeVisible();
    return (await this.welcomeUser.textContent()) || '';
  }
}
