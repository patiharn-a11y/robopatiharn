// src/pages/CustomersPage.ts
import { Page, Locator, expect } from '@playwright/test';
import { Header } from '../../components/Header';
import { Sidebar } from '../../components/Sidebar';
import { Customers } from '../../../test-data/customerData';

export class CustomersPage {
  readonly page                                    : Page;
  readonly header                                  : Header;
  readonly sidebar                                 : Sidebar;

  // Header / Search
  readonly breadcrumbs                             : Locator;
  readonly breadcrumbsFirstItem                    : Locator;
  readonly customersHeader                         : Locator;
  readonly searchInput                             : Locator;
  readonly searchButton                            : Locator;
  readonly searchFilterDropdown                    : Locator;
  readonly searchFilterDropdownOptionName          : Locator;
  readonly searchFilterDropdownOptionIIC           : Locator;
  readonly searchFilterDropdownOptionAccountID     : Locator;

  // ตาราง — row หลัก (customer-row-0)
  readonly customersTableFirstRowName              : Locator;
  readonly customersTableFirstRowCost              : Locator;
  readonly customersTableFirstRowAUM               : Locator;
  readonly customersTableFirstRowGainLoss          : Locator;
  readonly customersTableFirstRowIIC               : Locator;
  readonly customersTableFirstRowLineChatStatus    : Locator;
  readonly customersTableFirstRowExpandButton      : Locator;
  readonly customersTableFirstRowActionButton      : Locator;

  // ตาราง — sub-row แรกหลัง Expand (customer-row-0.0)
  readonly customersTableFirstSubRowName           : Locator;
  readonly customersTableFirstSubRowCost           : Locator;
  readonly customersTableFirstSubRowAUM            : Locator;
  readonly customersTableFirstSubRowGainLoss       : Locator;
  readonly customersTableFirstSubRowIIC            : Locator;
  readonly customersTableFirstSubRowLineChatStatus : Locator;
  readonly customersTableFirstSubRowActionButton   : Locator;

  private _isExpanded = false;

  constructor(page: Page) {
    this.page                                    = page;
    this.header                                  = new Header(page);
    this.sidebar                                 = new Sidebar(page, this.header);

    this.breadcrumbs                             = page.getByTestId('site-breadcrumb');
    this.breadcrumbsFirstItem                    = page.getByTestId('breadcrumb-item-0');
    this.customersHeader                         = page.getByRole('heading', { name: 'Customers' });
    this.searchInput                             = page.getByTestId('search-filter-input-query');
    this.searchButton                            = page.getByTestId('search-filter-btn-submit');
    this.searchFilterDropdown                    = page.getByTestId('search-filter-dropdown-trigger');
    this.searchFilterDropdownOptionName          = page.getByTestId('search-filter-dropdown-item-name');
    this.searchFilterDropdownOptionIIC           = page.getByTestId('search-filter-dropdown-item-iic');
    this.searchFilterDropdownOptionAccountID     = page.getByTestId('search-filter-dropdown-item-accountId');

    this.customersTableFirstRowName              = page.getByTestId('customer-row-0').getByTestId('customer-cell-name');
    this.customersTableFirstRowCost              = page.getByTestId('customer-row-0').getByTestId('customer-cell-cost');
    this.customersTableFirstRowAUM               = page.getByTestId('customer-row-0').getByTestId('customer-cell-aum');
    this.customersTableFirstRowGainLoss          = page.getByTestId('customer-row-0').getByTestId('customer-cell-plAmount');
    this.customersTableFirstRowIIC               = page.getByTestId('customer-row-0').getByTestId('customer-cell-iicName');
    this.customersTableFirstRowLineChatStatus    = page.getByTestId('customer-row-0').getByTestId('customer-cell-lineOpenId');
    this.customersTableFirstRowExpandButton      = page.getByTestId('customer-row-0').getByTestId('customer-cell-expand');
    this.customersTableFirstRowActionButton      = page.getByTestId('customer-row-0').getByTestId('customer-cell-action');

    this.customersTableFirstSubRowName           = page.getByTestId('customer-row-0.0').getByTestId('customer-cell-name');
    this.customersTableFirstSubRowCost           = page.getByTestId('customer-row-0.0').getByTestId('customer-cell-cost');
    this.customersTableFirstSubRowAUM            = page.getByTestId('customer-row-0.0').getByTestId('customer-cell-aum');
    this.customersTableFirstSubRowGainLoss       = page.getByTestId('customer-row-0.0').getByTestId('customer-cell-plAmount');
    this.customersTableFirstSubRowIIC            = page.getByTestId('customer-row-0.0').getByTestId('customer-cell-iicName');
    this.customersTableFirstSubRowLineChatStatus = page.getByTestId('customer-row-0.0').getByTestId('customer-cell-lineOpenId');
    this.customersTableFirstSubRowActionButton   = page.getByTestId('customer-row-0.0').getByTestId('customer-table-row-btn-actions');
  }

