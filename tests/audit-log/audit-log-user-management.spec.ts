// tests/audit-log/audit-log-user-management.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/auth/LoginPage';
import { AdminAuditLogsPage } from '../../src/pages/AdminAuditLogsPage';
import { UserManagementPage } from '../../src/pages/user-management/UserManagementPage';
import { CreateUserPage, UserDataInputs } from '../../src/pages/user-management/CreateUserPage';
import { createUserData, editAllFieldsData } from '../../test-data/userData';

test.describe('User Management Workflows & Audit Verification', () => {
  let loginPage      : LoginPage;
  let auditLogsPage  : AdminAuditLogsPage;
  let userPage       : UserManagementPage;
  let createUserPage : CreateUserPage;

  test.beforeEach(async ({ page }) => {
    loginPage      = new LoginPage(page);
    auditLogsPage  = new AdminAuditLogsPage(page);
    userPage       = new UserManagementPage(page);
    createUserPage = new CreateUserPage(page);

    await loginPage.login(process.env.SUPERADMIN_USERNAME!, process.env.SUPERADMIN_PASSWORD!);
    await userPage.navigateTo();
  });

  test('Case 1: Create a brand new user with full details', async ({ page }) => {
    let targetResourceId!: string;

    await test.step('1. ไปที่หน้า Create User', async () => {
      await userPage.createUserButton.click();
      await expect(page).toHaveURL(/.*\/users\/create/);
    });

    await test.step('2. กรอกข้อมูล User และ Submit', async () => {
      await createUserPage.fillUserForm(createUserData);
      targetResourceId = await createUserPage.submitAndGetResourceId('POST');
      await expect(page).toHaveURL(/.*\/users$/);
    });

    await test.step('3. ไปที่ Audit Log และ Search ด้วย Resource ID', async () => {
      await auditLogsPage.navigateTo();
      await auditLogsPage.resourceIdInput.fill(targetResourceId);
      await auditLogsPage.searchButton.click();
    });

    await test.step('4. Expected: เห็น Audit Log row ที่ถูกต้อง', async () => {
      const auditRow = page.locator('tr').filter({ hasText: targetResourceId }).first();
      await expect(auditRow).toBeVisible();
      await expect(auditRow).toContainText('USER_MANAGEMENT');
      await expect(auditRow).toContainText('CREATE_USER');
    });

    await test.step('5. Expected: Audit Log Modal มีข้อมูลถูกต้อง', async () => {
      await auditLogsPage.onlyRowViewDetailsButton.click();
      expect(await auditLogsPage.getModalValueForLabel('Status')).toBe('SUCCESS');
      expect(await auditLogsPage.getModalValueForLabel('Action Name')).toBe('CREATE_USER');
      expect(await auditLogsPage.getModalValueForLabel('Resource ID')).toBe(targetResourceId);
      expect(await auditLogsPage.getModalValueForLabel('Admin Email')).toBe(process.env.SUPERADMIN_USERNAME!);
    });

    await test.step('6. Expected: JSON payload ใน Modal มีข้อมูลถูกต้อง', async () => {
      const actualJsonPayload = await auditLogsPage.getDetailJsonContent();
      verifyAuditLogJsonPayload(actualJsonPayload.body, createUserData);
      await auditLogsPage.closeModalButton.click();
    });
  });

  test('Case 2: Edit an existing user - Modifying ALL fields', async ({ page }) => {
    let targetResourceId!: string;

    await test.step('1. เปิดหน้า Edit สำหรับ User ที่ต้องการแก้ไข', async () => {
      await userPage.openEditForUser(createUserData.email);
    });

    await test.step('2. แก้ไข User ทุก field และ Submit', async () => {
      await createUserPage.fillUserForm(editAllFieldsData);
      targetResourceId = await createUserPage.submitAndGetResourceId('PUT');
    });

    await test.step('3. ไปที่ Audit Log และ Search ด้วย Resource ID', async () => {
      await auditLogsPage.navigateTo();
      await auditLogsPage.resourceIdInput.fill(targetResourceId);
      await auditLogsPage.searchButton.click();
    });

    await test.step('4. Expected: เห็น Audit Log row ที่ถูกต้อง', async () => {
      const auditRow = page.locator('tr').filter({ hasText: targetResourceId }).first();
      await expect(auditRow).toContainText('USER_MANAGEMENT');
      await expect(auditRow).toContainText('UPDATE_USER');
    });

    await test.step('5. Expected: Audit Log Modal มีข้อมูลถูกต้อง', async () => {
      await auditLogsPage.onlyRowViewDetailsButton.click();
      expect(await auditLogsPage.getModalValueForLabel('Status')).toBe('SUCCESS');
      expect(await auditLogsPage.getModalValueForLabel('Action Name')).toBe('UPDATE_USER');
      expect(await auditLogsPage.getModalValueForLabel('Resource ID')).toBe(targetResourceId);
      expect(await auditLogsPage.getModalValueForLabel('Admin Email')).toBe(process.env.SUPERADMIN_USERNAME!);
    });

    await test.step('6. Expected: JSON payload ใน Modal มีข้อมูลถูกต้อง', async () => {
      const actualJsonPayload = await auditLogsPage.getDetailJsonContent();
      verifyAuditLogJsonPayload(actualJsonPayload.body, editAllFieldsData);
      await auditLogsPage.closeModalButton.click();
    });
  });
});

function verifyAuditLogJsonPayload(actualJsonPayload: any, expectedData: UserDataInputs) {
  expect(actualJsonPayload.name).toBe(expectedData.name);
  expect(actualJsonPayload.role).toBe(expectedData.role);
  expect(actualJsonPayload.email).toBe(expectedData.email);
  expect(actualJsonPayload.phone).toBe(expectedData.phone);
  expect(actualJsonPayload.iicCode).toBe(expectedData.iicCode);
  if (actualJsonPayload.isActive !== undefined) {
    expect(actualJsonPayload.isActive).toBe(true);
  }

  if (expectedData.citizenId && actualJsonPayload.iicProfile) {
    expect(actualJsonPayload.iicProfile.idCard).toBe(expectedData.citizenId);
    expect(actualJsonPayload.iicProfile.vat).toBe(expectedData.vatOption === 'Yes');

    const actualAddress = actualJsonPayload.iicProfile.identificationAddress;
    if (actualAddress) {
      expect(actualAddress.no).toBe(expectedData.addressNumber);
      expect(actualAddress.moo).toBe(expectedData.addressMoo);
      expect(actualAddress.building).toBe(expectedData.addressBuilding);
      expect(actualAddress.soi).toBe(expectedData.addressSoi);
      expect(actualAddress.road).toBe(expectedData.addressRoad);
      expect(actualAddress.subdistrict).toBe(expectedData.addressSubdistrict);
      expect(actualAddress.district).toBe(expectedData.addressDistrict);
      expect(actualAddress.province).toBe(expectedData.addressProvince);
      expect(actualAddress.postalCode).toBe(expectedData.addressPostalCode);
    }
  }

  if (expectedData.bankBranch && expectedData.bankAccountNumber) {
    expect(actualJsonPayload.bankBranch).toBe(expectedData.bankBranch);
    expect(actualJsonPayload.bankAccountNumber).toBe(expectedData.bankAccountNumber);
  }
}
