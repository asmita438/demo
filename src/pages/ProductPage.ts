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

  async addToCart() {
    // Set up alert listener before clicking "Add to cart"
    const alertPromise = waitForAlert(this.page);
    
    await this.addToCartButton.click();
    
    // Wait for and handle the alert
    const alertText = await alertPromise;
    return {
      success: alertText.includes('Product added'),
      message: alertText
    };
  }
}