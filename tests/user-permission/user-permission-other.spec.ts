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

test.describe('User Permission Other Role Presets', () => {
  let loginPage             : LoginPage;
  let header                : Header;
  let sidebar               : Sidebar;
  let userManagementPage    : UserManagementPage;
  let permissionSettingPage : PermissionSettingPage;
  let customersPage         : CustomersPage;
  let customersDetailPage   : CustomersDetailPage;
  let incomesPage           : IncomesPage;
  let invoicesPage          : InvoicesPage;

  test.beforeEach(async ({ page }) => {
    loginPage             = new LoginPage(page);
    header                = new Header(page);
    sidebar               = new Sidebar(page, header);
    userManagementPage    = new UserManagementPage(page);
    permissionSettingPage = new PermissionSettingPage(page);
    customersPage         = new CustomersPage(page);
    customersDetailPage   = new CustomersDetailPage(page);
    incomesPage           = new IncomesPage(page);
    invoicesPage          = new InvoicesPage(page);

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
      const expectedId = await customersPage.searchAndNavigate('name', Customers.VulnerableWeasley.name);
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
      const expectedId = await customersPage.searchAndNavigate('name', Customers.VulnerableWeasley.name);
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
      const expectedId = await customersPage.searchAndNavigate('name', Customers.VulnerableWeasley.name);
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
      const expectedId = await customersPage.searchAndNavigate('name', Customers.VulnerableWeasley.name);
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
      const expectedId = await customersPage.searchAndNavigate('name', Customers.VulnerableWeasley.name);
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
      await sidebar.verifyVisibleAllExceptForNonAdmin(['customers', 'funds', 'transactions', 'income', 'calendar', 'portfolioModels']);
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
      await sidebar.verifyVisibleAllExceptForNonAdmin(['income', 'invoices']);
    });
    await test.step('4. ไปที่หน้า Customers', async () => {
      await customersPage.navigateTo();
    });
    await test.step('5. Search หารอน วีสลีย์ และไปที่หน้า Customers Detail ของ Account แรกของ รอน', async () => {
      const expectedId = await customersPage.searchAndNavigate('name', Customers.VulnerableWeasley.name);
      await expect(page).toHaveURL(new RegExp(expectedId));
    });
    await test.step('6. Expected: เห็น Tab ใน Customer Detail ตาม Preset Customer Support', async () => {
      await customersDetailPage.verifyVisibleAllTabExcept(['fundByLotLiveTab']);
    });
  });
});
