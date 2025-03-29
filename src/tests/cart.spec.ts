import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { ProductPage } from '../pages/productPage';
import { CartPage } from '../pages/cartPage';
import { TEST_DATA } from '../utils/test-data';

test.describe('Shopping Cart Functionality', () => {
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
  });

  test('should add a product to cart as a guest user', async ({ page }) => {
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    
    // Select a product
    await homePage.selectCategory(TEST_DATA.products.phone.category);
    await homePage.selectProduct(TEST_DATA.products.phone.name);
    
    // Add to cart
    const addResult = await productPage.addToCart();
    expect(addResult.success).toBeTruthy();
    expect(addResult.message).toContain('Product added');
    
    // Navigate to cart
    await cartPage.navigateToCart();
    
    // Verify item is in cart
    expect(await cartPage.isProductInCart(TEST_DATA.products.phone.name)).toBeTruthy();
    expect(await cartPage.getCartItemsCount()).toBe(1);
  });

  test('should add multiple products to cart', async ({ page }) => {
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    
    // Add first product
    await homePage.selectCategory(TEST_DATA.products.phone.category);
    await homePage.selectProduct(TEST_DATA.products.phone.name);
    await productPage.addToCart();
    
    // Add second product
    await homePage.navigateToHome();
    await homePage.selectCategory(TEST_DATA.products.laptop.category);
    await homePage.selectProduct(TEST_DATA.products.laptop.name);
    await productPage.addToCart();
    
    // Navigate to cart
    await cartPage.navigateToCart();
    
    // Verify both items are in cart
    const cartItems = await cartPage.getCartItems();
    expect(cartItems.length).toBe(2);
    expect(await cartPage.isProductInCart(TEST_DATA.products.phone.name)).toBeTruthy();
    expect(await cartPage.isProductInCart(TEST_DATA.products.laptop.name)).toBeTruthy();
  });

  test('should keep cart items after login', async ({ page }) => {
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const loginPage = new LoginPage(page);
    
    // Add item to cart as guest
    await homePage.selectCategory(TEST_DATA.products.phone.category);
    await homePage.selectProduct(TEST_DATA.products.phone.name);
    await productPage.addToCart();
    
    // Login
    await loginPage.login(TEST_DATA.validUser.username, TEST_DATA.validUser.password);
    
    // Navigate to cart
    await cartPage.navigateToCart();
    
    // Verify item is still in cart
    expect(await cartPage.isProductInCart(TEST_DATA.products.phone.name)).toBeTruthy();
    expect(await cartPage.getCartItemsCount()).toBe(1);
  });

  test('should be able to remove items from cart', async ({ page }) => {
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    
    // Add item to cart
    await homePage.selectCategory(TEST_DATA.products.phone.category);
    await homePage.selectProduct(TEST_DATA.products.phone.name);
    await productPage.addToCart();
    
    // Navigate to cart
    await cartPage.navigateToCart();
    
    // Verify item is in cart
    expect(await cartPage.getCartItemsCount()).toBe(1);
    
    // Remove item
    const removed = await cartPage.deleteItemFromCart();
    expect(removed).toBeTruthy();
    
    // Verify cart is empty
    expect(await cartPage.getCartItemsCount()).toBe(0);
  });

  test('should calculate correct total price in cart', async ({ page }) => {
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    
    // Get first product price
    await homePage.selectCategory(TEST_DATA.products.phone.category);
    await homePage.selectProduct(TEST_DATA.products.phone.name);
    const product1Details = await productPage.getProductDetails();
    await productPage.addToCart();
    
    // Get second product price
    await homePage.navigateToHome();
    await homePage.selectCategory(TEST_DATA.products.laptop.category);
    await homePage.selectProduct(TEST_DATA.products.laptop.name);
    const product2Details = await productPage.getProductDetails();
    await productPage.addToCart();
    
    // Navigate to cart
    await cartPage.navigateToCart();
    
    // Verify total price is calculated correctly
    const totalPrice = await cartPage.getTotalPrice();
    
    // Extract numeric prices (this is a simplified example, actual parsing may vary)
    const price1 = parseInt(product1Details.price.replace(/[^0-9]/g, ''));
    const price2 = parseInt(product2Details.price.replace(/[^0-9]/g, ''));
    const expectedTotal = price1 + price2;
    
    // Convert to string for comparison with totalPrice which is a string
    expect(totalPrice).toBe(expectedTotal.toString());
  });

  test('should persist cart items after page refresh', async ({ page }) => {
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    
    // Add item to cart
    await homePage.selectCategory(TEST_DATA.products.phone.category);
    await homePage.selectProduct(TEST_DATA.products.phone.name);
    await productPage.addToCart();
    
    // Navigate to cart and check item
    await cartPage.navigateToCart();
    expect(await cartPage.getCartItemsCount()).toBe(1);
    
    // Refresh page
    await page.reload();
    
    // Verify item is still in cart
    expect(await cartPage.getCartItemsCount()).toBe(1);
    expect(await cartPage.isProductInCart(TEST_DATA.products.phone.name)).toBeTruthy();
  });
});