//tests/transactions/create-transaction-subscription.spec.ts
// ทำไว้ก่อนรอ data test id
import { test, expect } from "@playwright/test";
import { LoginPage } from "../../src/pages/auth/LoginPage";
import { Sidebar } from "../../src/components/Sidebar";
import { CustomersPage } from "../../src/pages/customers/CustomersPage";
import { CustomersDetailPage } from "../../src/pages/customers/CustomersDetailPage";
import { CreateTransactionsPage } from "../../src/pages/CreateTransactionsPage";
import { Customers } from "../../test-data/customerData";
import { Header } from "../../src/components/Header";
import { Funds } from "../../test-data/fundData";

test.describe("Create Transaction Redemption", () => {
  let loginPage                 : LoginPage;
  let header                    : Header;
  let sidebar                   : Sidebar;
  let customersPage             : CustomersPage;
  let customersDetailPage       : CustomersDetailPage;
  let createTransactionsPage    : CreateTransactionsPage;

  test.beforeEach(async ({ page }) => {
    loginPage              = new LoginPage(page);
    header                 = new Header(page);
    sidebar                = new Sidebar(page, header);
    customersPage          = new CustomersPage(page);
    customersDetailPage    = new CustomersDetailPage(page);
    createTransactionsPage = new CreateTransactionsPage(page);

    await test.step("Prerequisite : Login ด้วย Super Admin และไปที่หน้า Customers Detail Page ของ Account วัลเนอราเบิ้ล วีสลีย์", async () => {
      await loginPage.login(process.env.SUPERADMIN_USERNAME!, process.env.SUPERADMIN_PASSWORD!);
      await customersPage.navigateTo();
      const expectedId = await customersPage.searchAndNavigate("name", Customers.RonWeasley.name);
      await expect(page).toHaveURL(new RegExp(expectedId));
    });
  });  

  test("TC-01 ตรวจสอบว่าซื้อได้", async ({ page }) => {
    await test.step("1. กด Preset Super Admin และ Save", async () => {
      const today = new Date();
      const thisDay   = String(today.getDate()).padStart(2, "0"); // '06'
      const thisMonth = String(today.getMonth() + 1).padStart(2, "0"); // '07' (Month is 0-indexed)
      const thisYear  = String(today.getFullYear()); // '2026'
      await expect(customersDetailPage.customersDetailHeader).toBeVisible();
      await customersDetailPage.createTransactionButton.click();
      await createTransactionsPage.createSubscription(
        Funds.KFCASH_A.code,
        Customers.RonWeasley.bankAccount,
        Funds.KFCASH_A.minumunBuy,
        thisDay,
        thisMonth,
        thisYear,
        "ATS to/by AMC",
      );
    await test.step("2. กด Preset Super Admin และ Save", async () => { 
      await expect(customersDetailPage.customersDetailHeader).toBeVisible();
    });
  });
  
  });
});
