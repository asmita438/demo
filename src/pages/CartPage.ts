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
    this.itemDeleteButtons = page.locator("a[onclick*='deleteItem']");
    this.totalPrice = page.locator('#totalp');
    this.emptyCartMessage = page.locator('h3').filter({ hasText: 'Products' });
  }

  async refreshCart(): Promise<void> {
    await this.navigateToCart();

    // ✅ Wait for the cart page to fully load
    await this.page.waitForLoadState('domcontentloaded');  // Or use 'networkidle' if needed
    
    // ✅ Ensure the cart table is visible before interacting
    await this.cartTable.waitFor({ state: 'visible', timeout: 5000 });
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
    const deleteButton = productRow.locator('a[onclick^="deleteItem"]');
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

  async waitForCartItems() {
    await this.page.waitForSelector('#tbodyid tr', { state: 'visible', timeout: 5000 });
  }

  /*async emptyCart(): Promise<void> {
    await this.navigateToCart();

    // ✅ Ensure the cart page is fully loaded before interacting
    //await this.page.waitForLoadState('networkidle');
    await this.cartTable.waitFor({ state: 'visible', timeout: 5000 });

    // ✅ Wait until cart items are fully rendered
    await this.page.waitForFunction(() => document.querySelectorAll("#tbodyid tr").length >= 0);

    let itemCount = await this.getCartItemCount();

    // If the cart has items, remove them one by one
    while (itemCount > 0) {
        const deleteButton = this.itemDeleteButtons.nth(0); // Always target the first item
        await deleteButton.click();

        // ✅ Wait for the item to disappear before proceeding
        await this.page.waitForTimeout(1000);
        await this.page.waitForFunction(
            (expectedCount) => document.querySelectorAll("a[onclick^='deleteItem']").length < expectedCount,
            itemCount
        );

        // Update item count
        itemCount = await this.getCartItemCount();
    }

    // ✅ Wait until the cart is fully empty
    await this.page.waitForFunction(() => document.querySelectorAll("#tbodyid tr").length === 0);

    // ✅ Confirm cart is empty
    if (await this.getCartItemCount() !== 0) {
        throw new Error("Cart is not empty after attempting to remove all items.");
    }

    // ✅ Go back to home page
    await this.homeLink.click();
    await this.waitForPageLoad();
}
*/
async emptyCart(): Promise<void> {
  await this.navigateToCart();

  // ✅ Wait for the cart page to load
  await this.page.waitForLoadState('domcontentloaded');
  const isCartVisible = await this.cartTable.isVisible();
  if (isCartVisible) {
        // ✅ Wait for cart table to be visible if it is there
     await this.cartTable.waitFor({ state: 'visible', timeout: 5000 });

        // ✅ Get the initial cart item count
     let itemCount = await this.getCartItemCount();

        // ✅ If cart has items, start deleting
     while (itemCount > 0) {
            const deleteButtons = await this.itemDeleteButtons.all(); // Get all delete buttons
            for (let i = 0; i < deleteButtons.length; i++) {
                const deleteButton = deleteButtons[i];

                // ✅ Ensure delete button exists before clicking
                if (await deleteButton.isVisible()) {
                    await deleteButton.click();

                    // ✅ Wait for cart item count to decrease after the click
                    await this.page.waitForFunction(
                        async (currentItemCount: number) => {
                            const updatedItemCount = document.querySelectorAll("a[onclick*='deleteItem']").length;
                            return updatedItemCount < currentItemCount; // Verify if item count decreased
                        },
                        itemCount
                    );

                    break; // Exit the loop to re-check item count and delete the next item
                }
            }

            // ✅ Update item count to check again
            itemCount = await this.getCartItemCount();
        }

        // ✅ Confirm cart is empty (ensuring no items left in cart)
        await this.page.waitForFunction(() => document.querySelectorAll("#tbodyid tr").length === 0, { timeout: 5000 });
    }

    // ✅ Go back to home page
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
