import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { waitForAlert } from '../utils/helpers';

interface LoginResult {
  success: boolean;
  message: string;
}

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly closeButton: Locator;
  readonly welcomeUser: Locator;
  
  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('#loginusername');
    this.passwordInput = page.locator('#loginpassword');
    this.loginButton = page.locator('#logInModal button').filter({ hasText: 'Log in' });
    this.closeButton = page.locator('#logInModal button.btn-secondary');
    this.welcomeUser = page.locator('#nameofuser');
  }

  async navigateToLogin(): Promise<void> {
    await this.page.goto('/');
    await this.page.locator('#login2').click();
    await this.usernameInput.waitFor({ state: 'visible', timeout: 15000 });
  }

  async login(username: string, password: string): Promise<LoginResult> {
    await this.navigateToLogin();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    
    // Add timeout to alert promise to prevent hanging
    const alertPromise = Promise.race([
      waitForAlert(this.page),
      new Promise<string>((_, reject) => 
        setTimeout(() => reject(new Error('Alert timeout')), 10000)
      )
    ]);
    
    await this.loginButton.click();
    
    // Check for any alerts (for invalid credentials)
    try {
      const alertText = await alertPromise;
      if (alertText.includes('User does not exist') || alertText.includes('Wrong password')) {
        return { success: false, message: alertText };
      }
    } catch (error) {
      // No alert or alert timeout, continuing with login check
    }
    
    // Force a small wait to ensure page has time to update
    await this.page.waitForTimeout(2000);
    
    // Verify if we're logged in
    try {
      // Check if welcome message exists
      const isWelcomeVisible = await this.welcomeUser.isVisible({ timeout: 5000 });
      
      if (isWelcomeVisible) {
        const welcomeText = await this.welcomeUser.textContent() || '';
        return { success: true, message: welcomeText };
      }
      
      // Additional check - look for login link (should be gone if logged in)
      const loginLinkVisible = await this.page.locator('#login2').isVisible({ timeout: 1000 });
      
      if (!loginLinkVisible) {
        return { success: true, message: 'User appears to be logged in, but welcome message not found' };
      }
    } catch (error) {
      // Error checking login status
    }
    
    return { success: false, message: 'Login failed - could not confirm successful login' };
  }

  async closeLoginModal(): Promise<void> {
    await this.closeButton.click();
    await expect(this.usernameInput).not.toBeVisible();
  }
}