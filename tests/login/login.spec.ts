// tests/login/login.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/auth/LoginPage';

test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
  });

  test('TC-01 ตรวจสอบว่าสามารถ Login ด้วย Account Super Admin ได้', async ({ page }) => {
    await test.step('1. ไปที่ IIC และ Login ด้วยรหัสที่ถูกต้องของ Super Admin', async () => {
      await loginPage.login(process.env.SUPERADMIN_USERNAME!, process.env.SUPERADMIN_PASSWORD!);
    });

    await test.step('2. Expected: Login สำเร็จและไปที่หน้า Dashboard', async () => {
      await expect(page).toHaveURL('https://iicportal-uat.robodev.co/dashboard');
    });
  });

  test('TC-02 ตรวจสอบว่า Login ไม่สำเร็จเมื่อกรอก Username ที่ไม่มีอยู่', async () => {
    await test.step('1. ไปที่ IIC และ Login ด้วยรหัสมั่วๆ', async () => {
      await loginPage.login('usermuamua', 'passwordmuamua');
    });

    await test.step('2. Expected: Login ไม่สำเร็จ และขึ้นข้อความ Error', async () => {
      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toContainText('Invalid username or password');
    });
  });

  test('TC-03 ตรวจสอบว่า Login ไม่สำเร็จเมื่อกรอก Password ผิด', async () => {
    await test.step('1. ไปที่ IIC และ Login ด้วยรหัสมั่วๆ', async () => {
      await loginPage.login(process.env.SUPERADMIN_USERNAME!, 'passwordmuamua');
    });

    await test.step('2. Expected: Login ไม่สำเร็จ และขึ้นข้อความ Error', async () => {
      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toContainText('Invalid username or password');
    });
  });
});
