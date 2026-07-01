// tests/user-permission/user-permission-other.spec.ts
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

test.describe('User Permission Other Role', () => {
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

    await test.step('Prerequisite: Login ด้วย Super Admin และไปที่หน้า Permission Settings ของ IIC Account', async () => {
      await loginPage.login(process.env.SUPERADMIN_USERNAME!, process.env.SUPERADMIN_PASSWORD!);
      await userManagementPage.navigateTo();
      await userManagementPage.searchBar.fill(process.env.IIC_USERNAME!);
      await userManagementPage.iicUsersTab.click();
      await userManagementPage.userTableFirstRowActionButtons.click();
      await userManagementPage.userTableActionOptionsPermission.click();
      await expect(permissionSettingPage.page).toHaveURL(/.*\/permission-settings/);
    });
  });

  test('TC-01 ตรวจสอบว่า Other Role ที่มีสิทธิ์การมองเห็นทุก Permission จะสามารถเห็นทุก Menu (ยกเว้น Operations Section)', async ({ page }) => {
    await test.step('1. เพิ่มสิทธิ์การมองเห็นทุก Permission', async () => {
      await permissionSettingPage.grantAllExcept([]);
    });
    await test.step('2. Logout Super Admin และ Login เป็น IIC', async () => {
      await header.logout(process.env.SUPERADMIN_USERNAME!);
      await loginPage.login(process.env.IIC_USERNAME!, process.env.IIC_PASSWORD!);
    });
    await test.step('3. Expected: สามารถเห็นทุกเมนูที่แท็บ Sidebar ยกเว้น Operations Section', async () => {
      await sidebar.verifyVisibleAllExceptForNonAdmin();
    });
    await test.step('4. ไปที่หน้า Customers', async () => {
      await customersPage.navigateTo();
    });
    await test.step('5. Search หารอน วีสลีย์ และไปที่หน้า Customers Detail ของ Account แรกของ รอน', async () => {
      const expectedId = await customersPage.searchAndNavigate('name', Customers.RonWeasley.name);
      await expect(page).toHaveURL(new RegExp(expectedId));
    });
    await test.step('6. Expected: เห็น Tab ใน Customer Detail ทุกแท็บ', async () => {
      await customersDetailPage.verifyVisibleAllTabExcept([]);
    });
    await test.step('7. ไปที่หน้า Incomes', async () => {
      await incomesPage.navigateTo();
    });
    await test.step('8. Expected: เห็น Income Section ทุก section', async () => {
      await incomesPage.verifyVisibleAllSectionExcept([]);
    });
    await test.step('9. Expected: สามารถ Download Receipt ในหน้า Invoices ได้', async () => {
      await invoicesPage.downloadReceipt();
    });
  });

  test('TC-02 ตรวจสอบว่า Other Role ที่ไม่มีสิทธิ์การมองเห็น Dashboard จะไม่เห็นเมนูและหน้า Dashboard', async () => {
    await test.step('1. ไม่ให้สิทธิ์การมองเห็นของ Dashboard', async () => {
      await permissionSettingPage.grantAllExcept(['dashboard']);
    });
    await test.step('2. Logout Super Admin และ Login เป็น IIC', async () => {
      await header.logout(process.env.SUPERADMIN_USERNAME!);
      await loginPage.login(process.env.IIC_USERNAME!, process.env.IIC_PASSWORD!);
    });
    await test.step('3. Expected: ไม่เห็นเมนู Dashboard ที่แท็บ Sidebar', async () => {
      await sidebar.verifyVisibleAllExceptForNonAdmin(['dashboard']);
    });
  });

  test('TC-03 ตรวจสอบว่า Other Role ที่ไม่มีสิทธิ์การมองเห็น Customers จะไม่เห็นเมนูและหน้า Customers', async () => {
    await test.step('1. ไม่ให้สิทธิ์การมองเห็นของ Customers', async () => {
      await permissionSettingPage.grantAllExcept(['customers']);
    });
    await test.step('2. Logout Super Admin และ Login เป็น IIC', async () => {
      await header.logout(process.env.SUPERADMIN_USERNAME!);
      await loginPage.login(process.env.IIC_USERNAME!, process.env.IIC_PASSWORD!);
    });
    await test.step('3. Expected: ไม่เห็นเมนู Customers ที่แท็บ Sidebar', async () => {
      await sidebar.verifyVisibleAllExceptForNonAdmin(['customers']);
    });
  });

  test('TC-04 ตรวจสอบว่า Other Role ที่ไม่มีสิทธิ์การมองเห็น Detail ของ Customers จะไม่เห็นข้อมูลทั้งหมดในหน้า Customers', async ({ page }) => {
    await test.step('1. ไม่ให้สิทธิ์การมองเห็นของ Customers Detail', async () => {
      await permissionSettingPage.grantAllExcept(['customers.detail']);
    });
    await test.step('2. Logout Super Admin และ Login เป็น IIC', async () => {
      await header.logout(process.env.SUPERADMIN_USERNAME!);
      await loginPage.login(process.env.IIC_USERNAME!, process.env.IIC_PASSWORD!);
    });
    await test.step('3. ไปที่หน้า Customers', async () => {
      await customersPage.navigateTo();
    });
    await test.step('4. Search หารอน วีสลีย์ และไปที่หน้า Customers Detail ของ Account แรกของ รอน', async () => {
      const expectedId = await customersPage.searchAndNavigate('name', Customers.RonWeasley.name);
      await expect(page).toHaveURL(new RegExp(expectedId));
    });
    await test.step('5. Expected: สามารถเข้าไปที่หน้า Customer Detail ได้ แต่ไม่เห็นข้อมูลอะไรเลย', async () => {
      await customersDetailPage.verifyVisibleAllTabExcept(['profileTab', 'assetAllocationTab', 'fundByLotTab', 'fundByLotLiveTab', 'transactionsTab']);
    });
  });

  test('TC-05 ตรวจสอบว่า Other Role ที่ไม่มีสิทธิ์การมองเห็น Asset Allocation ของ Customers จะไม่เห็นข้อมูลในแท็บ Asset Allocation ในหน้า Customer Detail', async ({ page }) => {
    await test.step('1. ไม่ให้สิทธิ์การมองเห็นของ Asset Allocation', async () => {
      await permissionSettingPage.grantAllExcept(['customers.detail.assetAllocation']);
    });
    await test.step('2. Logout Super Admin และ Login เป็น IIC', async () => {
      await header.logout(process.env.SUPERADMIN_USERNAME!);
      await loginPage.login(process.env.IIC_USERNAME!, process.env.IIC_PASSWORD!);
    });
    await test.step('3. ไปที่หน้า Customers', async () => {
      await customersPage.navigateTo();
    });
    await test.step('4. Search หารอน วีสลีย์ และไปที่หน้า Customers Detail ของ Account แรกของ รอน', async () => {
      const expectedId = await customersPage.searchAndNavigate('name', Customers.RonWeasley.name);
      await expect(page).toHaveURL(new RegExp(expectedId));
    });
    await test.step('5. Expected: Other Role จะไม่เห็นแท็บและข้อมูลของ Asset Allocation แต่แท็บแมนูอื่นๆ ยังสามารถเห็นได้ตามปกติ', async () => {
      await customersDetailPage.verifyVisibleAllTabExcept(['assetAllocationTab']);
    });
  });

  test('TC-06 ตรวจสอบว่า Other Role ที่ไม่มีสิทธิ์การมองเห็น Profile ของ Customers จะไม่เห็นข้อมูลในแท็บ Profile ในหน้า Customer Detail', async ({ page }) => {
    await test.step('1. ไม่ให้สิทธิ์การมองเห็นของ Profile', async () => {
      await permissionSettingPage.grantAllExcept(['customers.detail.profile']);
    });
    await test.step('2. Logout Super Admin และ Login เป็น IIC', async () => {
      await header.logout(process.env.SUPERADMIN_USERNAME!);
      await loginPage.login(process.env.IIC_USERNAME!, process.env.IIC_PASSWORD!);
    });
    await test.step('3. ไปที่หน้า Customers', async () => {
      await customersPage.navigateTo();
    });
    await test.step('4. Search หารอน วีสลีย์ และไปที่หน้า Customers Detail ของ Account แรกของ รอน', async () => {
      const expectedId = await customersPage.searchAndNavigate('name', Customers.RonWeasley.name);
      await expect(page).toHaveURL(new RegExp(expectedId));
    });
    await test.step('5. Expected: Other Role จะไม่เห็นแท็บและข้อมูลของ Profile แต่แท็บแมนูอื่นๆ ยังสามารถเห็นได้ตามปกติ', async () => {
      await customersDetailPage.verifyVisibleAllTabExcept(['profileTab']);
    });
  });

  test('TC-07 ตรวจสอบว่า Other Role ที่ไม่มีสิทธิ์การมองเห็น Fund By Lot ของ Customers จะไม่เห็นข้อมูลในแท็บ Fund By Lot ในหน้า Customer Detail', async ({ page }) => {
    await test.step('1. ไม่ให้สิทธิ์การมองเห็นของ Fund By Lot', async () => {
      await permissionSettingPage.grantAllExcept(['customers.detail.fundByLot']);
    });
    await test.step('2. Logout Super Admin และ Login เป็น IIC', async () => {
      await header.logout(process.env.SUPERADMIN_USERNAME!);
      await loginPage.login(process.env.IIC_USERNAME!, process.env.IIC_PASSWORD!);
    });
    await test.step('3. ไปที่หน้า Customers', async () => {
      await customersPage.navigateTo();
    });
    await test.step('4. Search หารอน วีสลีย์ และไปที่หน้า Customers Detail ของ Account แรกของ รอน', async () => {
      const expectedId = await customersPage.searchAndNavigate('name', Customers.RonWeasley.name);
      await expect(page).toHaveURL(new RegExp(expectedId));
    });
    await test.step('5. Expected: Other Role จะไม่เห็นแท็บและข้อมูลของ Fund By Lot แต่แท็บแมนูอื่นๆ ยังสามารถเห็นได้ตามปกติ', async () => {
      await customersDetailPage.verifyVisibleAllTabExcept(['fundByLotTab']);
    });
  });

  test('TC-08 ตรวจสอบว่า Other Role ที่ไม่มีสิทธิ์การมองเห็น Fund By Lot Live ของ Customers จะไม่เห็นข้อมูลในแท็บ Fund By Lot Live ในหน้า Customer Detail', async ({ page }) => {
    await test.step('1. ไม่ให้สิทธิ์การมองเห็นของ Fund By Lot Live', async () => {
      await permissionSettingPage.grantAllExcept(['customers.detail.fundByLotLive']);
    });
    await test.step('2. Logout Super Admin และ Login เป็น IIC', async () => {
      await header.logout(process.env.SUPERADMIN_USERNAME!);
      await loginPage.login(process.env.IIC_USERNAME!, process.env.IIC_PASSWORD!);
    });
    await test.step('3. ไปที่หน้า Customers', async () => {
      await customersPage.navigateTo();
    });
    await test.step('4. Search หารอน วีสลีย์ และไปที่หน้า Customers Detail ของ Account แรกของ รอน', async () => {
      const expectedId = await customersPage.searchAndNavigate('name', Customers.RonWeasley.name);
      await expect(page).toHaveURL(new RegExp(expectedId));
    });
    await test.step('5. Expected: Other Role จะไม่เห็นแท็บและข้อมูลของ Fund By Lot Live แต่แท็บแมนูอื่นๆ ยังสามารถเห็นได้ตามปกติ', async () => {
      await customersDetailPage.verifyVisibleAllTabExcept(['fundByLotLiveTab']);
    });
  });

  test('TC-09 ตรวจสอบว่า Other Role ที่ไม่มีสิทธิ์การมองเห็น Transactions ของ Customers จะไม่เห็นข้อมูลในแท็บ Transactions ในหน้า Customer Detail', async ({ page }) => {
    await test.step('1. ไม่ให้สิทธิ์การมองเห็นของ Transactions', async () => {
      await permissionSettingPage.grantAllExcept(['customers.detail.transactions']);
    });
    await test.step('2. Logout Super Admin และ Login เป็น IIC', async () => {
      await header.logout(process.env.SUPERADMIN_USERNAME!);
      await loginPage.login(process.env.IIC_USERNAME!, process.env.IIC_PASSWORD!);
    });
    await test.step('3. ไปที่หน้า Customers', async () => {
      await customersPage.navigateTo();
    });
    await test.step('4. Search หารอน วีสลีย์ และไปที่หน้า Customers Detail ของ Account แรกของ รอน', async () => {
      const expectedId = await customersPage.searchAndNavigate('name', Customers.RonWeasley.name);
      await expect(page).toHaveURL(new RegExp(expectedId));
    });
    await test.step('5. Expected: Other Role จะไม่เห็นแท็บและข้อมูลของ Transactions แต่แท็บแมนูอื่นๆ ยังสามารถเห็นได้ตามปกติ', async () => {
      await customersDetailPage.verifyVisibleAllTabExcept(['transactionsTab']);
    });
  });

  test('TC-10 ตรวจสอบว่า Other Role ที่ไม่มีสิทธิ์ Manage Portfolio ของ Customer จะไม่เห็น Action Button', async ({ page }) => {
    await test.step('1. ไม่ให้สิทธิ์ Manage Portfolio', async () => {
      await permissionSettingPage.grantAllExcept(['customers.manage']);
    });
    await test.step('2. Logout Super Admin และ Login เป็น IIC', async () => {
      await header.logout(process.env.SUPERADMIN_USERNAME!);
      await loginPage.login(process.env.IIC_USERNAME!, process.env.IIC_PASSWORD!);
    });
    await test.step('3. ไปที่หน้า Customers', async () => {
      await customersPage.navigateTo();
    });
    await test.step('4. Search หารอน วีสลีย์ และ Expand ดู Account แรกของ รอน (ถ้ามีหลาย Account)', async () => {
      await customersPage.searchAndExpand('name', Customers.RonWeasley.name);
    });
    await test.step('5. Expected: Other Role จะไม่เห็น Action Bar และไม่สามารถแก้ไข Portfolio ได้', async () => {
      await customersPage.expectActionButtonNotVisible();
    });
  });

  test('TC-11 ตรวจสอบว่า Other Role ที่ไม่มีสิทธิ์การมองเห็น Funds จะไม่เห็นเมนูและหน้า Funds', async () => {
    await test.step('1. ไม่ให้สิทธิ์การมองเห็นของ Funds', async () => {
      await permissionSettingPage.grantAllExcept(['funds']);
    });
    await test.step('2. Logout Super Admin และ Login เป็น IIC', async () => {
      await header.logout(process.env.SUPERADMIN_USERNAME!);
      await loginPage.login(process.env.IIC_USERNAME!, process.env.IIC_PASSWORD!);
    });
    await test.step('3. Expected: ไม่เห็นเมนู Funds ที่แท็บ Sidebar', async () => {
      await sidebar.verifyVisibleAllExceptForNonAdmin(['funds']);
    });
  });

  test('TC-12 ตรวจสอบว่า Other Role ที่ไม่มีสิทธิ์การมองเห็น Transactions จะไม่เห็นเมนูและหน้า Transactions', async () => {
    await test.step('1. ไม่ให้สิทธิ์การมองเห็นของ Transactions', async () => {
      await permissionSettingPage.grantAllExcept(['transactions']);
    });
    await test.step('2. Logout Super Admin และ Login เป็น IIC', async () => {
      await header.logout(process.env.SUPERADMIN_USERNAME!);
      await loginPage.login(process.env.IIC_USERNAME!, process.env.IIC_PASSWORD!);
    });
    await test.step('3. Expected: ไม่เห็นเมนู Transactions ที่แท็บ Sidebar', async () => {
      await sidebar.verifyVisibleAllExceptForNonAdmin(['transactions']);
    });
  });

  test('TC-13 ตรวจสอบว่า Other Role ที่ไม่มีสิทธิ์การมองเห็น Incomes จะไม่เห็นเมนูและหน้า Incomes', async () => {
    await test.step('1. ไม่ให้สิทธิ์การมองเห็นของ Incomes', async () => {
      await permissionSettingPage.grantAllExcept(['incomes']);
    });
    await test.step('2. Logout Super Admin และ Login เป็น IIC', async () => {
      await header.logout(process.env.SUPERADMIN_USERNAME!);
      await loginPage.login(process.env.IIC_USERNAME!, process.env.IIC_PASSWORD!);
    });
    await test.step('3. Expected: ไม่เห็นเมนู Incomes ที่แท็บ Sidebar', async () => {
      await sidebar.verifyVisibleAllExceptForNonAdmin(['income']);
    });
  });

  test('TC-14 ตรวจสอบว่า Other Role ที่ไม่มีสิทธิ์การมองเห็น Income Chart จะไม่เห็น Chart ในหน้า Incomes', async () => {
    await test.step('1. ไม่ให้สิทธิ์การมองเห็นของ Income Chart', async () => {
      await permissionSettingPage.grantAllExcept(['incomes.chart']);
    });
    await test.step('2. Logout Super Admin และ Login เป็น IIC', async () => {
      await header.logout(process.env.SUPERADMIN_USERNAME!);
      await loginPage.login(process.env.IIC_USERNAME!, process.env.IIC_PASSWORD!);
    });
    await test.step('3. ไปที่หน้า Incomes', async () => {
      await incomesPage.navigateTo();
    });
    await test.step('4. Expected: ไม่เห็น Income Chart แต่ยังเห็น Total Income และ Customer Fee Table', async () => {
      await incomesPage.verifyVisibleAllSectionExcept(['incomeChart']);
    });
  });

  test('TC-15 ตรวจสอบว่า Other Role ที่ไม่มีสิทธิ์การมองเห็น Income Customer Fee จะไม่เห็น Customer Fee Table ในหน้า Incomes', async () => {
    await test.step('1. ไม่ให้สิทธิ์การมองเห็นของ Income Customer Fee', async () => {
      await permissionSettingPage.grantAllExcept(['incomes.customer']);
    });
    await test.step('2. Logout Super Admin และ Login เป็น IIC', async () => {
      await header.logout(process.env.SUPERADMIN_USERNAME!);
      await loginPage.login(process.env.IIC_USERNAME!, process.env.IIC_PASSWORD!);
    });
    await test.step('3. ไปที่หน้า Incomes', async () => {
      await incomesPage.navigateTo();
    });
    await test.step('4. Expected: ไม่เห็น Customer Fee Table แต่ยังเห็น Total Income และ Income Chart', async () => {
      await incomesPage.verifyVisibleAllSectionExcept(['incomeCustomerFeeTable']);
    });
  });

  test('TC-16 ตรวจสอบว่า Other Role ที่ไม่มีสิทธิ์การมองเห็น Total Income จะไม่เห็น Total Income Overview ในหน้า Incomes', async () => {
    await test.step('1. ไม่ให้สิทธิ์การมองเห็นของ Total Income', async () => {
      await permissionSettingPage.grantAllExcept(['incomes.totalIncome']);
    });
    await test.step('2. Logout Super Admin และ Login เป็น IIC', async () => {
      await header.logout(process.env.SUPERADMIN_USERNAME!);
      await loginPage.login(process.env.IIC_USERNAME!, process.env.IIC_PASSWORD!);
    });
    await test.step('3. ไปที่หน้า Incomes', async () => {
      await incomesPage.navigateTo();
    });
    await test.step('4. Expected: ไม่เห็น Total Income Overview แต่ยังเห็น Income Chart และ Customer Fee Table', async () => {
      await incomesPage.verifyVisibleAllSectionExcept(['incomeTotalOverview']);
    });
  });

  test('TC-17 ตรวจสอบว่า Other Role ที่ไม่มีสิทธิ์การมองเห็น Calendar จะไม่เห็นเมนูและหน้า Calendar', async () => {
    await test.step('1. ไม่ให้สิทธิ์การมองเห็นของ Calendar', async () => {
      await permissionSettingPage.grantAllExcept(['calendar']);
    });
    await test.step('2. Logout Super Admin และ Login เป็น IIC', async () => {
      await header.logout(process.env.SUPERADMIN_USERNAME!);
      await loginPage.login(process.env.IIC_USERNAME!, process.env.IIC_PASSWORD!);
    });
    await test.step('3. Expected: ไม่เห็นเมนู Calendar ที่แท็บ Sidebar', async () => {
      await sidebar.verifyVisibleAllExceptForNonAdmin(['calendar']);
    });
  });

  test('TC-18 ตรวจสอบว่า Other Role ที่ไม่มีสิทธิ์การมองเห็น Invoices จะไม่เห็นเมนูและหน้า Invoices', async () => {
    await test.step('1. ไม่ให้สิทธิ์การมองเห็นของ Invoices', async () => {
      await permissionSettingPage.grantAllExcept(['invoices']);
    });
    await test.step('2. Logout Super Admin และ Login เป็น IIC', async () => {
      await header.logout(process.env.SUPERADMIN_USERNAME!);
      await loginPage.login(process.env.IIC_USERNAME!, process.env.IIC_PASSWORD!);
    });
    await test.step('3. Expected: ไม่เห็นเมนู Invoices ที่แท็บ Sidebar', async () => {
      await sidebar.verifyVisibleAllExceptForNonAdmin(['invoices']);
    });
  });

  test('TC-19 ตรวจสอบว่า Other Role ที่ไม่มีสิทธิ์การ download Receipt Invoices จะไม่สามารถ download file ได้', async () => {
    await test.step('1. ไม่ให้สิทธิ์การ Download Receipt', async () => {
      await permissionSettingPage.grantAllExcept(['invoices.file.receipt']);
    });
    await test.step('2. Logout Super Admin และ Login เป็น IIC', async () => {
      await header.logout(process.env.SUPERADMIN_USERNAME!);
      await loginPage.login(process.env.IIC_USERNAME!, process.env.IIC_PASSWORD!);
    });
    await test.step('3. ไปที่หน้า Invoices', async () => {
      await invoicesPage.navigateTo();
    });
    await test.step('4. คลิกเพื่อเปิด Receipt Options', async () => {
      await invoicesPage.invoicesReceiptOptions.click();
    });
    await test.step('5. Expected: ไม่เห็น Download Receipt Button', async () => {
      await expect(invoicesPage.invoicesReceiptDownloadButton).not.toBeVisible();
    });
  });

  test('TC-20 ตรวจสอบว่า Other Role ที่ไม่มีสิทธิ์การมองเห็น Portfolio Models จะไม่เห็นเมนูและหน้า Portfolio Models', async () => {
    await test.step('1. ไม่ให้สิทธิ์การมองเห็นของ Portfolio Models', async () => {
      await permissionSettingPage.grantAllExcept(['portfolioModels']);
    });
    await test.step('2. Logout Super Admin และ Login เป็น IIC', async () => {
      await header.logout(process.env.SUPERADMIN_USERNAME!);
      await loginPage.login(process.env.IIC_USERNAME!, process.env.IIC_PASSWORD!);
    });
    await test.step('3. Expected: ไม่เห็นเมนู Portfolio Models ที่แท็บ Sidebar', async () => {
      await sidebar.verifyVisibleAllExceptForNonAdmin(['portfolioModels']);
    });
  });
});

