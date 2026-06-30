// src/pages/CustomersDetailPage.ts
import { Page, Locator, expect } from '@playwright/test';
import { Header } from '../../components/Header';
import { Sidebar } from '../../components/Sidebar';

export type CustomerDetailTabKey = 'profileTab' | 'assetAllocationTab' | 'fundByLotTab' | 'fundByLotLiveTab' | 'transactionsTab';

export class CustomersDetailPage {
  readonly page: Page;
  readonly header: Header;
  readonly sidebar: Sidebar;

  //Headers
  readonly breadcrumbs: Locator;
  readonly breadcrumbsFirstItem: Locator;
  readonly breadcrumbsSecondItem: Locator;
  readonly customersDetailHeader: Locator;
  readonly createTransactionButton: Locator;
  readonly generateReportButton: Locator;

  //Tabs
  readonly profileTab: Locator;
  readonly assetAllocationTab: Locator;
  readonly fundByLotTab:  Locator;
  readonly fundByLotLiveTab: Locator;
  readonly transactionsTab: Locator;

  //Page Elements
  readonly profileOverviewBox: Locator;
  readonly assetAllocationOverviewBox: Locator;
  readonly fundByLotOverviewBox: Locator;
  readonly fundByLotLiveOverviewBox: Locator;
  readonly transactionTable: Locator;

    constructor(page: Page){
      this.page = page;
      this.header = new Header(page);
      this.sidebar = new Sidebar(page, this.header);

      this.breadcrumbs =                          page.getByTestId('site-breadcrumb');
      this.breadcrumbsFirstItem =                 page.getByTestId('breadcrumb-item-0');
      this.breadcrumbsSecondItem =                page.getByTestId('breadcrumb-item-1');

      this.customersDetailHeader =                page.getByRole('heading');
      this.createTransactionButton =              page.getByRole('button', { name: 'Create Transaction' });
      this.generateReportButton =                 page.getByRole('button', { name: 'Report' });

      this.profileTab =                           page.getByTestId('customer-detail-tab-profile');
      this.assetAllocationTab =                   page.getByTestId('customer-detail-tab-asset-allocation');
      this.fundByLotTab =                         page.getByTestId('customer-detail-tab-fund-by-lot');
      this.fundByLotLiveTab =                     page.getByTestId('customer-detail-tab-fund-by-lot-live');
      this.transactionsTab =                      page.getByTestId('customer-detail-tab-transactions');

      this.profileOverviewBox =                   page.getByText('ชื่อ-สกุล');
      this.assetAllocationOverviewBox =           page.getByText('มูลค่าลงทุนรวม');
      this.fundByLotOverviewBox =                 page.getByText('มูลค่าปัจจุบัน');
      this.fundByLotLiveOverviewBox =             page.getByText('มูลค่าปัจจุบัน');
      this.transactionTable =                     page.getByRole('columnheader', { name: 'วันที่ทำรายการ' });
    
    }
    private get menuItems(): Record<string, Locator> {
    return {
      profileTab:           this.profileTab,
      assetAllocationTab:   this.assetAllocationTab,
      fundByLotTab:         this.fundByLotTab,
      fundByLotLiveTab:     this.fundByLotLiveTab,
      transactionsTab:      this.transactionsTab,
    };
  }

  async verifyVisibleAllTabExcept(hiddenKeys: CustomerDetailTabKey[] = []) {
  // Function verifyVisibleAllTabExcept ใช้เพื่อเช็คว่าในหน้า Customer Detail Page จะเห็นทุกๆ แท็บ ยกเว้นแท็บที่ใส่ไว้ใน arguments
  // หากเว้น arguments ว่างหมายความว่าทุกแท็บต้องแสดงให้เห็น
  // ตัวอย่าง  await customersDetailPage.verifyVisibleAllTabExcept(['profileTab','fundByLotLiveTab'])
    await expect(this.customersDetailHeader).toBeVisible();

    const items = this.menuItems;

    for (const [key, locator] of Object.entries(items)) {
      if (hiddenKeys.includes(key as CustomerDetailTabKey)) {
        await expect(locator, `Expected ${key} to be hidden`).toBeHidden();
      } else {
        await expect(locator, `Expected ${key} to be visible`).toBeVisible();
      }
    }
  }

}
