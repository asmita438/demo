import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly cartTable: Locator;
  readonly cartItems: Locator;
  readonly placeOrderButton: Locator;
  readonly itemDeleteButtons: Locator;
  readonly totalPrice: Locator;
  readonly emptyCartMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.cartTable = page.locator('#tbodyid');
    this.cartItems = page.locator('.success');
    this.placeOrderButton = page.locator('button').filter({ hasText: 'Place Order' });
    this.itemDeleteButtons = page.locator('.btn-danger');
    this.totalPrice = page.locator('#totalp');
    this.emptyCartMessage = page.locator('h3').filter({ hasText: 'Products' });
  }

  async getCartItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async verifyProductInCart(productName: string) {
    const productInCart = this.cartItems.filter({ hasText: productName });
    await expect(productInCart).toBeVisible();
  }

  async getProductPrice(productName: string): Promise<string> {
    const productRow = this.cartItems.filter({ hasText: productName });
    const priceCell = productRow.locator('td').nth(2);
    return await priceCell.textContent() || '';
  }

  async removeProductFromCart(productName: string) {
    const productRow = this.cartItems.filter({ hasText: productName });
    const deleteButton = productRow.locator('.btn-danger');
    await deleteButton.click();
    
    // Wait for item to be removed
    await this.page.waitForTimeout(1000);
    
    // Verify the product is no longer in the cart
    const productInCart = this.cartItems.filter({ hasText: productName });
    await expect(productInCart).toHaveCount(0);
  }

  async getTotalPrice(): Promise<string> {
    return await this.totalPrice.textContent() || '0';
  }
  
  async emptyCart() {
    // First go to the cart page
    await this.navigateToCart();
    await this.waitForPageLoad();
    
    // Get the number of items in cart
    const itemCount = await this.getCartItemCount();
    
    // If cart is not empty, remove all items
    if (itemCount > 0) {
      // Use a for loop with a decreasing index because we're removing items
      for (let i = itemCount - 1; i >= 0; i--) {
        // Get the delete button for the current item
        const deleteButton = this.itemDeleteButtons.nth(i);
        await deleteButton.click();
        
        // Wait for the item to be removed
        await this.page.waitForTimeout(500);
      }
      
      // Verify cart is empty
      await expect(this.cartItems).toHaveCount(0);
    }
    
    // Go back to home page
    await this.homeLink.click();
    await this.waitForPageLoad();
  }
  
  async isCartEmpty(): Promise<boolean> {
    await this.navigateToCart();
    await this.waitForPageLoad();
    
    const itemCount = await this.getCartItemCount();
    return itemCount === 0;
  }
}
