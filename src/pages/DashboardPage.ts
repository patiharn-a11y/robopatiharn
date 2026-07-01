// src/pages/DashboardPage.ts
import { Page } from '@playwright/test';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';

export class DashboardPage {
  readonly page    : Page;
  readonly header  : Header;
  readonly sidebar : Sidebar;

  constructor(page : Page) {
    this.page    = page;
    this.header  = new Header(page);
    this.sidebar = new Sidebar(page, this.header);
  }
}