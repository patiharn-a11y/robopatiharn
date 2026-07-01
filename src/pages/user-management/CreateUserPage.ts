// src/pages/CreateUserPage.ts
import { Page, Locator } from '@playwright/test';

export class CreateUserPage {
  readonly page                     : Page;

  // Role Dropdown
  readonly roleDropdown             : Locator;
  readonly roleOptionSuperAdmin     : Locator;
  readonly roleOptionAdmin          : Locator;
  readonly roleOptionMD             : Locator;
  readonly roleOptionAssistant      : Locator;
  readonly roleOptionIIC            : Locator;
  readonly roleOptionAccount        : Locator;
  readonly roleOptionCS             : Locator;

  // Status
  readonly activeStatusToggle       : Locator;

  // FCN Citizen ID Search
  readonly FCNcitizenIdInput        : Locator;
  readonly FCNcitizenIdSearchButton : Locator;

  // Base Info Fields
  readonly nameInput                : Locator;
  readonly emailInput               : Locator;
  readonly phoneInput               : Locator;
  readonly iicCodeInput             : Locator;
  readonly citizenIdInput           : Locator;

  // Address Fields
  readonly addressNumberInput       : Locator;
  readonly addressMooInput          : Locator;
  readonly addressBuildingInput     : Locator;
  readonly addressSoiInput          : Locator;
  readonly addressRoadInput         : Locator;
  readonly addressSubdistrictInput  : Locator;
  readonly addressDistrictInput     : Locator;
  readonly addressProvinceInput     : Locator;
  readonly addressPostalCodeInput   : Locator;

  // Bank Info Fields
  readonly bankBranchInput          : Locator;
  readonly bankAccountNumberInput   : Locator;

  // VAT Dropdown
  readonly VATdropdown              : Locator;
  readonly VATOptionNo              : Locator;
  readonly VATOptionYes             : Locator;

  // Other Fields
  readonly signatureUploadInput     : Locator;
  readonly passwordInput            : Locator;
  readonly submitButton             : Locator;

  constructor(page: Page) {
    this.page = page;

    // Role Dropdown
    this.roleDropdown             = page.getByRole('combobox').filter({ hasText: 'IIC' });
    this.roleOptionSuperAdmin     = page.getByRole('option', { name: 'SUPER_ADMIN' });
    this.roleOptionAdmin          = page.getByRole('option', { name: 'ADMIN', exact: true });
    this.roleOptionMD             = page.getByRole('option', { name: 'MD' });
    this.roleOptionAssistant      = page.getByRole('option', { name: 'ASSISTANT' });
    this.roleOptionIIC            = page.getByRole('option', { name: 'IIC' });
    this.roleOptionAccount        = page.getByRole('option', { name: 'ACCOUNTANT' });
    this.roleOptionCS             = page.getByRole('option', { name: 'CUSTOMER_SUPPORT' });

    // Status
    this.activeStatusToggle       = page.getByRole('switch');

    // FCN Citizen ID Search
    this.FCNcitizenIdInput        = page.getByRole('textbox', { name: 'กรอกเลขบัตรประชาชน' });
    this.FCNcitizenIdSearchButton = page.getByRole('button', { name: 'Search' });

    // Base Info Fields
    this.nameInput                = page.getByRole('textbox', { name: 'กรอกชื่อ-นามสกุล' });
    this.emailInput               = page.getByRole('textbox', { name: 'กรอกอีเมล' });
    this.phoneInput               = page.getByRole('textbox', { name: 'กรอกเบอร์โทรศัพท์มือถือ' });
    this.iicCodeInput             = page.getByRole('textbox', { name: 'รหัสแทนตัว IIC' });
    this.citizenIdInput           = page.getByRole('textbox', { name: 'เลขบัตรประชาชน', exact: true });

    // Address Fields
    this.addressNumberInput       = page.getByRole('textbox', { name: 'บ้านเลขที่' });
    this.addressMooInput          = page.getByRole('textbox', { name: 'หมู่', exact: true });
    this.addressBuildingInput     = page.getByRole('textbox', { name: 'อาคาร/หมู่บ้าน' });
    this.addressSoiInput          = page.getByRole('textbox', { name: 'ซอย' });
    this.addressRoadInput         = page.getByRole('textbox', { name: 'ถนน' });
    this.addressSubdistrictInput  = page.getByRole('textbox', { name: 'แขวง/ตำบล' });
    this.addressDistrictInput     = page.getByRole('textbox', { name: 'เขต/อำเภอ' });
    this.addressProvinceInput     = page.getByRole('textbox', { name: 'จังหวัด' });
    this.addressPostalCodeInput   = page.getByRole('textbox', { name: 'รหัสไปรษณีย์' });

    // Bank Info Fields
    this.bankBranchInput          = page.getByRole('textbox', { name: 'รหัสธนาคาร' });
    this.bankAccountNumberInput   = page.getByRole('textbox', { name: 'เลขที่บัญชีธนาคาร' });

    // VAT Dropdown
    this.VATdropdown              = page.getByRole('combobox').filter({ hasText: 'No' });
    this.VATOptionNo              = page.getByRole('option', { name: 'No' });
    this.VATOptionYes             = page.getByRole('option', { name: 'Yes' });

    // Other Fields
    this.signatureUploadInput     = page.getByText('ลากและวางไฟล์ JPG, PNG หรือ SVG ที่นี่ หรือคลิกเพื่อเลือกขนาดสูงสุด 2 MB');
    this.passwordInput            = page.getByRole('textbox', { name: 'ระบุรหัสผ่านสำหรับเข้าสู่ระบบ (ไม่ระบุได้)' })
                                    .or(page.getByRole('textbox', { name: 'ปล่อยว่างหากไม่ต้องการเปลี่ยนรหัสผ่าน' }));
    this.submitButton             = page.getByRole('button', { name: 'Submit' }).or(page.getByRole('button', { name: 'Save' }));
  }

