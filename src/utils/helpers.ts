import { Page } from '@playwright/test';

export async function waitForAlert(page: Page): Promise<string> {
  return new Promise(resolve => {
    page.once('dialog', dialog => {  
      const message = dialog.message();
      dialog.accept();
      resolve(message);
    });
  });
}

export async function generateRandomUsername(): Promise<string> {
  return `testuser${Math.floor(Math.random() * 100000)}`;
}
