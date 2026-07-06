import { Page, Locator } from "@playwright/test";

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

    this.customerHeader               = page.getByRole("heading");

    this.subscriptionTab              = page.getByTestId("transaction-create-tab-subscription",);
    this.redemptionTab                = page.getByTestId("transaction-create-tab-redemption");
    this.switchingTab                 = page.getByTestId("transaction-create-tab-switching");
    this.crossSwitchingTab            = page.getByTestId("transaction-create-tab-cross-amc-switching",);

    this.subscriptionHeader           = page.getByRole('heading', { name: 'Subscription' });

    this.fundCodeInput                = page.getByTestId("subscription-input-fund-search");
    this.amcCodeDropdown              = page.getByTestId("subscription-select-amc-code");
    this.unitholderIdDropdown         = page.getByTestId("subscription-select-unitholder",);
    this.totalBalanceDisplay          = page.getByRole("textbox").first();
    this.totalUnitDisplay             = page.getByRole("textbox", { name: "Unit" });
    this.investmentLicenseDisplay     = page.getByRole("textbox").nth(4);
    this.bankAccountDropdown          = page.getByRole("combobox").filter({ hasText: /^$/ });
    this.amountInput                  = page.locator('input[type="text"]');
    this.effectiveDateSelector        = page.locator('input[type="date"]');
    this.paymentMethodDropdown        = page.getByRole("combobox").nth(3);

    this.switchInFundCodeDropdown     = page.getByRole("textbox", {name: "ชื่อย่อกองทุน",});
    this.switchInAMCCodeDropdown      = page.getByRole("combobox").nth(4);
    this.swtichInUnitholderIdDropdown = page.getByRole("combobox").nth(5);

    this.submitButton                 = page.getByTestId("cross-amc-switching-btn-submit");
    this.clearButton                  = page.getByTestId("cross-amc-switching-btn-clear");
  }

  async createSubscription(
    fundCode           : string,
    unitholderId       : string,
    bankAccount        : string,
    subscriptionAmount : string,
    effectiveDate      : string,
    paymentMethod      : "ATS to/by SA" | "ATS to/by AMC" | "Bank Transfer to AMC",
  ) {

    await this.subscriptionTab.click();
    await this.fundCodeInput.fill(fundCode);
    await this.unitholderIdDropdown.click();
  }
}
