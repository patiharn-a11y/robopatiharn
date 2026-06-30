// src/pages/InvoicesPage.ts
import { Page, Locator, expect } from '@playwright/test';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';

export class InvoicesPage {

  readonly page: Page;
  readonly header: Header;
  readonly sidebar: Sidebar;

  readonly invoicesHeader: Locator;
  readonly invoicesReceiptOptions: Locator;
  readonly invoicesReceiptDownloadButton: Locator;

  constructor (page: Page) {
    this.page = page;
    this.header = new Header(page);
    this.sidebar = new Sidebar(page, this.header);

    // Need to edit locators, Not implemented yet
    this.invoicesHeader = page.getByRole('heading', { name: 'Tax Invoice' });
    this.invoicesReceiptOptions = page.getByTestId('invoice-table-row-btn-receipt-RE202604250002')
    this.invoicesReceiptDownloadButton = page.getByTestId('invoice-table-btn-download-receipt');
  }

  async navigateTo() {
    await this.sidebar.sidebarOpen();
    await this.sidebar.invoicesButton.click();
    await expect(this.page).toHaveURL(/.*\/invoices/);
  }

  async verifyDownloadButtonNotVisible() {
    await this.navigateTo();
    await this.invoicesReceiptOptions.click();
    await expect(this.invoicesReceiptDownloadButton).not.toBeVisible();
  }

  async downloadReceipt() {
    await this.navigateTo();

    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.invoicesReceiptOptions.click(),
      this.invoicesReceiptDownloadButton.click(),
    ]);

    expect(download.suggestedFilename()).toBeTruthy();
  }

}