import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { TEST_DATA } from '../utils/test-data';
import { generateRandomUsername } from '../utils/helpers';

test.describe('Login Functionality', () => {
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    const result = await loginPage.login(TEST_DATA.validUser.username, TEST_DATA.validUser.password);
    
    expect(result.success).toBeTruthy();
    expect(result.message).toContain(`Welcome ${TEST_DATA.validUser.username}`);
  });

  test('should display error message with invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    const result = await loginPage.login(TEST_DATA.invalidUser.username, TEST_DATA.invalidUser.password);
    
    expect(result.success).toBeFalsy();
    expect(result.message).toContain('User does not exist');
  });

  test('should display error message with valid username but wrong password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    const result = await loginPage.login(TEST_DATA.validUser.username, 'wrongpassword');
    
    expect(result.success).toBeFalsy();
    expect(result.message).toContain('Wrong password');
  });

  test('should persist login session after navigation', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    
    // Login first
    await loginPage.login(TEST_DATA.validUser.username, TEST_DATA.validUser.password);
    
    // Navigate to different categories to test session persistence
    await homePage.selectCategory('Phones');
    expect(await loginPage.isUserLoggedIn()).toBeTruthy();
    
    await homePage.selectCategory('Laptops');
    expect(await loginPage.isUserLoggedIn()).toBeTruthy();
    
    // Navigate to cart and back
    await homePage.navigateToCart();
    expect(await loginPage.isUserLoggedIn()).toBeTruthy();
    
    await homePage.navigateToHome();
    expect(await loginPage.isUserLoggedIn()).toBeTruthy();
  });

  test('should be able to logout after successful login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    // Login first
    await loginPage.login(TEST_DATA.validUser.username, TEST_DATA.validUser.password);
    expect(await loginPage.isUserLoggedIn()).toBeTruthy();
    
    // Logout
    await loginPage.logout();
    expect(await loginPage.isUserLoggedIn()).toBeFalsy();
  });

  test('should allow closing the login modal without logging in', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    // Open login modal
    await loginPage.navigateToLogin();
    
    // Close it without logging in
    await loginPage.closeLoginModal();
    
    // Verify we're back at the home page and not logged in
    const homePage = new HomePage(page);
    expect(await homePage.carousel).toBeVisible();
    expect(await loginPage.isUserLoggedIn()).toBeFalsy();
  });
});
