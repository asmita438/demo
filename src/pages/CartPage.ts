import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
    readonly cartItems: Locator;
    readonly placeOrderButton: Locator;
    readonly totalPrice: Locator;
    readonly deleteLinks: Locator;
    
    constructor(page: Page) {
      super(page);
      this.cartItems = page.locator('.success');
      this.placeOrderButton = page.getByRole('button', { name: 'Place Order' });
      this.totalPrice = page.locator('#totalp');
      this.deleteLinks = page.getByRole('link', { name: 'Delete' });
    }
  
    async getCartItemsCount(): Promise<number> {
      await this.page.waitForSelector('tbody.tbody tr', { state: 'visible', timeout: 5000 });
      return this.cartItems.count();
    }
  
    async getCartItems(): Promise<{ title: string; price: string }[]> {
      const items: { title: string; price: string }[] = [];
      const count = await this.cartItems.count();
      
      for (let i = 0; i < count; i++) {
        const row = this.cartItems.nth(i);
        const title = (await row.locator('td:nth-child(2)').textContent()) ?? '';
        const price = (await row.locator('td:nth-child(3)').textContent()) ?? '';
        items.push({ title, price });
      }
      
      return items;
    }
  
    async isProductInCart(productName: string): Promise<boolean> {
      const items = await this.getCartItems();
      return items.some(item => item.title.includes(productName));
    }
  
    async deleteItemFromCart(index = 0) {
      const deleteLinks = this.deleteLinks;
      const countBefore = await deleteLinks.count();
      
      if (countBefore > index) {
        await deleteLinks.nth(index).click();
        
        // Wait for the item to be removed
        await this.page.waitForTimeout(1000);
        
        // Verify that an item was removed
        const countAfter = await deleteLinks.count();
        return countBefore > countAfter;
      }
      
      return false;
    }
  
    async getTotalPrice(): Promise<string> {
      return (await this.totalPrice.textContent()) ?? '0';
    }
  }