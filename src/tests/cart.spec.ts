import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { TEST_DATA } from '../utils/test-data';

test.describe('Shopping Cart Flow', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cartPage = new CartPage(page);
    
    // Start from home page
    await loginPage.navigateToLogin();
    await loginPage.waitForPageLoad();
    
    // Login before each test
    await loginPage.login(TEST_DATA.validUser.username, TEST_DATA.validUser.password);

    await cartPage.refreshCart();
    
    // Empty the cart to ensure a clean state for each test
    await cartPage.emptyCart();
    
    // Verify the cart is empty
    
  
    const isCartEmpty = await cartPage.isCartEmpty();
    expect(isCartEmpty).toBeTruthy();
    
    // Go back to home page
    await loginPage.homeLink.click();
    await loginPage.waitForPageLoad();
  });
  
  test('add a phone product to cart', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const { name, category } = TEST_DATA.products.phone;
    
    // Navigate to product by category
    await productPage.navigateToProductByCategory(name, category);
    
    // Add product to cart
    await productPage.addProductToCart();
    
    // Go to cart
    await cartPage.navigateToCart();
    await cartPage.waitForPageLoad();
    
    // Verify product is in cart
    await cartPage.verifyProductInCart(name);
  });
  
  test('add multiple products to cart', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const phone = TEST_DATA.products.phone;
    const laptop = TEST_DATA.products.laptop;
    
    // Add phone product
    await productPage.navigateToProductByCategory(phone.name, phone.category);
    await productPage.addProductToCart();
    await productPage.navigateToHome(); // Go back to home
    
    // Add laptop product
    await productPage.navigateToProductByCategory(laptop.name, laptop.category);
    await productPage.addProductToCart();
    
    // Go to cart
    await cartPage.navigateToCart();
    await cartPage.waitForPageLoad();
    
    // Verify both products are in cart
    await cartPage.verifyProductInCart(phone.name);
    await cartPage.verifyProductInCart(laptop.name);
    
    // Verify cart item count
    expect(await cartPage.getCartItemCount()).toBe(2);
  });
  
  test.only('remove product from cart', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const { name, category } = TEST_DATA.products.monitor;
    
    // Add product to cart
    await productPage.navigateToProductByCategory(name, category);
    await productPage.addProductToCart();
    
    // Go to cart
    await cartPage.navigateToCart();
    await cartPage.waitForPageLoad();
    
    // Verify product is in cart
    await cartPage.verifyProductInCart(name);
    
    // Get initial cart count
    const initialCartCount = await cartPage.getCartItemCount();
    expect(initialCartCount).toBe(1);
    
    // Remove product from cart
    await cartPage.removeProductFromCart(name);
    
    // Verify cart is empty
    const newCartCount = await cartPage.getCartItemCount();
    expect(newCartCount).toBe(0);
  });
  
  test('verify total price calculation', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const phone = TEST_DATA.products.phone;
    const monitor = TEST_DATA.products.monitor;
    
    // Add phone product
    await productPage.navigateToProductByCategory(phone.name, phone.category);
    const price1 = await productPage.getProductPrice();
    await productPage.addProductToCart();
    await productPage.navigateToHome(); // Go back to home
    
    // Add monitor product
    await productPage.navigateToProductByCategory(monitor.name, monitor.category);
    const price2 = await productPage.getProductPrice();
    await productPage.addProductToCart();
    
    // Go to cart
    await cartPage.navigateToCart();
    await cartPage.waitForPageLoad();
    await cartPage.waitForCartItems();
    
    // Get total price
    const totalPrice = await cartPage.getTotalPrice();
    
    // Calculate expected total
    const expectedTotal = price1 + price2;
    
    // Verify total is correct
    expect(parseInt(totalPrice)).toBe(expectedTotal);
  });
});