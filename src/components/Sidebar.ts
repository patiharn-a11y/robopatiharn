// src/components/Sidebar.ts
import { Page, Locator, expect } from '@playwright/test';
import { Header } from './Header';

export class Sidebar {
  readonly page: Page;
  readonly header                  : Header;

  readonly container               : Locator;
  readonly closeButton             : Locator;
  readonly mainSection             : Locator;
  readonly dashboardButton         : Locator;
  readonly customersButton         : Locator;
  readonly fundsButton             : Locator;
  readonly transactionsButton      : Locator;
  readonly incomeButton            : Locator;
  readonly calendarButton          : Locator;
  readonly portfolioModels         : Locator;

  readonly operationsSection       : Locator;
  readonly feeManagementButton     : Locator;
  readonly amcFeeManagementButton  : Locator;
  readonly userManagementButton    : Locator;
  readonly announcementButton      : Locator;
  readonly iicAssociationButton    : Locator;
  readonly maintenanceButton       : Locator;
  readonly adminAuditLogsButton    : Locator;
  readonly unitholderBalanceButton : Locator;

  readonly documentSection         : Locator;
  readonly invoicesButton          : Locator;

  constructor(page: Page, header: Header) {
    this.page = page;
    this.header = header;

    this.container               = page.getByTestId("sheet-menu-container");
    this.closeButton             = page.getByRole("button", { name: "Close" });
    this.mainSection             = page.getByRole("list").getByText("Main", { exact: true });
    this.dashboardButton         = page.getByTestId("sidebar-menu-item-dashboard");
    this.customersButton         = page.getByTestId("sidebar-menu-item-customers");
    this.fundsButton             = page.getByTestId("sidebar-menu-item-funds");
    this.transactionsButton      = page.getByTestId("sidebar-menu-item-transactions");
    this.incomeButton            = page.getByTestId("sidebar-menu-item-incomes");
    this.calendarButton          = page.getByTestId("sidebar-menu-item-calendar");
    this.portfolioModels         = page.getByTestId("sidebar-menu-item-portfolio-models");

    this.operationsSection       = page.getByRole("list").getByText("Operations");
    this.feeManagementButton     = page.getByTestId("sidebar-menu-item-fee-management");
    this.amcFeeManagementButton  = page.getByTestId("sidebar-menu-item-amc-fee-management");
    this.userManagementButton    = page.getByTestId("sidebar-menu-item-users");
    this.announcementButton      = page.getByTestId("sidebar-menu-item-system-announcement",);
    this.iicAssociationButton    = page.getByTestId("sidebar-menu-item-iic-association");
    this.maintenanceButton       = page.getByTestId("sidebar-menu-item-maintenance-management");
    this.adminAuditLogsButton    = page.getByTestId("sidebar-menu-item-admin-audit-logs");
    this.unitholderBalanceButton = page.getByTestId("sidebar-menu-item-unitholder-balance");

    this.documentSection         = page.getByRole("list").getByText("Documents");
    this.invoicesButton          = page.getByTestId("sidebar-menu-item-invoices");
  }
  private get menuItemKeys() {
    return [
      "dashboard",
      "customers",
      "funds",
      "transactions",
      "income",
      "calendar",
      "portfolioModels",

      "feeManagement",
      "amcFeeManagement",
      "userManagement",
      "announcement",
      "iicAssociation",
      "maintenance",
      "adminAuditLogs",
      "unitholderBalance",
      
      "invoices",
    ] as const;
  }

  private get menuItems(): Record<string, Locator> {
    return {
      dashboard         : this.dashboardButton,
      customers         : this.customersButton,
      funds             : this.fundsButton,
      transactions      : this.transactionsButton,
      income            : this.incomeButton,
      calendar          : this.calendarButton,
      portfolioModels   : this.portfolioModels,

      feeManagement     : this.feeManagementButton,
      amcFeeManagement  : this.amcFeeManagementButton,
      userManagement    : this.userManagementButton,
      announcement      : this.announcementButton,
      iicAssociation    : this.iicAssociationButton,
      maintenance       : this.maintenanceButton,
      adminAuditLogs    : this.adminAuditLogsButton,
      unitholderBalance : this.unitholderBalanceButton,

      invoices          : this.invoicesButton,
    };
  }

  async sidebarOpen() {
    // Helper Function ไว้ make sure ว่า Sidebar จะเห็นได้ เพราะบน Responsive view Sidebar จะถูกซ่อน เลยต้องกด Hamburger Button ก่อน
    await this.page.waitForLoadState("domcontentloaded");
    const isMobile = await this.header.hamburgerButton.isVisible();
    if (isMobile) {
      await this.header.hamburgerButton.click();
      await this.container.waitFor({ state: "visible" });
    }
  }

  async verifyVisibleAllExcept(hiddenKeys: string[] = []) {
    // Function verifyVisibleAllExcept ใช้เพื่อเช็คว่าในแท็บ Sidebar จะเห็นทุกๆ Menu ยกเว้นเมนูที่ใส่ไว้ใน arguments
    // หากเว้น arguments ว่างหมายความว่าทุกเมนูต้องแสดงให้เห็น
    // ตัวอย่าง await sidebar.verifyVisibleAllExcept(['dashboard'])
    const validKeys = this.menuItemKeys;
    const invalidKeys = hiddenKeys.filter(
      (k) => !(validKeys as readonly string[]).includes(k),
    );
    if (invalidKeys.length > 0) {
      throw new Error(
        `Invalid sidebar menu key(s): ${invalidKeys.join(", ")}\nAvailable keys: ${validKeys.join(", ")}`,
      );
    }

    await this.sidebarOpen();

    const items = this.menuItems;

    for (const [key, locator] of Object.entries(items)) {
      if (hiddenKeys.includes(key)) {
        await expect(locator, `Expected ${key} to be hidden`).toBeHidden();
      } else {
        await expect(locator, `Expected ${key} to be visible`).toBeVisible();
      }
    }
  }

  async verifyVisibleAllExceptForNonAdmin(hiddenKeys: string[] = []) {
    // Function verifyVisibleAllExceptForNonAdmin ใช้สำหรับ Role ที่ไม่ใช่ Admin/Super Admin
    // Operations section (feeManagement, amcFeeManagement, userManagement, announcement, iicAssociation, maintenance, adminAuditLogs, unitholderBalance)
    // จะถูกซ่อนเสมอโดย Role ไม่ใช่ Permission
    // ตัวอย่าง await sidebar.verifyVisibleAllExceptForNonAdmin(['dashboard'])
    const opsItems = [
      "feeManagement",
      "amcFeeManagement",
      "userManagement",
      "announcement",
      "iicAssociation",
      "maintenance",
      "adminAuditLogs",
      "unitholderBalance",
    ];
    await this.verifyVisibleAllExcept([...opsItems, ...hiddenKeys]);
  }
}
