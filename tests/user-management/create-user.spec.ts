// tests/user-management/create-user.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/auth/LoginPage';
import { UserManagementPage } from '../../src/pages/user-management/UserManagementPage';
import { CreateUserPage } from '../../src/pages/user-management/CreateUserPage';

function generateThaiCitizenId(): string {
  const digits = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10));
  const sum = digits.reduce((acc, digit, index) => acc + digit * (13 - index), 0);
  const check = (11 - (sum % 11)) % 10;
  return [...digits, check].join('');
}

test.describe('User Creation', () => {
  let loginPage: LoginPage;
  let userManagementPage: UserManagementPage;
  let createUserPage: CreateUserPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    userManagementPage = new UserManagementPage(page);
    createUserPage = new CreateUserPage(page);
    await loginPage.login(process.env.SUPERADMIN_USERNAME!, process.env.SUPERADMIN_PASSWORD!);
  });

  test('TC-01 สร้าง IIC User ใหม่พร้อม Role IIC และตรวจสอบว่าปรากฏในรายการ', async ({ page }) => {
    const nowPlus7 = new Date(Date.now() + 7 * 60 * 60 * 1000);
    const uniqueSuffix = nowPlus7.toISOString().replace(/\D/g, '').slice(0, 14);
    const userName = `test iic user ${uniqueSuffix}`;
    const userEmail = `testiic+${uniqueSuffix}@example.com`;
    const userIICCode = `IIC${uniqueSuffix}`;
    const citizenId = generateThaiCitizenId();

    await test.step('1. ไปที่หน้า User Management และคลิก Create User', async () => {
      await userManagementPage.navigateTo();
      await userManagementPage.createUserButton.click();
      await expect(page).toHaveURL(/.*\/users\/create/);
    });

    await test.step('2. กรอกข้อมูล User ทุก field ที่จำเป็น', async () => {
      await createUserPage.fillUserForm({
        name: userName,
        email: userEmail,
        phone: '0812345678',
        iicCode: userIICCode,
        citizenId,
        addressNumber: '123',
        addressMoo: '1',
        addressBuilding: 'Test Village',
        addressSoi: 'Test Soi',
        addressRoad: 'Test Road',
        addressSubdistrict: 'Test Subdistrict',
        addressDistrict: 'Test District',
        addressProvince: 'Test Province',
        addressPostalCode: '10210',
        bankBranch: '002',
        bankAccountNumber: '1234567890',
      });
    });

    await test.step('3. Submit และ Expected: กลับไปที่หน้า Users list', async () => {
      await createUserPage.submitButton.click();
      await expect(page).toHaveURL(/.*\/users$/);
    });

    await test.step('4. Expected: User ที่สร้างปรากฏในรายการ', async () => {
      await expect(page.getByText(userName)).toBeVisible({ timeout: 15000 });
      await expect(page.getByText(userEmail)).toBeVisible({ timeout: 15000 });
      await expect(page.getByText(userIICCode)).toBeVisible();
    });
  });
});
