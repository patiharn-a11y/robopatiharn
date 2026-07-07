import { Page, Locator, expect } from "@playwright/test";

// ทำไว้ก่อนรอ locator data test id

export class CreateTransactionsPage {
  readonly page                         : Page;

  readonly breadcrumbsFirst             : Locator;
  readonly breadcrumbsSecond            : Locator;
  readonly breadcrumbsThird             : Locator;

  readonly customerHeader               : Locator;

  readonly subscriptionTab              : Locator;
  readonly redemptionTab                : Locator;
  readonly switchingTab                 : Locator;
  readonly crossSwitchingTab            : Locator;

  readonly subscriptionHeader           : Locator;

  readonly fundCodeInput                : Locator;
  readonly amcCodeDropdown              : Locator;
  readonly unitholderIdDropdown         : Locator;
  readonly totalBalanceDisplay          : Locator;
  readonly totalUnitDisplay             : Locator;
  readonly bankAccountDropdown          : Locator;
  readonly amountInput                  : Locator;
  readonly effectiveDateSelector        : Locator;
  readonly paymentMethodDropdown        : Locator;
  readonly investmentLicenseDisplay     : Locator;

  readonly switchInFundCodeDropdown     : Locator;
  readonly switchInAMCCodeDropdown      : Locator;
  readonly swtichInUnitholderIdDropdown : Locator;

  readonly submitButton                 : Locator;
  readonly clearButton                  : Locator;

  constructor(page: Page) {
    // Need to get all Test Id from data-testid before using
    this.page                         = page;

    this.breadcrumbsFirst             = page.getByTestId("breadcrumb-item-0");
    this.breadcrumbsSecond            = page.getByTestId("breadcrumb-item-1");
    this.breadcrumbsThird             = page.getByTestId("breadcrumb-item-2");

    this.customerHeader               = page.getByText('ชื่อ-สกุล (อังกฤษ)');

    this.subscriptionTab              = page.getByTestId("transaction-create-tab-subscription",);
    this.redemptionTab                = page.getByTestId("transaction-create-tab-redemption");
    this.switchingTab                 = page.getByTestId("transaction-create-tab-switching");
    this.crossSwitchingTab            = page.getByTestId("transaction-create-tab-cross-amc-switching");

    this.subscriptionHeader           = page.getByRole("heading", {name: "Subscription"});

    this.fundCodeInput                = page.getByTestId("subscription-input-fund-search");
    this.amcCodeDropdown              = page.getByTestId("subscription-select-amc-code");
    this.unitholderIdDropdown         = page.getByTestId("subscription-select-unitholder");
    this.totalBalanceDisplay          = page.getByRole("textbox").first();
    this.totalUnitDisplay             = page.getByRole("textbox", { name: "Unit" });
    this.investmentLicenseDisplay     = page.getByRole("textbox").nth(4);
    this.bankAccountDropdown          = page.getByRole("combobox").nth(2);
    this.amountInput                  = page.locator('input[type="text"]');
    this.effectiveDateSelector        = page.locator('input[type="date"]');
    this.paymentMethodDropdown        = page.getByRole("combobox").nth(3);

    this.switchInFundCodeDropdown     = page.getByRole("textbox", {name: "ชื่อย่อกองทุน"});
    this.switchInAMCCodeDropdown      = page.getByRole("combobox").nth(4);
    this.swtichInUnitholderIdDropdown = page.getByRole("combobox").nth(5);

    this.submitButton                 = page.getByTestId("subscription-btn-submit");
    this.clearButton                  = page.getByTestId("subscription-btn-clear");
  }

  async createSubscription(
    fundCode           : string,
    bankAccount        : string,
    subscriptionAmount : string,
    effectiveDateDay   : string,
    effectiveDateMonth : string,
    effectiveDateYear  : string,
    paymentMethod      : "ATS to/by SA" | "ATS to/by AMC" | "Bank Transfer to AMC",
  ) {
    // Helper to add days/months logic
    let day   = parseInt(effectiveDateDay);
    let month = parseInt(effectiveDateMonth);
    let year  = parseInt(effectiveDateYear);

    await this.subscriptionTab.click();

    // Define the interaction in a reusable function for retries
    const fillAndSubmit = async () => {
      // Clear any stale value left over from a previous failed attempt
      await this.clearButton.click();

      await this.amountInput.fill(subscriptionAmount);

      await this.effectiveDateSelector.click();
      await this.page.keyboard.type(String(day).padStart(2, "0"));
      await this.page.keyboard.type(String(month).padStart(2, "0"));
      await this.page.keyboard.type(String(year));

      await this.paymentMethodDropdown.click();
      await this.page.getByText(paymentMethod).click();

      await this.fundCodeInput.fill(fundCode);
      await this.page.getByRole("button", { name: fundCode }).click();

      await this.bankAccountDropdown.click();
      await this.page.getByText(bankAccount).click();

      await this.submitButton.click();
    };

    const maxAttempts = 3;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await fillAndSubmit();
        // Use a timeout or a specific success indicator to verify it worked
        await expect(this.submitButton).not.toBeVisible({ timeout: 5000 });
        return;
      } catch (error) {
        console.log(`Submission failed on attempt ${attempt}, possibly a holiday. Trying next day...`);

        // Logic to increment date (simple version: add 1 day)
        day += 1;
        if (day > 30) {
          day = 1;
          month += 1;
        }

        if (attempt === maxAttempts) {
          throw error;
        }
      }
    }
  }
}
