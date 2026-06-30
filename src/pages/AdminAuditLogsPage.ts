// src/pages/AdminAuditLogsPage.ts
import { Page, Locator, expect } from '@playwright/test';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';

export class AdminAuditLogsPage {
  readonly page: Page;

  // Components
  readonly header: Header;
  readonly sidebar: Sidebar;

  // Headers
  readonly adminAuditLogsHeader: Locator;
  readonly breadcrumbs: Locator;

  // Filters
  readonly moduleDropdown: Locator;
  readonly actionNameDropdown: Locator;
  readonly adminEmailDropdown: Locator;
  readonly resourceIdInput: Locator;
  readonly fromDateInput: Locator;
  readonly toDateInput: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;

  // Table & Pagination
  readonly logTable: Locator;
  readonly previousPageButton: Locator;
  readonly nextPageButton: Locator;
  readonly onlyRowViewDetailsButton: Locator;

  // Detail Modal Elements
  readonly detailModal: Locator;
  readonly modalTitle: Locator;
  readonly modalId: Locator;
  readonly modalStatus: Locator;
  readonly modalActionName: Locator;
  readonly modalResourceId: Locator;
  readonly modalAdminEmail: Locator;
  readonly modalTimeStamp: Locator;
  readonly modalUserAgent: Locator;
  readonly modalAdminName: Locator;
  readonly modalDetailJson: Locator;
  readonly closeModalButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Components
    this.header = new Header(page);
    this.sidebar = new Sidebar(page, this.header);

    // Headers
    this.adminAuditLogsHeader = page.getByRole('heading', { name: 'Admin Audit Logs' });
    this.breadcrumbs = page.getByRole('navigation', { name: 'Breadcrumb' });

    // Filters
    this.moduleDropdown = page.getByRole('combobox', { name: 'Module' });
    this.actionNameDropdown = page.getByRole('combobox', { name: 'Action Name' });
    this.adminEmailDropdown = page.getByRole('combobox', { name: 'Admin Email' });
    this.resourceIdInput = page.getByRole('textbox', { name: 'Resource ID' });
    this.fromDateInput = page.getByRole('textbox', { name: 'From Date' });
    this.toDateInput = page.getByRole('textbox', { name: 'To Date' });
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.resetButton = page.getByRole('button', { name: 'Reset' });

    // Table & Pagination
    this.logTable = page.getByRole('table', { name: 'Audit Logs' });
    this.previousPageButton = page.getByRole('button', { name: 'Previous Page' });
    this.nextPageButton = page.getByRole('button', { name: 'Next Page' });
    this.onlyRowViewDetailsButton = page.getByRole('button', { name: 'View Detail' });

    // Detail Modal Elements
    this.detailModal = page.getByRole('dialog', { name: 'Action Log Detail' });
    this.modalTitle = page.getByRole('heading', { name: 'Action Log Detail' });
    this.modalId = page.getByText('ID', { exact: true });
    this.modalStatus = page.getByText('Status');
    this.modalActionName = page.getByLabel('Action Log Detail').getByText('Action Name');
    this.modalResourceId = page.getByLabel('Action Log Detail').getByText('Resource ID');
    this.modalAdminEmail = page.getByLabel('Action Log Detail').getByText('Admin Email');
    this.modalAdminName = page.getByLabel('Action Log Detail').getByText('Admin Name');
    this.modalTimeStamp = page.getByLabel('Action Log Detail').getByText('Timestamp');
    this.modalUserAgent = page.getByLabel('Action Log Detail').getByText('User Agent');
    this.modalDetailJson = page.getByText('{ "body": { "name": "');
    this.closeModalButton = page.getByRole('button', { name: 'Close' });
  }

  async navigateTo() {
    await this.sidebar.sidebarOpen();
    await this.sidebar.adminAuditLogsButton.click();
    await expect(this.adminAuditLogsHeader).toBeVisible();
  }
  async getModalValueForLabel(labelName: string): Promise<string> {
      // Looks for an element with your label text, then jumps to its adjacent structural partner
      const valueLocator = this.detailModal
        .locator(`xpath=//*[text()="${labelName}"]/following-sibling::*[1]`)
        .or(this.detailModal.locator(`p:has-text("${labelName}") + p`))
        .or(this.detailModal.locator(`div:has-text("${labelName}") + div`))
        .first();

      return (await valueLocator.innerText()).trim();
  }

  /**
   * Parses the stringified code layout snippet inside your Detail JSON field
   */
  async getDetailJsonContent(): Promise<any> {
    // Locates the text that starts with your exact JSON string match snippet block
    const jsonValueLocator = this.detailModal
    .locator('xpath=//*[text()="Detail"]/following-sibling::*[1]')
    .or(this.detailModal.locator('p:has-text("Detail JSON") + pre'))
    .or(this.detailModal.locator('div:has-text("Detail JSON") + div'))
    .first();

    const rawJsonText = await jsonValueLocator.innerText();
  
    // Clean up any edge cases and parse it into an object we can assert against
    return JSON.parse(rawJsonText.trim());
  }
}