  // ตรวจสอบว่า Action Button ไม่แสดงบน row หลัก
  // และถ้า Expand อยู่ จะตรวจ sub-row ด้วย
  async expectActionButtonNotVisible() {
    await expect(this.customersTableFirstRowActionButton).not.toBeVisible();
    if (this._isExpanded) {
      await expect(this.customersTableFirstSubRowActionButton).not.toBeVisible();
    }
  }

  async navigateTo() {
    await this.sidebar.sidebarOpen();
    await this.sidebar.customersButton.click();
    await expect(this.page).toHaveURL(/.*\/customers/);
  }

  // เลือก Filter ประเภทที่ต้องการ, ใส่คำค้นหา, กดค้นหา
  // แล้วรอจนกว่าผลลัพธ์ที่ถูกต้องจะปรากฏใน row แรกของตาราง
  private async performSearch(searchType: 'name' | 'iic' | 'accountId', searchValue: string) {
    const filterOptions = {
      name: this.searchFilterDropdownOptionName,
      iic: this.searchFilterDropdownOptionIIC,
      accountId: this.searchFilterDropdownOptionAccountID,
    };

    await this.searchFilterDropdown.click();
    await filterOptions[searchType].waitFor({ state: 'visible' });
    await filterOptions[searchType].click();
    await filterOptions[searchType].waitFor({ state: 'hidden' });

    await this.searchInput.fill(searchValue);
    await this.searchButton.click();

    if (searchType === 'name') {
      await expect(this.customersTableFirstRowName).toContainText(searchValue);
    } else if (searchType === 'iic') {
      await expect(this.customersTableFirstRowIIC).toContainText(searchValue);
    } else {
      await this.customersTableFirstRowName.waitFor({ state: 'visible' });
    }
  }

  // ตรวจสอบจาก customerData.ts ว่า Customer คนนี้มีมากกว่า 1 Account หรือไม่
  // โดยดูว่ามี accountNumber2 กำหนดไว้หรือเปล่า
  private isMultiAccount(searchType: 'name' | 'iic' | 'accountId', searchValue: string): boolean {
    if (searchType === 'accountId') return false;
    const customer = Object.values(Customers).find(c => c.name === searchValue || c.iic === searchValue);
    return !!customer?.accountNumber2;
  }

  // ค้นหา Customer แล้วนำทางเข้าหน้า Customer Detail
  // - มีหลาย Account → กด Expand แล้วคลิก sub-row แรก
  // - มี 1 Account   → คลิก row หลักเลย
  // คืนค่า Account ID แรกเพื่อให้ Test นำไปตรวจสอบ URL
  async searchAndNavigate(searchType: 'name' | 'iic' | 'accountId', searchValue: string) {
    await this.performSearch(searchType, searchValue);

    if (searchType === 'accountId') {
      this._isExpanded = false;
      await this.customersTableFirstRowName.click();
      return searchValue;
    }

    const customer = Object.values(Customers).find(c => c.name === searchValue || c.iic === searchValue);
    const expectedAccId = customer?.accountNumber1 ?? searchValue;

    if (this.isMultiAccount(searchType, searchValue)) {
      await this.customersTableFirstRowExpandButton.click();
      await this.customersTableFirstSubRowName.waitFor({ state: 'visible' });
      await this.customersTableFirstSubRowName.click();
      this._isExpanded = true;
    } else {
      await this.customersTableFirstRowName.click();
      this._isExpanded = false;
    }

    return expectedAccId;
  }

  // ค้นหา Customer แล้ว Expand row เพื่อดู sub-rows (กรณีมีหลาย Account)
  // - มีหลาย Account → กด Expand และรอ sub-row ปรากฏ (_isExpanded = true)
  // - มี 1 Account   → ไม่ต้อง Expand (_isExpanded = false)
  async searchAndExpand(searchType: 'name' | 'iic' | 'accountId', searchValue: string) {
    await this.performSearch(searchType, searchValue);

    if (searchType === 'accountId' || !this.isMultiAccount(searchType, searchValue)) {
      this._isExpanded = false;
      return;
    }

    await this.customersTableFirstRowExpandButton.click();
    await this.customersTableFirstSubRowName.waitFor({ state: 'visible' });
    this._isExpanded = true;
  }
}
