// src/pages/CustomersPage.ts
import { Page, Locator, expect } from '@playwright/test';
import { Header } from '../../components/Header';
import { Sidebar } from '../../components/Sidebar';
import { Customers } from '../../../test-data/customerData';

export class CustomersPage {
  readonly page: Page;
  readonly header: Header;
  readonly sidebar: Sidebar;
  
  // Headers
  readonly breadcrumbs: Locator;
  readonly breadcrumbsFirstItem: Locator;
  readonly customersHeader: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly searchFilterDropdown: Locator;
  readonly searchFilterDropdownOptionName: Locator;
  readonly searchFilterDropdownOptionIIC: Locator;
  readonly searchFilterDropdownOptionAccountID: Locator;

  // Table
  readonly customersTableFirstRowName: Locator;
  readonly customersTableFirstRowCost: Locator;
  readonly customersTableFirstRowAUM: Locator;
  readonly customersTableFirstRowGainLoss: Locator;
  readonly customersTableFirstRowIIC: Locator;
  readonly customersTableFirstRowLineChatStatus: Locator;
  readonly customersTableFirstRowExpandButton: Locator;
  readonly customersTableFirstRowActionButton: Locator;

  readonly customersTableFirstRowExpandedName: Locator;
  readonly customersTableFirstRowExpandedCost: Locator;
  readonly customersTableFirstRowExpandedAUM: Locator;
  readonly customersTableFirstRowExpandedGainLoss: Locator;
  readonly customersTableFirstRowExpandedIIC: Locator;
  readonly customersTableFirstRowExpandedLineChatStatus: Locator;
  readonly customersTableFirstRowExpandedActionButton: Locator;  


    constructor(page: Page) {
    this.page = page;
    this.header = new Header(page);
    this.sidebar = new Sidebar(page, this.header);

    // Headers
    this.breadcrumbs =                          page.getByTestId('site-breadcrumb');
    this.breadcrumbsFirstItem =                 page.getByTestId('breadcrumb-item-0');
    this.customersHeader =                      page.getByRole('heading', { name: 'Customers' });
    this.searchInput =                          page.getByTestId('search-filter-input-query');
    this.searchButton =                         page.getByTestId('search-filter-btn-submit');
    this.searchFilterDropdown =                 page.getByTestId('search-filter-dropdown-trigger');
    this.searchFilterDropdownOptionName =       page.getByTestId('search-filter-dropdown-item-name');
    this.searchFilterDropdownOptionIIC =        page.getByTestId('search-filter-dropdown-item-iic');
    this.searchFilterDropdownOptionAccountID =  page.getByTestId('search-filter-dropdown-item-accountId');

    // Table & Pagination
    this.customersTableFirstRowName =           page.getByTestId('customer-row-0').getByTestId('customer-cell-name');
    this.customersTableFirstRowCost =           page.getByTestId('customer-row-0').getByTestId('customer-cell-cost');
    this.customersTableFirstRowAUM =            page.getByTestId('customer-row-0').getByTestId('customer-cell-aum');
    this.customersTableFirstRowGainLoss =       page.getByTestId('customer-row-0').getByTestId('customer-cell-plAmount');
    this.customersTableFirstRowIIC =            page.getByTestId('customer-row-0').getByTestId('customer-cell-iicName');
    this.customersTableFirstRowLineChatStatus = page.getByTestId('customer-row-0').getByTestId('customer-cell-lineOpenId');
    this.customersTableFirstRowExpandButton =   page.getByTestId('customer-row-0').getByTestId('customer-cell-expand');
    this.customersTableFirstRowActionButton =   page.getByTestId('customer-row-0').getByTestId('customer-cell-action');

    this.customersTableFirstRowExpandedName =           page.getByTestId('customer-row-0.0').getByTestId('customer-cell-name');
    this.customersTableFirstRowExpandedCost =           page.getByTestId('customer-row-0.0').getByTestId('customer-cell-cost');
    this.customersTableFirstRowExpandedAUM =            page.getByTestId('customer-row-0.0').getByTestId('customer-cell-aum');
    this.customersTableFirstRowExpandedGainLoss =       page.getByTestId('customer-row-0.0').getByTestId('customer-cell-plAmount');
    this.customersTableFirstRowExpandedIIC =            page.getByTestId('customer-row-0.0').getByTestId('customer-cell-iicName');
    this.customersTableFirstRowExpandedLineChatStatus = page.getByTestId('customer-row-0.0').getByTestId('customer-cell-lineOpenId');
    this.customersTableFirstRowExpandedActionButton =   page.getByTestId('customer-row-0.0').getByTestId('customer-table-row-btn-actions');

  }

  async navigateTo() {
    await this.sidebar.sidebarOpen();
    await this.sidebar.customersButton.click();
    await expect(this.page).toHaveURL(/.*\/customers/);
  }

  async searchAndNavigate(searchType: 'name' | 'iic' | 'accountId', searchValue: string) {
    // 1. Select the filter
    await this.searchFilterDropdown.click();
    const filterOptions = {
        name: this.searchFilterDropdownOptionName,
        iic: this.searchFilterDropdownOptionIIC,
        accountId: this.searchFilterDropdownOptionAccountID
    };
    await filterOptions[searchType].click();

    // 2. Perform search
    await this.searchInput.fill(searchValue);
    await this.searchButton.click();

    // 3. Logic to determine expected Account ID
    let expectedAccId: string;

    if (searchType === 'accountId') {
        expectedAccId = searchValue;
    } else {
        // Find the customer object that matches the name/iic provided
        // This assumes you store the data as an array or object in customerData.ts
        const customer = Object.values(Customers).find(c => c.name === searchValue || c.iic === searchValue);
        expectedAccId = customer ? customer.accountNumber1 : searchValue;
    }

    // 4. Perform the click to navigate
    if (searchType === 'accountId') {
      await this.customersTableFirstRowName.click();
    } else {
      await this.customersTableFirstRowExpandButton.click();
      await this.customersTableFirstRowExpandedName.click();
    }

    // 5. Return the ID so the test can assert the URL
    return expectedAccId;
  }

  async searchAndExpand(searchType: 'name' | 'iic' | 'accountId', searchValue: string) {
    // 1. Select the filter
    await this.searchFilterDropdown.click();
    const filterOptions = {
      name: this.searchFilterDropdownOptionName,
      iic: this.searchFilterDropdownOptionIIC,
      accountId: this.searchFilterDropdownOptionAccountID
    };
    await filterOptions[searchType].click();

    // 2. Perform search
    await this.searchInput.fill(searchValue);
    await this.searchButton.click();

    // 3. Logic to determine expected Account ID
    let expectedAccId: string;

    if (searchType === 'accountId') {
      expectedAccId = searchValue;
    } else {
      const customer = Object.values(Customers).find(c => c.name === searchValue || c.iic === searchValue);
      expectedAccId = customer ? customer.accountNumber1 : searchValue;
    }

    // 4. Expand row (skip for accountId — direct result, no expansion needed)
    if (searchType !== 'accountId') {
      await this.customersTableFirstRowExpandButton.click();
    }

  }
}