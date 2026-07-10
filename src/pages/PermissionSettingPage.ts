// src/pages/PermissionSettingPage.ts
import { Page, Locator } from '@playwright/test';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';

export type PermissionPath =
  | 'dashboard'
  | 'customers'
  | 'customers.detail'
  | 'customers.detail.assetAllocation'
  | 'customers.detail.fundByLot'
  | 'customers.detail.fundByLotLive'
  | 'customers.detail.profile'
  | 'customers.detail.transactions'
  | 'customers.manage'
  | 'funds'
  | 'transactions'
  | 'transactions.create'
  | 'incomes'
  | 'incomes.chart'
  | 'incomes.customer'
  | 'incomes.totalIncome'
  | 'calendar'
  | 'invoices'
  | 'invoices.file'
  | 'invoices.file.receipt'
  | 'portfolioModels';

export class PermissionSettingPage {
  readonly page                  : Page;
  readonly header                : Header;
  readonly sidebar               : Sidebar;

  readonly selectAllButton       : Locator;
  readonly clearAllButton        : Locator;
  readonly saveButton            : Locator;

  readonly presetSuperAdmin      : Locator;
  readonly presetAdmin           : Locator;
  readonly presetMD              : Locator;
  readonly presetAssistant       : Locator;
  readonly presetIIC             : Locator;
  readonly presetAccountant      : Locator;
  readonly presetIndegoSales     : Locator;

  constructor(page: Page) {
    this.page                  = page;
    this.header                = new Header(page);
    this.sidebar               = new Sidebar(page, this.header);

    this.selectAllButton       = page.getByTestId('permission-btn-select-all');
    this.clearAllButton        = page.getByTestId('permission-btn-clear-all');
    this.saveButton            = page.getByTestId('permission-settings-btn-save');

    this.presetSuperAdmin      = page.getByTestId('permission-settings-btn-preset-SUPER_ADMIN');
    this.presetAdmin           = page.getByTestId('permission-settings-btn-preset-ADMIN');
    this.presetMD              = page.getByTestId('permission-settings-btn-preset-MD');
    this.presetAssistant       = page.getByTestId('permission-settings-btn-preset-ASSISTANT');
    this.presetIIC             = page.getByTestId('permission-settings-btn-preset-IIC');
    this.presetAccountant      = page.getByTestId('permission-settings-btn-preset-ACCOUNTANT');
    this.presetIndegoSales     = page.getByTestId('permission-settings-btn-preset-INDEGO_SALES');
  }

  private getKey(id: string) {
    return this.page.getByTestId(id);
  }

