import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
   
  readonly productCards: Locator;
  readonly categoryPhones: Locator;
  readonly categoryLaptops: Locator;
  readonly categoryMonitors: Locator;
  readonly carousel: Locator;
  
  constructor(page: Page) {
    super(page);
    
    this.productCards = page.locator('.card');
    this.categoryPhones = page.getByRole('link', { name: 'Phones' });
    this.categoryLaptops = page.getByRole('link', { name: 'Laptops' });
    this.categoryMonitors = page.getByRole('link', { name: 'Monitors' });
    this.carousel = page.locator('#carouselExampleIndicators');
  }

  async selectCategory(category: 'Phones' | 'Laptops' | 'Monitors') {
    switch (category) {
      case 'Phones':
        await this.categoryPhones.click();
        break;
      case 'Laptops':
        await this.categoryLaptops.click();
        break;
      case 'Monitors':
        await this.categoryMonitors.click();
        break;
    }
    // Wait for products to load after category selection
    await this.page.waitForTimeout(1000); // Brief wait as the site may not have obvious loading indicators
  }

  async selectProduct(productName: string) {
    const productLink = this.page.getByRole('link', { name: productName, exact: true });
    await productLink.waitFor({ state: 'visible' });
    await productLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getProductCount(): Promise<number> {
    return await this.productCards.count();
  }
}