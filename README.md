# IIC Portal — Automated Test Suite

ชุด Automated Test สำหรับ IIC Portal เขียนด้วย [Playwright](https://playwright.dev/) และ TypeScript
ทดสอบระบบ Permission, Login, User Management และ Audit Log โดยใช้ Browser จริง (Chrome)

---

## สารบัญ

1. [ต้องติดตั้งอะไรบ้าง](#ต้องติดตั้งอะไรบ้าง)
2. [วิธี Setup โปรเจคครั้งแรก](#วิธี-setup-โปรเจคครั้งแรก)
3. [ตั้งค่า Environment Variables (.env)](#ตั้งค่า-environment-variables-env)
4. [วิธีรัน Test](#วิธีรัน-test)
5. [API Test คืออะไร](#api-test-คืออะไร)
6. [โครงสร้างโปรเจค](#โครงสร้างโปรเจค)
7. [Test Data คืออะไร และแก้ไขยังไง](#test-data-คืออะไร-และแก้ไขยังไง)
8. [เมื่อ Website เปลี่ยน ต้องทำอะไรบ้าง](#เมื่อ-website-เปลี่ยน-ต้องทำอะไรบ้าง)
9. [วิธีเพิ่ม Test ใหม่](#วิธีเพิ่ม-test-ใหม่)
10. [ดู Report หลังรัน Test](#ดู-report-หลังรัน-test)

---

## ต้องติดตั้งอะไรบ้าง

| สิ่งที่ต้องมี | ตรวจสอบ | ดาวน์โหลด |
|---|---|---|
| **Node.js** (v18 ขึ้นไป) | รัน `node -v` ใน Terminal | https://nodejs.org |
| **Git** | รัน `git -v` ใน Terminal | https://git-scm.com |
| **VS Code** (แนะนำ) | — | https://code.visualstudio.com |

> Playwright และ TypeScript **ไม่ต้องติดตั้งแยก** — จะติดตั้งอัตโนมัติในขั้นตอน Setup

---

## วิธี Setup โปรเจคครั้งแรก

เปิด Terminal แล้วรันทีละบรรทัด:

```bash
# 1. Clone โปรเจคลงเครื่อง
git clone https://github.com/patiharn-a11y/robopatiharn.git
cd robopatiharn

# 2. ติดตั้ง dependencies ทั้งหมด (รวม Playwright และ TypeScript)
npm install

# 3. ติดตั้ง Browser ที่ Playwright ใช้รัน Test
npx playwright install
```

ถ้าติดตั้งสำเร็จจะไม่มี Error ใน Terminal

---

## ตั้งค่า Environment Variables (.env)

โปรเจคนี้ต้องมีไฟล์ `.env` ที่ root ของโปรเจค (ข้างๆ ไฟล์ `package.json`)
ไฟล์นี้เก็บ username/password ของ account ที่ใช้ในการ test **ไม่ถูก commit ขึ้น GitHub เพื่อความปลอดภัย**

### วิธีที่ 1: Copy จาก `.env.example` (แนะนำ)

โปรเจคนี้มีไฟล์ `.env.example` เป็น template ให้อยู่แล้วที่ root ของโปรเจค รันคำสั่งนี้เพื่อ copy เป็น `.env`:

```bash
cp .env.example .env
```

จากนั้นเปิดไฟล์ `.env` ที่เพิ่งสร้าง แล้วแก้ค่า `"your_email_here"` / `"your_password_here"` ของแต่ละตัวแปรให้เป็น credentials จริง

### วิธีที่ 2: สร้างไฟล์เองด้วยมือ

สร้างไฟล์ชื่อ `.env` แล้ว copy format นี้ไปใส่ (แก้ค่าให้ตรงกับ environment จริง):

```env
# Super Admin Account หลัก (ใช้สำหรับ Preset tests)
SUPERADMIN_USERNAME=your_superadmin@email.com
SUPERADMIN_PASSWORD=your_password

# Super Admin Account ที่ 2 (ใช้สำหรับ individual permission tests — รันพร้อมกับ Account หลักได้)
SUPERADMIN2_USERNAME=your_superadmin2@email.com
SUPERADMIN2_PASSWORD=your_password

# IIC Account (ใช้สำหรับ other-role permission tests)
IIC_USERNAME=your_iic@email.com
IIC_PASSWORD=your_password

# MD Account (ใช้สำหรับ other-role individual permission tests — รันพร้อมกับ IIC Account ได้)
MD_USERNAME=your_md@email.com
MD_PASSWORD=your_password
```

> ถ้าขอ credentials ไม่ได้ ให้ติดต่อเจ้าของโปรเจคเพื่อขอไฟล์ `.env` มาใช้โดยตรง

---

## วิธีรัน Test

```bash
# รัน Test ทั้งหมด (จะรัน 2 ไฟล์พร้อมกัน)
npx playwright test

# รัน Test ไฟล์ใดไฟล์หนึ่ง
npx playwright test tests/user-permission/user-permission-admin.spec.ts

# รัน Test แบบเห็น Browser เปิดขึ้นมา (มีประโยชน์ตอน debug)
npx playwright test --headed

# รัน Test แล้วเปิด Report ทันที
npx playwright test --reporter=html && npx playwright show-report
```

### การตั้งค่า Workers (ความเร็วในการรัน)

ใน `playwright.config.ts` มีการตั้ง `workers: 4` ซึ่งหมายความว่า:
- **Worker 1** → `user-permission-admin.spec.ts` (Admin Preset tests — ใช้ `SUPERADMIN_USERNAME`)
- **Worker 2** → `user-permission-admin-permissions.spec.ts` (Admin individual permission tests — ใช้ `SUPERADMIN2_USERNAME`)
- **Worker 3** → `user-permission-other.spec.ts` (Other Role Preset tests — ใช้ `SUPERADMIN_USERNAME` + `IIC_USERNAME`)
- **Worker 4** → `user-permission-other-permissions.spec.ts` (Other Role individual permission tests — ใช้ `SUPERADMIN2_USERNAME` + `MD_USERNAME`)
- ทั้งสี่รันพร้อมกัน ประหยัดเวลา และแต่ละ Worker ใช้ account คนละตัวจึงไม่ชนกัน

---

## API Test คืออะไร

นอกจาก Test ที่รัน Browser จริงแล้ว โปรเจคนี้มี **API Test** ที่ยิง Request ตรงไปที่ Backend โดยไม่เปิด Browser
ทำให้รันได้เร็วกว่ามากและไม่ Flaky เหมาะสำหรับอินเตอร์เน็ตออฟฟิศที่ "เร็วแบบใช้งานได้อยู่"

### ไฟล์ `tests/api/login.spec.ts`

ทดสอบ NextAuth credentials login ผ่าน `/api/auth/callback/credentials` และ `/api/auth/session` โดยใช้ตัวช่วย `AuthApi` ที่ `src/api/auth/AuthApi.ts`

| Test Case | ตรวจสอบอะไร |
|---|---|
| **TC-01** | Login ด้วย Account Super Admin ที่ถูกต้อง → ได้ status 200, redirect ไป `/dashboard`, และ `/api/auth/session` คืนค่า user |
| **TC-02** | Login ด้วย Username ที่ไม่มีอยู่ → ได้ status 401 และ error `Invalid` และ session ไม่มี user |
| **TC-03** | Login ด้วย Password ผิด → ได้ status 401 และ error `Invalid` และ session ไม่มี user |

รันเฉพาะไฟล์นี้ได้ด้วยคำสั่ง:

```bash
npx playwright test tests/api/login.spec.ts
```

> `request` fixture ของ Playwright เก็บ cookie jar แยกต่างหากในแต่ละ Test ทำให้ session cookie ที่ได้จาก login carry over ไปใช้ตรวจสอบ `/api/auth/session` ต่อได้อัตโนมัติ โดยไม่ต้องเปิด Browser

---

## โครงสร้างโปรเจค

```
iicportal-test/
│
├── tests/                          ← ไฟล์ Test ทั้งหมดอยู่ที่นี่
│   ├── login/
│   │   └── login.spec.ts           ← Test การ Login
│   ├── user-management/
│   │   └── create-user.spec.ts     ← Test การสร้าง User
│   ├── audit-log/
│   │   └── audit-log-user-management.spec.ts
│   ├── user-permission/
│   │   ├── user-permission-admin.spec.ts   ← Permission tests สำหรับ Super Admin (TC-01 ถึง TC-20 + Presets)
│   │   └── user-permission-other.spec.ts   ← Permission tests สำหรับ Other Role (TC-01 ถึง TC-20 + Presets)
│   └── api/
│       └── login.spec.ts           ← API Test สำหรับ Login (TC-01 ถึง TC-03, ไม่เปิด Browser)
│
├── src/                            ← Page Objects (ตัวช่วยควบคุม Browser) และ API Helpers
│   ├── components/
│   │   ├── Header.ts               ← ส่วน Header และปุ่ม Logout
│   │   └── Sidebar.ts              ← เมนู Sidebar และการ verify
│   ├── api/
│   │   └── auth/
│   │       └── AuthApi.ts          ← ตัวช่วยยิง Login/Session ผ่าน API โดยตรง
│   └── pages/
│       ├── auth/
│       │   └── LoginPage.ts        ← หน้า Login
│       ├── customers/
│       │   ├── CustomersPage.ts    ← หน้ารายชื่อ Customers (search, expand, navigate)
│       │   └── CustomersDetailPage.ts  ← หน้า Customer Detail (tabs)
│       ├── user-management/
│       │   ├── UserManagementPage.ts
│       │   └── CreateUserPage.ts
│       ├── PermissionSettingPage.ts
│       ├── IncomesPage.ts
│       ├── InvoicesPage.ts
│       ├── DashboardPage.ts
│       └── AdminAuditLogsPage.ts
│
├── test-data/                      ← ข้อมูลที่ใช้ใน Test
│   ├── customerData.ts             ← ข้อมูล Customer (ชื่อ, Account Number)
│   └── userData.ts                 ← ข้อมูล User อื่นๆ
│
├── specs/                          ← เอกสาร Test Plan (อ่านเข้าใจ scope ได้)
│   ├── user-permission-plan.md
│   └── login-test-plan.md
│
├── .env                            ← Username/Password (ไม่ถูก commit — ต้องสร้างเอง)
├── .env.example                    ← Template ของ .env (commit ได้ ไม่มีค่าจริง)
├── playwright.config.ts            ← การตั้งค่า Playwright ทั้งหมด
└── package.json                    ← รายการ dependencies
```

### Page Object คืออะไร?

แทนที่จะเขียนโค้ดคลิก/กรอกข้อมูลซ้ำๆ ในทุก Test โปรเจคนี้ใช้แนวคิด **Page Object Model (POM)**

> คิดง่ายๆ ว่า: แต่ละหน้าของ Website จะมีไฟล์ `.ts` ของมันเอง ทำหน้าที่เป็น "คนควบคุม" หน้านั้น
> Test file แค่เรียกใช้งาน เช่น `customersPage.searchAndNavigate(...)` แทนที่จะเขียนโค้ดคลิกเองทุกครั้ง

---

## Test Data คืออะไร และแก้ไขยังไง

ไฟล์ `test-data/customerData.ts` เก็บข้อมูล Customer ที่ใช้ใน Test

```typescript
export const Customers = {
  VulnerableWeasley: {
    name: "วัลเนอราเบิ้ล วีสลีย์",   // ชื่อที่แสดงบน Website
    accountNumber1: "ROBO2667433",    // Account ID แรก
    // accountNumber2: "..."          // ถ้ามี 2 Account ให้ uncomment บรรทัดนี้
  },
  Hermione: {
    name: "เฮอร์ไมโอนี่ เกรนเจอร์",
    accountNumber1: "FIN0171918",
  }
};
```

### กรณีที่ต้องแก้ไข customerData.ts

| สถานการณ์ | วิธีแก้ |
|---|---|
| Customer เปลี่ยนชื่อบน Website | แก้ค่า `name` ให้ตรง |
| Account Number เปลี่ยน | แก้ค่า `accountNumber1` |
| Customer มี 2 Account | เพิ่ม `accountNumber2: "..."` |
| Customer เหลือ 1 Account | ลบบรรทัด `accountNumber2` ออก |

> โปรเจคนี้ออกแบบมาให้ **อ่านจาก `customerData.ts` เป็นหลัก** ไม่มีการ detect จาก Browser
> ดังนั้นถ้า Website เปลี่ยนข้อมูล Customer ต้องมาอัพเดทไฟล์นี้ด้วยทุกครั้ง

---

## เมื่อ Website เปลี่ยน ต้องทำอะไรบ้าง

### 1. Customer ข้อมูลเปลี่ยน
แก้ไขที่ `test-data/customerData.ts` ตามตารางด้านบน

### 2. Test ล้มเหลวเพราะ Element หาไม่เจอ (เช่น ปุ่มเปลี่ยนตำแหน่ง)
ไปแก้ที่ไฟล์ Page Object ใน `src/pages/` ที่ตรงกับหน้าที่มีปัญหา
- หา `getByTestId(...)` หรือ `getByRole(...)` ที่ไม่ถูกต้อง แล้วแก้ให้ตรงกับ Website ปัจจุบัน

### 3. เพิ่ม Permission ใหม่บน Website
- เพิ่ม Test Case ใหม่ใน `user-permission-admin.spec.ts` และ `user-permission-other.spec.ts`
- อัพเดทเมธอด `verifyVisibleAllExcept(...)` หรือ `verifyVisibleAllTabExcept(...)` ใน Page Object ที่เกี่ยวข้อง

---

## วิธีเพิ่ม Test ใหม่

### กรณีทีมเพิ่ม Feature ใหม่ที่มี Permission (ตัวอย่าง: เพิ่มเมนู "Fund Performance")

การเพิ่ม Test Case เฉยๆ **ไม่พอ** ถ้า Feature ใหม่มาพร้อม Permission และเมนูใน Sidebar
เพราะ `grantAllExcept(...)` และ `verifyVisibleAllExcept(...)` ทำงานจาก Locator ที่ประกาศไว้ล่วงหน้าเท่านั้น — ถ้าไม่เพิ่ม Locator ใหม่เข้าไปก่อน Function จะไม่รู้จักเมนู/permission ตัวใหม่เลย แม้จะเพิ่ม Test Case ไปแล้วก็ตาม

สมมติทีม Dev เพิ่มเมนูใหม่ชื่อ **Fund Performance** พร้อม `data-testid="sidebar-menu-item-fund-performance"` และ permission checkbox `data-testid="permission-checkbox-fundPerformance"` (มีลูก `.view`) ขั้นตอนที่ QA ต้องทำมีดังนี้:

**1. เพิ่ม Locator ของเมนูใหม่ใน `src/components/Sidebar.ts`**

```typescript
// ในส่วน constructor
readonly fundPerformanceButton: Locator;
// ...
this.fundPerformanceButton = page.getByTestId("sidebar-menu-item-fund-performance");
```

แล้วเพิ่ม key เข้า `menuItemKeys` และ `menuItems` (ไม่เพิ่ม 2 จุดนี้ `verifyVisibleAllExcept(...)` จะไม่มีวันเช็คเมนูนี้ให้):

```typescript
private get menuItemKeys() {
  return [
    "customersDetail",
    "customersPage",
    // ...keys เดิมก่อนหน้า
    "fundPerformance", // ← เพิ่มบรรทัดนี้
  ] as const;
}

private get menuItems(): Record<string, Locator> {
  return {
    // ...items เดิม
    fundPerformance: this.fundPerformanceButton, // ← เพิ่มบรรทัดนี้
  };
}
```

**2. เพิ่ม Permission Path ใหม่ใน `src/pages/PermissionSettingPage.ts`**

เพิ่มเข้า type `PermissionPath` และเพิ่ม Locator ในของ `permissions` getter (ไม่เพิ่มจุดนี้ `grantAllExcept(...)` จะหา path ไม่เจอและ throw error `Permission path not found`):

```typescript
export type PermissionPath =
  | 'dashboard'
  // ...paths เดิม
  | 'fundPerformance'; // ← เพิ่มบรรทัดนี้

get permissions() {
  return {
    // ...permissions เดิม
    fundPerformance: {  // ← เพิ่ม permission nested
      folder : this.getKey('permission-checkbox-fundPerformance'), // ← ตรงกับ data-testId ที่ dev ใส่มาให้ใน class
      view   : this.getKey('permission-checkbox-fundPerformance.view'),
    },
  }
}
```

**3. เพิ่ม Test Case ใน `user-permission-admin-permissions.spec.ts` และ `user-permission-other-permissions.spec.ts`**

ตอนนี้ `fundPerformance` เป็น key/path ที่ใช้งานได้แล้ว จึงเพิ่ม Test Case ตามปกติ:

```typescript
test('TC-22 ตรวจสอบว่า Super Admin ที่ไม่มีสิทธิ์ Fund Performance จะไม่เห็นเมนู Fund Performance', async ({ page }) => {
  await test.step('1. ไม่ให้สิทธิ์ Fund Performance', async () => {
    await permissionSettingPage.grantAllExcept(['fundPerformance']);
  });
  await test.step('2. Expected: ไม่เห็นเมนู Fund Performance ที่แท็บ Sidebar', async () => {
    await sidebar.verifyVisibleAllExcept(['fundPerformance']);
  });
});
```

**4. แก้ไข Preset ทั้งหมดที่มีการเปลี่ยนแปลง**

เมนูใหม่จะเข้าไปอยู่ใน `menuItems` ของ `Sidebar.ts` ทันที (จากข้อ 1) ซึ่งแปลว่า **ทุก** Test ที่เรียก `verifyVisibleAllExcept(...)` หรือ `verifyVisibleAllExceptForNonAdmin(...)` จะถูกกระทบไปด้วย — รวมถึง Test ของ Preset ที่มีอยู่แล้วใน `user-permission-admin-preset.spec.ts` และ `user-permission-other-preset.spec.ts` เพราะเมนูใหม่จะถูกคาดหวังว่า "เห็น" โดย default ถ้าไม่ใส่ key ไว้ใน array ที่ซ่อน

QA ต้องไปคุยกับทีม Dev/Product ก่อนว่า **Preset ไหนควรเห็น Fund Performance บ้าง** แล้วไปแก้ Test ของ Preset นั้นๆ ให้ตรงกับพฤติกรรมจริงบน Website สมมติทีมตัดสินใจว่า:

- **Admin / Super Admin** → ควรเห็น Fund Performance (ไม่ต้องแก้อะไร เพราะ default ของ `verifyVisibleAllExcept([])` คือเห็นทุกเมนูอยู่แล้ว)
- **IIC** → **ไม่ควร**เห็น Fund Performance

ก็ต้องไปแก้ Assertion ของ Preset IIC ทั้ง 2 ไฟล์ ให้เพิ่ม `'fundPerformance'` เข้าไปใน array ที่ซ่อน:

```typescript
// user-permission-admin-preset.spec.ts — TC-015 (Preset IIC บน Account ตัวเอง)
await test.step('2. Expected: เห็น Sidebar Menu ตาม Preset IIC', async () => {
-  await sidebar.verifyVisibleAllExcept(['invoices']);
+  await sidebar.verifyVisibleAllExcept(['invoices', 'fundPerformance']);
});
```

```typescript
// user-permission-other-preset.spec.ts — TC-042 (Preset IIC บน Other Role)
await test.step('2. Expected: เห็น Sidebar Menu ตาม Preset IIC', async () => {
-  await sidebar.verifyVisibleAllExceptForNonAdmin(['invoices']);
+  await sidebar.verifyVisibleAllExceptForNonAdmin(['invoices', 'fundPerformance']);
});
```

> ต้องไล่เช็คทีละ Preset (Super Admin, Admin, MD, Assistant, IIC, Accountant, Indego Sales) ว่าแต่ละตัวควรเห็นเมนูใหม่หรือไม่ — ถ้าข้าม Preset ไหนไป Test ของ Preset นั้นจะ fail ทันทีตอนรันจริง (เพราะ Sidebar แสดงเมนูใหม่ แต่ Test ไม่รู้ว่าต้องคาดหวังแบบนั้น)

> **สรุปสั้นๆ:** เพิ่ม Feature ใหม่ที่มี Permission = เพิ่ม Locator ใน `Sidebar.ts` (ข้อ 1) + เพิ่ม Permission Path ใน `PermissionSettingPage.ts` (ข้อ 2) + เพิ่ม Test Case ในไฟล์ `.spec.ts` (ข้อ 3) + ไล่แก้ Assertion ของทุก Preset ที่ได้รับผลกระทบ (ข้อ 4) เรียงตามลำดับ ข้ามข้อ 1 หรือ 2 ไปแล้ว Test Case ใหม่จะ error ทันทีตอนรัน ส่วนข้ามข้อ 4 จะทำให้ Test ของ Preset เดิม fail เพราะเห็นเมนูที่ไม่ได้คาดไว้

### ถ้าต้องการ Test หน้าใหม่ที่ยังไม่มี Page Object

1. สร้างไฟล์ใหม่ใน `src/pages/` เช่น `src/pages/NewPage.ts`
2. ดูโครงสร้างจาก `src/pages/IncomesPage.ts` เป็นตัวอย่าง
3. Import และใช้งานใน Test file

---

## ดู Report หลังรัน Test

หลังรัน Test จะมีโฟลเดอร์ `playwright-report/` สร้างขึ้นมาอัตโนมัติ

```bash
# เปิด Report ใน Browser
npx playwright show-report
```

Report จะแสดง:
- Test ไหนผ่าน / ไม่ผ่าน
- Screenshot ณ จุดที่ Test ล้มเหลว
- Timeline ของแต่ละ `test.step`
- Trace (วิดีโอย้อนดูการทำงานของ Browser ได้)

---

## GitHub Actions (CI)

โปรเจคนี้มีการตั้งค่า GitHub Actions ไว้ที่ `.github/workflows/playwright.yml`
ทุกครั้งที่ push code หรือเปิด Pull Request ขึ้น branch `main` จะรัน Test อัตโนมัติบน GitHub

> **หมายเหตุ:** GitHub Actions ต้องการ Environment Variables เหมือนกัน
> ต้องไปตั้งค่า Secrets ที่ GitHub Repository → Settings → Secrets and variables → Actions
> แล้วเพิ่มตัวแปรเดียวกับในไฟล์ `.env`