  private async fillIfProvided(locator: Locator, value?: string) {
    if (value !== undefined) {
      await locator.click();
      await locator.fill(value);
    }
  }

  async fillUserForm(data : Partial<UserDataInputs>) {
    if (data.role) {
      await this.roleDropdown.click();
       const roleLocators : Record<string, Locator> = {
            'SUPER_ADMIN' : this.roleOptionSuperAdmin,
                  'ADMIN' : this.roleOptionAdmin,
                     'MD' : this.roleOptionMD,
              'ASSISTANT' : this.roleOptionAssistant,
                    'IIC' : this.roleOptionIIC,
                'ACCOUNT' : this.roleOptionAccount,
                     'CS' : this.roleOptionCS
      };
      if (roleLocators[data.role]) {
        await roleLocators[data.role].click();
      }
    }
    // Base Info Fields
    await this.fillIfProvided(this.nameInput, data.name);
    await this.fillIfProvided(this.emailInput, data.email);
    await this.fillIfProvided(this.phoneInput, data.phone);
    await this.fillIfProvided(this.iicCodeInput, data.iicCode);
    await this.fillIfProvided(this.citizenIdInput, data.citizenId);
    // Address Fields
    await this.fillIfProvided(this.addressNumberInput, data.addressNumber);
    await this.fillIfProvided(this.addressMooInput, data.addressMoo);
    await this.fillIfProvided(this.addressBuildingInput, data.addressBuilding);
    await this.fillIfProvided(this.addressSoiInput, data.addressSoi);
    await this.fillIfProvided(this.addressRoadInput, data.addressRoad);
    await this.fillIfProvided(this.addressSubdistrictInput, data.addressSubdistrict);
    await this.fillIfProvided(this.addressDistrictInput, data.addressDistrict);
    await this.fillIfProvided(this.addressProvinceInput, data.addressProvince);
    await this.fillIfProvided(this.addressPostalCodeInput, data.addressPostalCode);
    // Bank Info Fields
    await this.fillIfProvided(this.bankBranchInput, data.bankBranch);
    await this.fillIfProvided(this.bankAccountNumberInput, data.bankAccountNumber);
    // VAT Dropdown
    if (data.vatOption) {
      await this.VATdropdown.click();
      if (data.vatOption === 'Yes') await this.VATOptionYes.click();
      else await this.VATOptionNo.click();
    }
    // Password Field
    await this.fillIfProvided(this.passwordInput, data.password);
  }

  async submitAndGetResourceId(expectedMethod: 'POST' | 'PUT' | 'PATCH'): Promise<string> {
    const responsePromise = this.page.waitForResponse((response) => {
      const isUserApi = response.url().includes('/api/users');
      const matchesMethod = response.request().method() === expectedMethod;
      const isSuccess = [200, 201, 204].includes(response.status());
      return isUserApi && matchesMethod && isSuccess;
    });

    await this.submitButton.click();

    const response = await responsePromise;
    const json = await response.json();

    const resourceId = json.id || json.data?.id;
    if (!resourceId) {
      throw new Error(`Could not locate resource ID in the API response: ${JSON.stringify(json)}`);
    }

    return String(resourceId);
  }
}

/**
 * TypeScript Data Structure Interface for Type-Safety & easy assertion mapping
 */
export interface UserDataInputs {
  role                : 'SUPER_ADMIN' | 'ADMIN' | 'MD' | 'ASSISTANT' | 'IIC' | 'ACCOUNTANT' | 'CUSTOMER_SUPPORT';
  name                : string;
  email               : string;
  phone               : string;
  iicCode             : string;
  citizenId           : string;
  addressNumber?      : string;
  addressMoo?         : string;
  addressBuilding?    : string;
  addressSoi?         : string;
  addressRoad?        : string;
  addressSubdistrict? : string;
  addressDistrict?    : string;
  addressProvince?    : string;
  addressPostalCode?  : string;
  bankBranch?         : string;
  bankAccountNumber?  : string;
  vatOption?          : 'Yes' | 'No';
  password?           : string;
}
