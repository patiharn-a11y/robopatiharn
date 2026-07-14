// src/api/auth/AuthApi.ts
import { APIRequestContext, APIResponse } from '@playwright/test';

export const BASE_URL = 'https://iicportal-uat.robodev.co';

export class AuthApi {

  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async getCsrfToken(): Promise<string> {
    const res = await this.request.get(`${BASE_URL}/api/auth/csrf`);
    const { csrfToken } = await res.json();
    return csrfToken;
  }

  // Login รับ 2 Arguments Username และ Password ผ่าน NextAuth credentials callback
  // สามารถเรียกใช้ Credential ที่อยู่ใน .env เพื่อความปลอดภัย เช่นเดียวกับ LoginPage.login()
  async login(username: string, password: string): Promise<APIResponse> {
    const csrfToken = await this.getCsrfToken();

    return this.request.post(`${BASE_URL}/api/auth/callback/credentials`, {
      form: {
        username,
        password,
        csrfToken,
        callbackUrl: `${BASE_URL}/dashboard`,
        json: 'true',
      },
    });
  }

  async getSession(): Promise<{ user?: Record<string, unknown> }> {
    const res = await this.request.get(`${BASE_URL}/api/auth/session`);
    return res.json();
  }

}
