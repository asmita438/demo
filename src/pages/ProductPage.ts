import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { waitForAlert } from '../utils/helpers';

export class ProductPage extends BasePage {
  readonly productTitle: Locator;
  readonly productDescription: Locator;
  readonly productPrice: Locator;
  readonly addToCartButton: Locator;
  
  constructor(page: Page) {
    super(page);
    this.productTitle = page.locator('.name');
    this.productDescription = page.locator('#more-information p');
    this.productPrice = page.locator('.price-container');
    this.addToCartButton = page.getByRole('link', { name: 'Add to cart' });
  }

  async getProductDetails() {
    await expect(this.productTitle).toBeVisible();
    return {
      title: await this.productTitle.textContent(),
      description: await this.productDescription.textContent(),
      price: await this.productPrice.textContent()
    };
  }
  async navigateToProductByCategory(name: string, category: string): Promise<void> {
    // Click on the category in the left sidebar
    const categoryLink = this.page.locator(`#itemc`).filter({ hasText: category });
    await categoryLink.click();
    
    // Wait for the category page to load and products to be displayed
    await this.page.waitForSelector('.card-title');
    
    // Find and click on the specific product by name
    const productLink = this.page.locator('.card-title a').filter({ hasText: name });
    await productLink.click();
    
    // Wait for the product details page to load
    await this.page.waitForSelector('.product-deatil', { state: 'visible' });
  }

  async addProductToCart(): Promise<void> {
    // Click 'Add to cart' button
    await this.addToCartButton.click();
  
    // Wait for the confirmation alert to appear
    /*this.page.once('dialog', async (dialog) => {
      console.log(`Dialog message: ${dialog.message()}`);
      await dialog.accept();
    });*/
  
    // Small delay to ensure product is registered in cart
    await this.page.waitForTimeout(1000);
  }
  /*async addProductToCart() {
    const productName = await this.productTitle.textContent();
    await this.addToCartButton.click();
    
    
    await this.page.on('dialog', async dialog => {
      expect(dialog.type()).toBe('alert');
      await dialog.accept();
    });
  }*/

async getProductPrice(): Promise<number> {
  const priceText = await this.page.locator('h3.price-container').textContent(); 
  const price = priceText ? parseInt(priceText.replace(/[^0-9]/g, '')) : 0;
  return price;
}

}