test.describe('User Permission Other Role Presets', () => {
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

    await test.step('Prerequisite: Login ด้วย Super Admin และไปที่หน้า Permission Settings ของ IIC Account', async () => {
      await loginPage.login(process.env.SUPERADMIN_USERNAME!, process.env.SUPERADMIN_PASSWORD!);
      await userManagementPage.navigateTo();
      await userManagementPage.searchBar.fill(process.env.IIC_USERNAME!);
      await userManagementPage.iicUsersTab.click();
      await userManagementPage.userTableFirstRowActionButtons.click();
      await userManagementPage.userTableActionOptionsPermission.click();
      await expect(permissionSettingPage.page).toHaveURL(/.*\/permission-settings/);
    });
  });

  test('TC-01 ตรวจสอบว่า Preset Super Admin แสดง Sidebar, Customer Detail และ Incomes ถูกต้อง สำหรับ Other Role', async ({ page }) => {
    await test.step('1. กด Preset Super Admin และ Save', async () => {
      await permissionSettingPage.applyPreset('superAdmin');
    });
    await test.step('2. Logout Super Admin และ Login เป็น IIC', async () => {
      await header.logout(process.env.SUPERADMIN_USERNAME!);
      await loginPage.login(process.env.IIC_USERNAME!, process.env.IIC_PASSWORD!);
    });
    await test.step('3. Expected: เห็น Sidebar Menu ตาม Preset Super Admin (ยกเว้น Operations Section)', async () => {
      await sidebar.verifyVisibleAllExceptForNonAdmin();
    });
    await test.step('4. ไปที่หน้า Customers', async () => {
      await customersPage.navigateTo();
    });
    await test.step('5. Search หารอน วีสลีย์ และไปที่หน้า Customers Detail ของ Account แรกของ รอน', async () => {
      const expectedId = await customersPage.searchAndNavigate('name', Customers.RonWeasley.name);
      await expect(page).toHaveURL(new RegExp(expectedId));
    });
    await test.step('6. Expected: เห็น Tab ใน Customer Detail ตาม Preset Super Admin', async () => {
      await customersDetailPage.verifyVisibleAllTabExcept([]);
    });
    await test.step('7. ไปที่หน้า Incomes', async () => {
      await incomesPage.navigateTo();
    });
    await test.step('8. Expected: เห็น Income Section ตาม Preset Super Admin', async () => {
      await incomesPage.verifyVisibleAllSectionExcept([]);
    });
    await test.step('9. Expected: สามารถ Download Receipt ในหน้า Invoices ได้', async () => {
      await invoicesPage.downloadReceipt();
    });
  });

  test('TC-02 ตรวจสอบว่า Preset Admin แสดง Sidebar Menu ถูกต้อง สำหรับ Other Role', async ({ page }) => {
    await test.step('1. กด Preset Admin และ Save', async () => {
      await permissionSettingPage.applyPreset('admin');
    });
    await test.step('2. Logout Super Admin และ Login เป็น IIC', async () => {
      await header.logout(process.env.SUPERADMIN_USERNAME!);
      await loginPage.login(process.env.IIC_USERNAME!, process.env.IIC_PASSWORD!);
    });
    await test.step('3. Expected: เห็น Sidebar Menu ตาม Preset Admin (ยกเว้น Operations Section)', async () => {
      await sidebar.verifyVisibleAllExceptForNonAdmin();
    });
    await test.step('4. ไปที่หน้า Customers', async () => {
      await customersPage.navigateTo();
    });
    await test.step('5. Search หารอน วีสลีย์ และไปที่หน้า Customers Detail ของ Account แรกของ รอน', async () => {
      const expectedId = await customersPage.searchAndNavigate('name', Customers.RonWeasley.name);
      await expect(page).toHaveURL(new RegExp(expectedId));
    });
    await test.step('6. Expected: เห็น Tab ใน Customer Detail ตาม Preset Admin', async () => {
      await customersDetailPage.verifyVisibleAllTabExcept(['fundByLotLiveTab']);
    });
    await test.step('7. ไปที่หน้า Incomes', async () => {
      await incomesPage.navigateTo();
    });
    await test.step('8. Expected: เห็น Income Section ตาม Preset Admin', async () => {
      await incomesPage.verifyVisibleAllSectionExcept([]);
    });
    await test.step('9. Expected: ไม่เห็นปุ่ม Download Receipt ในหน้า Invoices', async () => {
      await invoicesPage.verifyDownloadButtonNotVisible();
    });
  });

  test('TC-03 ตรวจสอบว่า Preset MD แสดง Sidebar Menu ถูกต้อง สำหรับ Other Role', async ({ page }) => {
    await test.step('1. กด Preset MD และ Save', async () => {
      await permissionSettingPage.applyPreset('MD');
    });
    await test.step('2. Logout Super Admin และ Login เป็น IIC', async () => {
      await header.logout(process.env.SUPERADMIN_USERNAME!);
      await loginPage.login(process.env.IIC_USERNAME!, process.env.IIC_PASSWORD!);
    });
    await test.step('3. Expected: เห็น Sidebar Menu ตาม Preset MD (ยกเว้น Operations Section)', async () => {
      await sidebar.verifyVisibleAllExceptForNonAdmin(['invoices']);
    });
    await test.step('4. ไปที่หน้า Customers', async () => {
      await customersPage.navigateTo();
    });
    await test.step('5. Search หารอน วีสลีย์ และไปที่หน้า Customers Detail ของ Account แรกของ รอน', async () => {
      const expectedId = await customersPage.searchAndNavigate('name', Customers.RonWeasley.name);
      await expect(page).toHaveURL(new RegExp(expectedId));
    });
    await test.step('6. Expected: เห็น Tab ใน Customer Detail ตาม Preset MD', async () => {
      await customersDetailPage.verifyVisibleAllTabExcept(['fundByLotLiveTab']);
    });
    await test.step('7. ไปที่หน้า Incomes', async () => {
      await incomesPage.navigateTo();
    });
    await test.step('8. Expected: เห็น Income Section ตาม Preset MD', async () => {
      await incomesPage.verifyVisibleAllSectionExcept([]);
    });
  });

  test('TC-04 ตรวจสอบว่า Preset Assistant แสดง Sidebar Menu ถูกต้อง สำหรับ Other Role', async ({ page }) => {
    await test.step('1. กด Preset Assistant และ Save', async () => {
      await permissionSettingPage.applyPreset('assistant');
    });
    await test.step('2. Logout Super Admin และ Login เป็น IIC', async () => {
      await header.logout(process.env.SUPERADMIN_USERNAME!);
      await loginPage.login(process.env.IIC_USERNAME!, process.env.IIC_PASSWORD!);
    });
    await test.step('3. Expected: เห็น Sidebar Menu ตาม Preset Assistant (ยกเว้น Operations Section และ Incomes)', async () => {
      await sidebar.verifyVisibleAllExceptForNonAdmin(['income']);
    });
    await test.step('4. ไปที่หน้า Customers', async () => {
      await customersPage.navigateTo();
    });
    await test.step('5. Search หารอน วีสลีย์ และไปที่หน้า Customers Detail ของ Account แรกของ รอน', async () => {
      const expectedId = await customersPage.searchAndNavigate('name', Customers.RonWeasley.name);
      await expect(page).toHaveURL(new RegExp(expectedId));
    });
    await test.step('6. Expected: เห็น Tab ใน Customer Detail ตาม Preset Assistant', async () => {
      await customersDetailPage.verifyVisibleAllTabExcept(['fundByLotLiveTab']);
    });
    await test.step('7. Expected: ไม่เห็นปุ่ม Download Receipt ในหน้า Invoices', async () => {
      await invoicesPage.verifyDownloadButtonNotVisible();
    });
  });

  test('TC-05 ตรวจสอบว่า Preset IIC แสดง Sidebar Menu ถูกต้อง สำหรับ Other Role', async ({ page }) => {
    await test.step('1. กด Preset IIC และ Save', async () => {
      await permissionSettingPage.applyPreset('IIC');
    });
    await test.step('2. Logout Super Admin และ Login เป็น IIC', async () => {
      await header.logout(process.env.SUPERADMIN_USERNAME!);
      await loginPage.login(process.env.IIC_USERNAME!, process.env.IIC_PASSWORD!);
    });
    await test.step('3. Expected: เห็น Sidebar Menu ตาม Preset IIC (ยกเว้น Operations Section และ Invoices)', async () => {
      await sidebar.verifyVisibleAllExceptForNonAdmin(['invoices']);
    });
    await test.step('4. ไปที่หน้า Customers', async () => {
      await customersPage.navigateTo();
    });
    await test.step('5. Search หารอน วีสลีย์ และไปที่หน้า Customers Detail ของ Account แรกของ รอน', async () => {
      const expectedId = await customersPage.searchAndNavigate('name', Customers.RonWeasley.name);
      await expect(page).toHaveURL(new RegExp(expectedId));
    });
    await test.step('6. Expected: เห็น Tab ใน Customer Detail ตาม Preset IIC', async () => {
      await customersDetailPage.verifyVisibleAllTabExcept(['fundByLotLiveTab']);
    });
    await test.step('7. ไปที่หน้า Incomes', async () => {
      await incomesPage.navigateTo();
    });
    await test.step('8. Expected: เห็น Income Section ตาม Preset IIC', async () => {
      await incomesPage.verifyVisibleAllSectionExcept([]);
    });
  });

  test('TC-06 ตรวจสอบว่า Preset Accountant แสดง Sidebar Menu ถูกต้อง สำหรับ Other Role', async () => {
    await test.step('1. กด Preset Accountant และ Save', async () => {
      await permissionSettingPage.applyPreset('accountant');
    });
    await test.step('2. Logout Super Admin และ Login เป็น IIC', async () => {
      await header.logout(process.env.SUPERADMIN_USERNAME!);
      await loginPage.login(process.env.IIC_USERNAME!, process.env.IIC_PASSWORD!);
    });
    await test.step('3. Expected: เห็น Sidebar Menu ตาม Preset Accountant (ยกเว้น Operations Section, Customers, Funds, Transactions, Incomes, Calendar)', async () => {
      await sidebar.verifyVisibleAllExceptForNonAdmin(['customers', 'funds', 'transactions', 'income', 'calendar','portfolioModels']);
    });
    await test.step('4. Expected: สามารถ Download Receipt ในหน้า Invoices ได้', async () => {
      await invoicesPage.downloadReceipt();
    });
  });

  test('TC-07 ตรวจสอบว่า Preset Customer Support แสดง Sidebar Menu ถูกต้อง สำหรับ Other Role', async ({ page }) => {
    await test.step('1. กด Preset Customer Support และ Save', async () => {
      await permissionSettingPage.applyPreset('customerSupport');
    });
    await test.step('2. Logout Super Admin และ Login เป็น IIC', async () => {
      await header.logout(process.env.SUPERADMIN_USERNAME!);
      await loginPage.login(process.env.IIC_USERNAME!, process.env.IIC_PASSWORD!);
    });
    await test.step('3. Expected: เห็น Sidebar Menu ตาม Preset Customer Support (ยกเว้น Operations Section, Incomes, Invoices)', async () => {
      await sidebar.verifyVisibleAllExceptForNonAdmin(['income', 'invoices','portfolioModels']);
    });
    await test.step('4. ไปที่หน้า Customers', async () => {
      await customersPage.navigateTo();
    });
    await test.step('5. Search หารอน วีสลีย์ และไปที่หน้า Customers Detail ของ Account แรกของ รอน', async () => {
      const expectedId = await customersPage.searchAndNavigate('name', Customers.RonWeasley.name);
      await expect(page).toHaveURL(new RegExp(expectedId));
    });
    await test.step('6. Expected: เห็น Tab ใน Customer Detail ตาม Preset Customer Support', async () => {
      await customersDetailPage.verifyVisibleAllTabExcept(['fundByLotLiveTab']);
    });
  });
});
