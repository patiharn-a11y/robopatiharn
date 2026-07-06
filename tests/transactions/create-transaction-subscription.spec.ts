//tests/transactions/create-transaction-subscription.spec.ts
import { test, expect } from "@playwright/test";
import { LoginPage } from "../../src/pages/auth/LoginPage";
import { Sidebar } from "../../src/components/Sidebar";
import { CustomersPage } from "../../src/pages/customers/CustomersPage";
import { CustomersDetailPage } from "../../src/pages/customers/CustomersDetailPage";
import { CreateTransactionsPage } from "../../src/pages/CreateTransactionsPage";
import { Customers } from "../../test-data/customerData";
import { Header } from "../../src/components/Header";

test.describe("Create Transaction Redemption", () => {
  let loginPage                    : LoginPage;
  let header                       : Header;
  let sidebar                      : Sidebar;
  let customersPage                 : CustomersPage;
  let customersDetailPage          : CustomersDetailPage;
  let createTransactionsPage       : CreateTransactionsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    header = new Header(page);
    sidebar = new Sidebar(page, header);
    customersPage = new CustomersPage(page);
    customersDetailPage = new CustomersDetailPage(page);

  await test.step("Prerequisite    : Login ด้วย Super Admin และไปที่หน้า Customers Detail Page ของ Account วัลเนอราเบิ้ล วีสลีย์", async () => {
      await loginPage.login(process.env.SUPERADMIN_USERNAME!, process.env.SUPERADMIN_PASSWORD!);
      await customersPage.navigateTo();
      const expectedId = await customersPage.searchAndNavigate('name', Customers.VulnerableWeasley.name);
        await expect(page).toHaveURL(new RegExp(expectedId));
    });
  });

  test("TC-01 ตรวจสอบว่า ", async ({
    page,
  }) => {
    await test.step("1. กด Preset Super Admin และ Save", async () => {
      await expect(customersDetailPage.customersDetailHeader).toBeVisible();
    });
  });
});
