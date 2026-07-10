// src/pages/UserManagementPage.ts
import { Page, Locator, expect } from '@playwright/test';
import { Header } from '../../components/Header';
import { Sidebar } from '../../components/Sidebar';
import { CreateUserPage } from './CreateUserPage';

export class UserManagementPage {
  readonly page                             : Page;

  // Components
  readonly header                           : Header;
  readonly sidebar                          : Sidebar;
  readonly createUserPage                   : CreateUserPage;

  // Headers
  readonly userManagementHeader             : Locator;
  readonly breadcrumbs                      : Locator;

  // Filters
  readonly searchBar                        : Locator;
  readonly permissionButton                 : Locator;
  readonly createUserButton                 : Locator;

  // Tabs
  readonly iicUsersTab                      : Locator;
  readonly indegoSalesTab                   : Locator;
  readonly executiveTab                     : Locator;
  readonly othersTab                        : Locator;
  readonly inactiveTab                      : Locator;

  // IIC Users Table
  readonly userTableHeader                  : Locator;
  readonly userTableFirstRowActionButtons   : Locator;
  readonly userTableActionOptionsView       : Locator;
  readonly userTableActionOptionsEdit       : Locator;
  readonly userTableActionOptionsPermission : Locator;

  constructor(page: Page) {
    this.page                             = page;

    // Components
    this.header                           = new Header(page);
    this.sidebar                          = new Sidebar(page, this.header);
    this.createUserPage                   = new CreateUserPage(page);

    // Headers
    this.userManagementHeader             = page.getByText('Users', { exact: true });
    this.breadcrumbs                      = page.getByRole('navigation', { name: 'Breadcrumb' });

    // Filters
    this.searchBar                        = page.getByPlaceholder('ค้นหา...');
    this.permissionButton                 = page.getByRole('button', { name: 'Permissions' });
    this.createUserButton                 = page.getByRole('button', { name: 'Create User' });

    // Tabs
    this.iicUsersTab                      = page.getByRole('tab', { name: 'IIC' });
    this.indegoSalesTab                   = page.getByRole('tab', { name: 'INDEGO Sales' });
    this.executiveTab                     = page.getByRole('tab', { name: 'Executive' });
    this.othersTab                        = page.getByRole('tab', { name: 'Others' });
    this.inactiveTab                      = page.getByRole('tab', { name: 'Inactive' });

    // Users Table
    this.userTableHeader                  = page.getByText('Users', { exact: true });
    this.userTableFirstRowActionButtons   = page.getByRole('button', { name: 'Open menu' }).first();
    this.userTableActionOptionsView       = page.getByRole('menuitem', { name: 'View' });
    this.userTableActionOptionsEdit       = page.getByRole('menuitem', { name: 'Edit' });
    this.userTableActionOptionsPermission = page.getByRole('menuitem', { name: 'Permission' });
  }

  async navigateTo() {
    await this.sidebar.sidebarOpen();
    await this.sidebar.userManagementButton.click();
    await expect(this.userManagementHeader).toBeVisible();
  }

  async openEditForUser(email: string) {
    await this.searchBar.fill(email);
    await this.page.keyboard.press('Enter');

    const rowMenu = this.page.locator('tr').filter({ hasText: email }).getByRole('button', { name: 'Open menu' });
    await rowMenu.click();
    await this.userTableActionOptionsEdit.click();
  }
}
