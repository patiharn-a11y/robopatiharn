// src/components/Header.ts
import { Page, Locator } from '@playwright/test';

export class Header {
  readonly page            : Page;
  readonly homeButton      : Locator;
  readonly logoutButton    : Locator;
  readonly hamburgerButton : Locator;

  constructor(page: Page) {
  this.page            = page;

  this.homeButton      = page.getByRole('link', { name: 'IIC Logo Robowealth' });
  this.logoutButton    = page.getByRole('button', { name: 'Log out' });
  this.hamburgerButton = page.getByTestId('sheet-menu-hamburger-btn');
  }

  getUserAvatarDropdown(username: string): Locator {
    return this.page.getByText(username, { exact: true });
    }

  async logout(username: string) {
    await this.page.goto('https://iicportal-uat.robodev.co/login');
    // รอ Dev ใส่ Test ID ใน Logout Button ตอนนี่้ Logout โดย Direct url ไปก่อน
    // await this.getUserAvatarDropdown(username).click();
    // await this.logoutButton.click();
    // await this.homeButton.click();
  }
}