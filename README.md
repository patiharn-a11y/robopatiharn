# IIC Portal — Automated Test Suite

ชุด Automated Test สำหรับ IIC Portal เขียนด้วย [Playwright](https://playwright.dev/) และ TypeScript
ทดสอบระบบ Permission, Login, User Management และ Audit Log โดยใช้ Browser จริง (Chrome)

---

## สารบัญ

1. [ต้องติดตั้งอะไรบ้าง](#ต้องติดตั้งอะไรบ้าง)
2. [วิธี Setup โปรเจคครั้งแรก](#วิธี-setup-โปรเจคครั้งแรก)
3. [ตั้งค่า Environment Variables (.env)](#ตั้งค่า-environment-variables-env)
4. [วิธีรัน Test](#วิธีรัน-test)
5. [โครงสร้างโปรเจค](#โครงสร้างโปรเจค)
6. [Test Data คืออะไร และแก้ไขยังไง](#test-data-คืออะไร-และแก้ไขยังไง)
7. [เมื่อ Website เปลี่ยน ต้องทำอะไรบ้าง](#เมื่อ-website-เปลี่ยน-ต้องทำอะไรบ้าง)
8. [วิธีเพิ่ม Test ใหม่](#วิธีเพิ่ม-test-ใหม่)
9. [ดู Report หลังรัน Test](#ดู-report-หลังรัน-test)

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

สร้างไฟล์ชื่อ `.env` แล้ว copy format นี้ไปใส่ (แก้ค่าให้ตรงกับ environment จริง):

```env
# Super Admin Account (ใช้สำหรับ admin permission tests)
SUPERADMIN_USERNAME=your_superadmin@email.com
SUPERADMIN_PASSWORD=your_password

# IIC Account (ใช้สำหรับ other-role permission tests)
IIC_USERNAME=your_iic@email.com
IIC_PASSWORD=your_password

# Accounts อื่นๆ ที่ใช้ใน tests
ADMIN_USERNAME=your_admin@email.com
ADMIN_PASSWORD=your_password

MD_USERNAME=your_md@email.com
MD_PASSWORD=your_password

ASSISTANT_USERNAME=your_assistant@email.com
ASSISTANT_PASSWORD=your_password

ACCOUNTANT_USERNAME=your_accountant@email.com
ACCOUNTANT_PASSWORD=your_password

CUSTOMERSUPPORT_USERNAME=your_cs@email.com
CUSTOMERSUPPORT_PASSWORD=your_password

CHAEYOUNG_USERNAME=your_iic2@email.com
CHAEYOUNG_PASSWORD=your_password

TZUYU_USERNAME=your_superadmin2@email.com
TZUYU_PASSWORD=your_password
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

ใน `playwright.config.ts` มีการตั้ง `workers: 2` ซึ่งหมายความว่า:
- Test ของ **Super Admin** จะรันบน Browser หน้าต่างที่ 1
- Test ของ **Other Role** จะรันบน Browser หน้าต่างที่ 2
- ทั้งสองรันพร้อมกัน ประหยัดเวลา

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
│   └── user-permission/
│       ├── user-permission-admin.spec.ts   ← Permission tests สำหรับ Super Admin (TC-01 ถึง TC-20 + Presets)
│       └── user-permission-other.spec.ts   ← Permission tests สำหรับ Other Role (TC-01 ถึง TC-20 + Presets)
│
├── src/                            ← Page Objects (ตัวช่วยควบคุม Browser)
│   ├── components/
│   │   ├── Header.ts               ← ส่วน Header และปุ่ม Logout
│   │   └── Sidebar.ts              ← เมนู Sidebar และการ verify
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
  RonWeasley: {
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

ตัวอย่างการเพิ่ม Test Case ใน `user-permission-admin.spec.ts`:

```typescript
test('TC-21 ตรวจสอบว่า Super Admin ที่ไม่มีสิทธิ์ XYZ จะไม่เห็น...', async ({ page }) => {
  await test.step('1. ไม่ให้สิทธิ์ XYZ', async () => {
    await permissionSettingPage.grantAllExcept(['xyz']);
  });
  await test.step('2. Expected: ไม่เห็น...', async () => {
    await sidebar.verifyVisibleAllExcept(['xyz']);
  });
});
```

> `test.step(...)` ไม่ได้มีผลต่อการทำงาน แต่ทำให้ Report อ่านง่ายขึ้น
> ชื่อ step จะแสดงในหน้า Report เมื่อ Test ล้มเหลว

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
