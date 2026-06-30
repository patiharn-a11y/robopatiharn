// src/pages/IncomesPage.ts
import { Page, Locator, expect } from '@playwright/test';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';

export class IncomesPage {

  readonly page: Page;
  readonly header: Header;
  readonly sidebar: Sidebar;

  readonly incomeHeader: Locator;
  readonly incomeTotalOverview: Locator;
  readonly incomeChart: Locator;
  readonly incomeCustomerFeeTable: Locator;

  constructor (page: Page) {
    this.page = page;
    this.header = new Header(page);
    this.sidebar = new Sidebar(page, this.header);

    this.incomeHeader = page.getByRole('heading', { name: 'Income Overview' });
    this.incomeTotalOverview = page.getByText('Total Income (ปี 2569)');
    this.incomeChart = page.getByTestId('income-chart').getByText('Income (ปี 2569)');
    this.incomeCustomerFeeTable = page.getByRole('heading', { name: 'Customer Fee' });
  }

  async navigateTo() {
    await this.sidebar.sidebarOpen();
    await this.sidebar.incomeButton.click();
    await expect(this.page).toHaveURL(/.*\/income/);
  }

  async verifyVisibleAllSectionExcept(hiddenKeys: Array<'incomeChart' | 'incomeTotalOverview' | 'incomeCustomerFeeTable'> = []) {
    const sections = {
      incomeChart:           this.incomeChart,
      incomeTotalOverview:   this.incomeTotalOverview,
      incomeCustomerFeeTable: this.incomeCustomerFeeTable,
    };

    await expect(this.incomeHeader).toBeVisible();

    for (const [key, locator] of Object.entries(sections) as [keyof typeof sections, Locator][]) {
      if (hiddenKeys.includes(key)) {
        await expect(locator, `Expected ${key} to be hidden`).toBeHidden();
      } else {
        await expect(locator, `Expected ${key} to be visible`).toBeVisible();
      }
    }
  }

}