  get permissions() {
    return {
      dashboard: {
        folder      : this.getKey('permission-checkbox-dashboard'),
        view        : this.getKey('permission-checkbox-dashboard.view'),
      },
      customers: {
        folder              : this.getKey('permission-checkbox-customers'),
        view                : this.getKey('permission-checkbox-customers.view'),
        detail: {
          folder            : this.getKey('permission-checkbox-customers.detail'),
          view              : this.getKey('permission-checkbox-customers.detail.view'),
          assetAllocation: {
            folder          : this.getKey('permission-checkbox-customers.detail.assetAllocation'),
            view            : this.getKey('permission-checkbox-customers.detail.asset.view'),
          },
          fundByLot: {
            folder          : this.getKey('permission-checkbox-customers.detail.fundByLot'),
            view            : this.getKey('permission-checkbox-customers.detail.fundByLot.view'),
          },
          fundByLotLive: {
            folder          : this.getKey('permission-checkbox-customers.detail.fundByLotLive'),
            view            : this.getKey('permission-checkbox-customers.detail.fundByLotLive.view'),
          },
          profile: {
            folder          : this.getKey('permission-checkbox-customers.detail.profile'),
            view            : this.getKey('permission-checkbox-customers.detail.profile.view'),
          },
          transactions: {
            folder          : this.getKey('permission-checkbox-customers.detail.transactions'),
            view            : this.getKey('permission-checkbox-customers.detail.transactions.view'),
          },
        },
        manage: {
          folder           : this.getKey('permission-checkbox-customers.manage'),
          editPortfolio    : this.getKey('permission-checkbox-customers.manage.editPortfolio'),
        }
      },
      funds: {
        folder              : this.getKey('permission-checkbox-funds'),
        view                : this.getKey('permission-checkbox-funds.view'),
      },
      transactions: {
        folder              : this.getKey('permission-checkbox-transactions'),
        view                : this.getKey('permission-checkbox-transactions.view'),
        create: {
          folder            : this.getKey('permission-checkbox-transactions.create'),
        },
      },
      incomes: {
        folder              : this.getKey('permission-checkbox-incomes'),
        view                : this.getKey('permission-checkbox-incomes.view'),
        chart: {
            folder          : this.getKey('permission-checkbox-incomes.chart'),
            view            : this.getKey('permission-checkbox-incomes.chart.view'),
        },
        customer: {
            folder          : this.getKey('permission-checkbox-incomes.customer'),
            view            : this.getKey('permission-checkbox-incomes.customer.view'),
        },
        totalIncome: {
            folder          : this.getKey('permission-checkbox-incomes.totalIncome'),
            view            : this.getKey('permission-checkbox-incomes.totalIncome.view'),
        },
      },
      calendar: {
        folder              : this.getKey('permission-checkbox-calendar'),
        view                : this.getKey('permission-checkbox-calendar.view'),
      },
      invoices: {
        folder              : this.getKey('permission-checkbox-invoices'),
        view                : this.getKey('permission-checkbox-invoices.view'),
        file: {
            folder          : this.getKey('permission-checkbox-invoices.file'),
            receipt: {
                folder      : this.getKey('permission-checkbox-invoices.file.receipt'),
                download    : this.getKey('permission-checkbox-invoices.file.receipt.download'),
            },
        }
      },
      portfolioModels: {
        folder              : this.getKey('permission-checkbox-portfolio-models'),
        view                : this.getKey('permission-checkbox-portfolio-models.view'),
      },
    }
  }

  // Function grantAllExcept เป็น function ไว้สำหรับเลือก permission ทั้งหมดตั้งต้น และกดเลือกเพื่อไม่ให้สิทธิ์แก่ permission ที่ใส่ใน arguments
  // ถ้าเว้นค่า arguments ว่างหมายความว่าให้มีทุก permission
  // ตัวอย่าง await permissionSettingPage.grantAllExcept(['customers']) หมายถึงเข้าได้ทุกสิทธิ์ยกเว้น Customers
  // กรณีที่ permission ถูก nested ให้เรียกโดยมีจุด เช่น customers.detail, customers.detail.profile, incomes.chart
  async grantAllExcept(paths: PermissionPath[]) {
    await this.selectAllButton.click();

    for (const path of paths) {
      const keys = path.split('.');
      
      let current: any = this.permissions;
      
      for (const key of keys) {
        current = current[key];
      }

      if (current && current.folder) {
        await current.folder.click();
      } else {
        throw new Error(`Permission path "${path}" not found or has no folder.`);
      }
    }

    await this.saveButton.click();
  }

  // Function applyPreset มีไว้เพื่อเลือกปุ่ม Permission Presets ตามที่ตั้งค่า Config ไว้ ไม่เกี่ยวกับการเปลี่ยน Role
  async applyPreset(preset: 'superAdmin' | 'admin' | 'MD' | 'assistant' | 'IIC' | 'accountant' | 'indegoSales') {
    const presetMap = {
      superAdmin      : this.presetSuperAdmin,
      admin           : this.presetAdmin,
      MD              : this.presetMD,
      assistant       : this.presetAssistant,
      IIC             : this.presetIIC,
      accountant      : this.presetAccountant,
      indegoSales : this.presetIndegoSales,
    };
    await presetMap[preset].click();
    await this.saveButton.click();
  }

}


