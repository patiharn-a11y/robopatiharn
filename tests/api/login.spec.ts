// tests/api/login.spec.ts
import { test, expect } from '@playwright/test';
import { AuthApi, BASE_URL } from '../../src/api/auth/AuthApi';

test.describe('Login API', () => {
  let authApi: AuthApi;

  // request fixture keeps its own cookie jar for the duration of each test,
  // so the session cookie set by the credentials callback carries over automatically.
  test.beforeEach(async ({ request }) => {
    authApi = new AuthApi(request);
  });

  test('TC-01 ตรวจสอบว่าสามารถ Login ผ่าน API ด้วย Account Super Admin ได้', async () => {
    await test.step('1. Login ด้วยรหัสที่ถูกต้องของ Super Admin ผ่าน /api/auth/callback/credentials', async () => {
      const res = await authApi.login(process.env.SUPERADMIN_USERNAME!, process.env.SUPERADMIN_PASSWORD!);

      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.url).toBe(`${BASE_URL}/dashboard`);
    });

    await test.step('2. Expected: /api/auth/session คืนค่า session ของผู้ใช้ที่ login สำเร็จ', async () => {
      const session = await authApi.getSession();
      expect(session.user).toBeTruthy();
    });
  });

  test('TC-02 ตรวจสอบว่า Login ไม่สำเร็จเมื่อกรอก Username ที่ไม่มีอยู่', async () => {
    await test.step('1. Login ด้วย Username มั่วๆ ผ่าน /api/auth/callback/credentials', async () => {
      const res = await authApi.login('usermuamua', 'passwordmuamua');

      expect(res.status()).toBe(401);
      const body = await res.json();
      expect(body.url).toContain('/api/auth/error');
      expect(body.url).toContain('error=Invalid');
    });

    await test.step('2. Expected: /api/auth/session ไม่มี session ของผู้ใช้', async () => {
      const session = await authApi.getSession();
      expect(session.user).toBeUndefined();
    });
  });

  test('TC-03 ตรวจสอบว่า Login ไม่สำเร็จเมื่อกรอก Password ผิด', async () => {
    await test.step('1. Login ด้วย Password ผิด ผ่าน /api/auth/callback/credentials', async () => {
      const res = await authApi.login(process.env.SUPERADMIN_USERNAME!, 'passwordmuamua');

      expect(res.status()).toBe(401);
      const body = await res.json();
      expect(body.url).toContain('/api/auth/error');
      expect(body.url).toContain('error=Invalid');
    });

    await test.step('2. Expected: /api/auth/session ไม่มี session ของผู้ใช้', async () => {
      const session = await authApi.getSession();
      expect(session.user).toBeUndefined();
    });
  });
});
