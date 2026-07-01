// src/pages/LoginPage.ts
import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {

  readonly page            : Page;
  readonly usernameInput   : Locator;
  readonly passwordInput   : Locator;
  readonly loginButton     : Locator;
  readonly errorMessage    : Locator;
  readonly lineLoginButton : Locator;

  constructor(page: Page) {
    
    this.page            = page;
    this.usernameInput   = page.getByTestId('login-input-username');
    this.passwordInput   = page.getByTestId('login-input-password');
    this.loginButton     = page.getByTestId('login-btn-submit');
    this.errorMessage    = page.getByTestId('login-error');
    this.lineLoginButton = page.getByTestId('login-btn-line');
  }

  // Function Login รับ 2 Arguments Username และ Password
  // สามารถเรียกใช้ Credential ที่อยู่ใน .env เพื่อความปลอดภัย
  // โดยประกาศตัวแปร ตัวอย่าง const username = process.env.SUPERADMIN_USERNAME!;
  // ก่อนที่จะใช้ใน Function เช่น await loginPage.login(username);
  async login(user: string, pass: string) {
    await this.page.goto('https://iicportal-uat.robodev.co/login');
    await this.usernameInput.fill(user, {mask: true} as any);
    await this.passwordInput.fill(pass, {mask: true} as any);
    await this.loginButton.click();
  }

}