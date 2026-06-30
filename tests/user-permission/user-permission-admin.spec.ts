// tests/user-permission/user-permission-admin.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/auth/LoginPage';
import { Header } from '../../src/components/Header';
import { Sidebar } from '../../src/components/Sidebar';
import { UserManagementPage } from '../../src/pages/user-management/UserManagementPage';
import { PermissionSettingPage } from '../../src/pages/PermissionSettingPage';
import { CustomersPage } from '../../src/pages/customers/CustomersPage';
import { CustomersDetailPage } from '../../src/pages/customers/CustomersDetailPage';
import { IncomesPage } from '../../src/pages/IncomesPage';
import { InvoicesPage } from '../../src/pages/InvoicesPage';
import { Customers } from '../../test-data/customerData';

test.describe('User Permission Super Admin', () => {
  let loginPage: LoginPage;
  let header: Header;
  let sidebar: Sidebar;
  let userManagementPage: UserManagementPage;
  let permissionSettingPage: PermissionSettingPage;
  let customersPage: CustomersPage;
  let customersDetailPage: CustomersDetailPage;
  let incomesPage: IncomesPage;
  let invoicesPage: InvoicesPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    header = new Header(page);
    sidebar = new Sidebar(page, header);
    userManagementPage = new UserManagementPage(page);
    permissionSettingPage = new PermissionSettingPage(page);
    customersPage = new CustomersPage(page);
    customersDetailPage = new CustomersDetailPage(page);
    incomesPage = new IncomesPage(page);
    invoicesPage = new InvoicesPage(page);

    // Prerequisite: Log in as Super Admin and navigate to the Permission Settings page for the Super Admin user
    await test.step('Prerequisite: Login ด้วย Super Admin และไปที่หน้า Permission Settings ของ Account ตัวเอง', async () => {
      await loginPage.login(process.env.SUPERADMIN_USERNAME!, process.env.SUPERADMIN_PASSWORD!);
      await userManagementPage.navigateTo();
      await userManagementPage.searchBar.fill(process.env.SUPERADMIN_USERNAME!);
      await userManagementPage.othersTab.click();
      await userManagementPage.userTableFirstRowActionButtons.click();
      await userManagementPage.userTableActionOptionsPermission.click();
      await expect(permissionSettingPage.page).toHaveURL(/.*\/permission-settings/);
    });
  });

  test('TC-01 ตรวจสอบว่า Super Admin ที่มีสิทธิ์การมองเห็นทุก Permission จะสามารถเห็นทุก Menu', async ({page}) => {
    await test.step('1. เพิ่มสิทธิ์การมองเห็นทุก Permission', async () => {
      await permissionSettingPage.grantAllExcept([]);
    });
    await test.step('2. Expected: สามารถเห็นทุกเมนูที่แท็บ Sidebar', async () => {
      await sidebar.verifyVisibleAllExcept();
    });
    await test.step('3. ไปที่หน้า Customers', async () => {
      await customersPage.navigateTo();
    });
    await test.step('4. Search หารอน วีสลีย์ และไปที่หน้า Customers Detail ของ Account แรกของ รอน', async () => {
      const expectedId = await customersPage.searchAndNavigate('name', Customers.RonWeasley.name);
      await expect(page).toHaveURL(new RegExp(expectedId));
    });
    await test.step('5. Expected: เห็น Tab ใน Customer Detail ทุกแท็บ', async () => {
      await customersDetailPage.verifyVisibleAllTabExcept([]);
    });
    await test.step('6. ไปที่หน้า Incomes', async () => {
      await incomesPage.navigateTo();
    });
    await test.step('7. Expected: เห็น Income Section ทุก section', async () => {
      await incomesPage.verifyVisibleAllSectionExcept([]);
    });
    await test.step('8. Expected: สามารถ Download Receipt ในหน้า Invoices ได้', async () => {
      await invoicesPage.downloadReceipt();
    });
  });

  test('TC-02 ตรวจสอบว่า Super Admin ที่ไม่มีสิทธิ์การมองเห็น Dashboard จะไม่เห็นเมนูและหน้า Dashboard', async () => {
    await test.step('1. ไม่ให้สิทธิ๋การมองเห็นของ Dashboard', async () => {
      await permissionSettingPage.grantAllExcept(['dashboard']);
    });
    await test.step('2. Expected: ไม่เห็นเมนู Dashboard ที่แท็บ Sidebar', async () => {
      await sidebar.verifyVisibleAllExcept(['dashboard']);
    });
  });  
  
  test('TC-03 ตรวจสอบว่า Super Admin ที่ไม่มีสิทธิ์การมองเห็น Customers จะไม่เห็นเมนูและหน้า Customers', async () => {
    await test.step('1. ไม่ให้สิทธิ๋การมองเห็นของ Customers', async () => {
      await permissionSettingPage.grantAllExcept(['customers']);
    });
    await test.step('2. Expected: ไม่เห็นเมนู Customers ที่แท็บ Sidebar', async () => {
      await sidebar.verifyVisibleAllExcept(['customers']);
    });
  });  

  test('TC-04 ตรวจสอบว่า Super Admin ที่ไม่มีสิทธิ์การมองเห็น Detail ของ Customers จะไม่เห็นข้อมูลทั้งหมดในหน้า Customers', async ({page}) => {
    await test.step('1. ไม่ให้สิทธิ๋การมองเห็นของ Customers Detail', async () => {
      await permissionSettingPage.grantAllExcept(['customers.detail']);
    });
    await test.step('2. ไปที่หน้า Customers', async () => {
      await customersPage.navigateTo();
    });  
    await test.step('3. Search หารอน วีสลีย์ และไปที่หน้า Customers Detail ของ Account แรกของ รอน', async () => {
      const expectedId = await customersPage.searchAndNavigate('name', Customers.RonWeasley.name);
      await expect(page).toHaveURL(new RegExp(expectedId));
    });
    await test.step('4. Expected: สามารถเข้าไปที่หน้า Customer Detail ได้ แต่ไม่เห็นข้อมูลอะไรเลย', async () => {
      await customersDetailPage.verifyVisibleAllTabExcept(['profileTab','assetAllocationTab','fundByLotTab','fundByLotLiveTab','transactionsTab']);
    });
  });

  test('TC-05 ตรวจสอบว่า Super Admin ที่ไม่มีสิทธิ์การมองเห็น Asset Allocation ของ Customers จะไม่เห็นข้อมูลในแท็บ Asset Allocation ในหน้า Customer Detail', async ({page}) => {    
    await test.step('1. ไม่ให้สิทธิ๋การมองเห็นของ Asset Allocation', async () => {
      await permissionSettingPage.grantAllExcept(['customers.detail.assetAllocation']);
    });
    await test.step('2. ไปที่หน้า Customers', async () => {
      await customersPage.navigateTo();
    });  
    await test.step('3. Search หารอน วีสลีย์ และไปที่หน้า Customers Detail ของ Account แรกของ รอน', async () => {
      const expectedId = await customersPage.searchAndNavigate('name', Customers.RonWeasley.name);
      await expect(page).toHaveURL(new RegExp(expectedId));
    });  
    await test.step('4. Expected: Super Admin จะไม่เห็นแท็บและข้อมูลของ Asset Allocation แต่แท็บแมนูอื่นๆ ยังสามารถเห็นได้ตามปกติ', async () => {
      await customersDetailPage.verifyVisibleAllTabExcept(['assetAllocationTab']);
    });
  });
  test('TC-06 ตรวจสอบว่า Super Admin ที่ไม่มีสิทธิ์การมองเห็น Profile ของ Customers จะไม่เห็นข้อมูลในแท็บ Profile ในหน้า Customer Detail', async ({page}) => {    
    await test.step('1. ไม่ให้สิทธิ๋การมองเห็นของ Profile', async () => {
      await permissionSettingPage.grantAllExcept(['customers.detail.profile']);
    });
    await test.step('2. ไปที่หน้า Customers', async () => {
      await customersPage.navigateTo();
    });  
    await test.step('3. Search หารอน วีสลีย์ และไปที่หน้า Customers Detail ของ Account แรกของ รอน', async () => {
      const expectedId = await customersPage.searchAndNavigate('name', Customers.RonWeasley.name);
      await expect(page).toHaveURL(new RegExp(expectedId));
    });  
    await test.step('4. Expected: Super Admin จะไม่เห็นแท็บและข้อมูลของ Profile แต่แท็บแมนูอื่นๆ ยังสามารถเห็นได้ตามปกติ', async () => {
      await customersDetailPage.verifyVisibleAllTabExcept(['profileTab']);
    });
  });
  test('TC-07 ตรวจสอบว่า Super Admin ที่ไม่มีสิทธิ์การมองเห็น Fund By Lot ของ Customers จะไม่เห็นข้อมูลในแท็บ Fund By Lot ในหน้า Customer Detail', async ({page}) => {
    await test.step('1. ไม่ให้สิทธิ๋การมองเห็นของ Profile', async () => {
      await permissionSettingPage.grantAllExcept(['customers.detail.fundByLot']);
    });
    await test.step('2. ไปที่หน้า Customers', async () => {
      await customersPage.navigateTo();
    });
    await test.step('3. Search หารอน วีสลีย์ และไปที่หน้า Customers Detail ของ Account แรกของ รอน', async () => {
      const expectedId = await customersPage.searchAndNavigate('name', Customers.RonWeasley.name);
      await expect(page).toHaveURL(new RegExp(expectedId));
    });
    await test.step('4. Expected: Super Admin จะไม่เห็นแท็บและข้อมูลของ Fund By Lot แต่แท็บแมนูอื่นๆ ยังสามารถเห็นได้ตามปกติ', async () => {
      await customersDetailPage.verifyVisibleAllTabExcept(['fundByLotTab']);
    });
  });

  test('TC-08 ตรวจสอบว่า Super Admin ที่ไม่มีสิทธิ์การมองเห็น Fund By Lot Live ของ Customers จะไม่เห็นข้อมูลในแท็บ Fund By Lot Live ในหน้า Customer Detail', async ({page}) => {
    await test.step('1. ไม่ให้สิทธิ์การมองเห็นของ Fund By Lot Live', async () => {
      await permissionSettingPage.grantAllExcept(['customers.detail.fundByLotLive']);
    });
    await test.step('2. ไปที่หน้า Customers', async () => {
      await customersPage.navigateTo();
    });
    await test.step('3. Search หารอน วีสลีย์ และไปที่หน้า Customers Detail ของ Account แรกของ รอน', async () => {
      const expectedId = await customersPage.searchAndNavigate('name', Customers.RonWeasley.name);
      await expect(page).toHaveURL(new RegExp(expectedId));
    });
    await test.step('4. Expected: Super Admin จะไม่เห็นแท็บและข้อมูลของ Fund By Lot Live แต่แท็บแมนูอื่นๆ ยังสามารถเห็นได้ตามปกติ', async () => {
      await customersDetailPage.verifyVisibleAllTabExcept(['fundByLotLiveTab']);
    });
  });

  test('TC-09 ตรวจสอบว่า Super Admin ที่ไม่มีสิทธิ์การมองเห็น Transactions ของ Customers จะไม่เห็นข้อมูลในแท็บ Transactions ในหน้า Customer Detail', async ({page}) => {
    await test.step('1. ไม่ให้สิทธิ์การมองเห็นของ Transactions', async () => {
      await permissionSettingPage.grantAllExcept(['customers.detail.transactions']);
    });
    await test.step('2. ไปที่หน้า Customers', async () => {
      await customersPage.navigateTo();
    });
    await test.step('3. Search หารอน วีสลีย์ และไปที่หน้า Customers Detail ของ Account แรกของ รอน', async () => {
      const expectedId = await customersPage.searchAndNavigate('name', Customers.RonWeasley.name);
      await expect(page).toHaveURL(new RegExp(expectedId));
    });
    await test.step('4. Expected: Super Admin จะไม่เห็นแท็บและข้อมูลของ Transactions แต่แท็บแมนูอื่นๆ ยังสามารถเห็นได้ตามปกติ', async () => {
      await customersDetailPage.verifyVisibleAllTabExcept(['transactionsTab']);
    });
  });

  test('TC-10 ตรวจสอบว่า Super Admin ที่ไม่มีสิทธิ์ Manage Porfolio ของ Customer จะไม่เห็น Action Button', async ({page}) => {
    await test.step('1. ไม่ให้สิทธิ์การมองเห็นของ Transactions', async () => {
      await permissionSettingPage.grantAllExcept(['customers.manage']);
    });
    await test.step('2. ไปที่หน้า Customers', async () => {
      await customersPage.navigateTo();
    });
    await test.step('3. Search หารอน วีสลีย์ และ Expand ดู Account แรกของ รอน', async () => {
      const expectedId = await customersPage.searchAndExpand('name', Customers.RonWeasley.name);
    });
    await test.step('4. Expected: Super Admin จะไม่เห็น Action Bar และไม่สามารถแก้ไข Portfolio ได้', async () => {
      await expect(customersPage.customersTableFirstRowActionButton).not.toBeVisible();
      await expect(customersPage.customersTableFirstRowExpandedActionButton).not.toBeVisible();
    });
  });

  test('TC-11 ตรวจสอบว่า Super Admin ที่ไม่มีสิทธิ์การมองเห็น Funds จะไม่เห็นเมนูและหน้า Funds', async () => {
    await test.step('1. ไม่ให้สิทธิ์การมองเห็นของ Funds', async () => {
      await permissionSettingPage.grantAllExcept(['funds']);
    });
    await test.step('2. Expected: ไม่เห็นเมนู Funds ที่แท็บ Sidebar', async () => {
      await sidebar.verifyVisibleAllExcept(['funds']);
    });
  });

  test('TC-12 ตรวจสอบว่า Super Admin ที่ไม่มีสิทธิ์การมองเห็น Transactions จะไม่เห็นเมนูและหน้า Transactions', async () => {
    await test.step('1. ไม่ให้สิทธิ์การมองเห็นของ Transactions', async () => {
      await permissionSettingPage.grantAllExcept(['transactions']);
    });
    await test.step('2. Expected: ไม่เห็นเมนู Transactions ที่แท็บ Sidebar', async () => {
      await sidebar.verifyVisibleAllExcept(['transactions']);
    });
  });

  test('TC-13 ตรวจสอบว่า Super Admin ที่ไม่มีสิทธิ์การมองเห็น Incomes จะไม่เห็นเมนูและหน้า Incomes', async () => {
    await test.step('1. ไม่ให้สิทธิ์การมองเห็นของ Incomes', async () => {
      await permissionSettingPage.grantAllExcept(['incomes']);
    });
    await test.step('2. Expected: ไม่เห็นเมนู Incomes ที่แท็บ Sidebar', async () => {
      await sidebar.verifyVisibleAllExcept(['income']);
    });
  });

    test('TC-14 ตรวจสอบว่า Super Admin ที่ไม่มีสิทธิ์การมองเห็น Income Chart จะไม่เห็น Chart ในหน้า Incomes', async () => {
    await test.step('1. ไม่ให้สิทธิ์การมองเห็นของ Income Chart', async () => {
      await permissionSettingPage.grantAllExcept(['incomes.chart']);
    });
    await test.step('2. ไปที่หน้า Incomes', async () => {
      await incomesPage.navigateTo();
    });
    await test.step('3. Expected: ไม่เห็น Income Chart แต่ยังเห็น Total Income และ Customer Fee Table', async () => {
      await incomesPage.verifyVisibleAllSectionExcept(['incomeChart']);
    });
  });

  test('TC-15 ตรวจสอบว่า Super Admin ที่ไม่มีสิทธิ์การมองเห็น Income Customer Fee จะไม่เห็น Customer Fee Table ในหน้า Incomes', async () => {
    await test.step('1. ไม่ให้สิทธิ์การมองเห็นของ Income Customer Fee', async () => {
      await permissionSettingPage.grantAllExcept(['incomes.customer']);
    });
    await test.step('2. ไปที่หน้า Incomes', async () => {
      await incomesPage.navigateTo();
    });
    await test.step('3. Expected: ไม่เห็น Customer Fee Table แต่ยังเห็น Total Income และ Income Chart', async () => {
      await incomesPage.verifyVisibleAllSectionExcept(['incomeCustomerFeeTable']);
    });
  });

  test('TC-16 ตรวจสอบว่า Super Admin ที่ไม่มีสิทธิ์การมองเห็น Total Income จะไม่เห็น Total Income Overview ในหน้า Incomes', async () => {
    await test.step('1. ไม่ให้สิทธิ์การมองเห็นของ Total Income', async () => {
      await permissionSettingPage.grantAllExcept(['incomes.totalIncome']);
    });
    await test.step('2. ไปที่หน้า Incomes', async () => {
      await incomesPage.navigateTo();
    });
    await test.step('3. Expected: ไม่เห็น Total Income Overview แต่ยังเห็น Income Chart และ Customer Fee Table', async () => {
      await incomesPage.verifyVisibleAllSectionExcept(['incomeTotalOverview']);
    });
  });
  test('TC-17 ตรวจสอบว่า Super Admin ที่ไม่มีสิทธิ์การมองเห็น Calendar จะไม่เห็นเมนูและหน้า Calendar', async () => {
    await test.step('1. ไม่ให้สิทธิ์การมองเห็นของ Calendar', async () => {
      await permissionSettingPage.grantAllExcept(['calendar']);
    });
    await test.step('2. Expected: ไม่เห็นเมนู Calendar ที่แท็บ Sidebar', async () => {
      await sidebar.verifyVisibleAllExcept(['calendar']);
    });
  });

  test('TC-18 ตรวจสอบว่า Super Admin ที่ไม่มีสิทธิ์การมองเห็น Invoices จะไม่เห็นเมนูและหน้า Invoices', async () => {
    await test.step('1. ไม่ให้สิทธิ์การมองเห็นของ Invoices', async () => {
      await permissionSettingPage.grantAllExcept(['invoices']);
    });
    await test.step('2. Expected: ไม่เห็นเมนู Invoices ที่แท็บ Sidebar', async () => {
      await sidebar.verifyVisibleAllExcept(['invoices']);
    });
  });

  test('TC-19 ตรวจสอบว่า Super Admin ที่ไม่มีสิทธิ์การ download Receipt Invoices จะไม่สามารถ download file ได้', async () => {
    await test.step('1. ไม่ให้สิทธิ์การ Download Receipt', async () => {
      await permissionSettingPage.grantAllExcept(['invoices.file.receipt']);
    });
    await test.step('2. ไปที่หน้า Invoices', async () => {
      await invoicesPage.navigateTo();
    });
    await test.step('3. คลิกเพื่อเปิด Receipt Options', async () => {
      await invoicesPage.invoicesReceiptOptions.click();
    });
    await test.step('4. Expected: ไม่เห็น Download Receipt Button', async () => {
      await expect(invoicesPage.invoicesReceiptDownloadButton).not.toBeVisible();
    });
  });

  test('TC-20 ตรวจสอบว่า Super Admin ที่ไม่มีสิทธิ์การมองเห็น Portfolio Models จะไม่เห็นเมนูและหน้า Portfolio Models', async () => {
    await test.step('1. ไม่ให้สิทธิ์การมองเห็นของ Portfolio Models', async () => {
      await permissionSettingPage.grantAllExcept(['portfolioModels']);
    });
    await test.step('2. Expected: ไม่เห็นเมนู Calendar ที่แท็บ Sidebar', async () => {
      await sidebar.verifyVisibleAllExcept(['portfolioModels']);
    });
  });

});