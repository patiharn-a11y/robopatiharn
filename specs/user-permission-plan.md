# User Permission Visibility and Data Prevention Test Plan

## Application Overview

Robowealth IIC Portal enforces authorization per user, not per role. SUPER_ADMIN is the default full-access baseline. This plan focuses on verifying that missing permissions hide menus, block direct navigation, and suppress protected data across the portal.

## Test Scenarios

### 1. User Permission Visibility

**Seed:** `tests/seed.spec.ts`

#### 1.1. SUPER_ADMIN sees all permitted navigation and data by default

**File:** `tests/user-permission/super-admin-default-access.spec.ts`

**Steps:**
  1. Log in with a SUPER_ADMIN user and land on the dashboard.
    - expect: Dashboard loads successfully.
    - expect: All top-level menu groups and primary navigation entries are visible.
    - expect: Dashboard summary cards and customer/fund widgets render data instead of empty placeholders.
  2. Open key pages from the sidebar, including Customers, Funds, Transactions, Income Overview, Calendar, Users Management, Admin Audit Logs, and Invoices.
    - expect: Each permitted page opens without a forbidden state.
    - expect: Page-specific data tables or summaries render for the SUPER_ADMIN user.
    - expect: No hidden-menu placeholders or access-denied banners appear for default-access pages.

#### 1.2. Same role, different users, different permissions

**File:** `tests/user-permission/per-user-permission-vs-role.spec.ts`

**Steps:**
  1. Use two users with the same role but different permission sets, then sign in as the first user.
    - expect: The first user lands on the portal normally.
    - expect: Only the menus granted to that specific user are shown.
  2. Sign out and sign in as the second user with the same role.
    - expect: The second user shows a different set of visible menus or pages if their grants differ.
    - expect: The UI does not rely on role name alone to decide visibility.
  3. Compare a granted page and a denied page between the two users.
    - expect: The granted page is accessible only to the user with the relevant permission.
    - expect: The denied page is hidden or blocked for the user without the permission.

#### 1.3. Missing menu permissions hide navigation entries

**File:** `tests/user-permission/menu-visibility.spec.ts`

**Steps:**
  1. Sign in as a user missing at least one page permission, such as Users Management or Admin Audit Logs.
    - expect: The corresponding sidebar menu entry is not visible.
    - expect: The rest of the permitted navigation remains available.
  2. Check both standalone links and expandable sections in the sidebar.
    - expect: Disabled or unauthorized sections do not expose child items.
    - expect: The portal does not show the forbidden menu even after expanding other groups.
  3. Refresh the page and re-check the sidebar.
    - expect: Hidden menus stay hidden after reload.
    - expect: The visibility state matches the user’s stored permissions.

#### 1.4. Missing data permissions hide protected content

**File:** `tests/user-permission/data-visibility.spec.ts`

**Steps:**
  1. Sign in as a user who can open a page but lacks access to specific data on that page, such as customer rows, fund rows, invoice rows, or audit-log entries.
    - expect: The page loads, but restricted records or columns do not appear.
    - expect: Visible totals, rows, or detail panels only include allowed data.
  2. Open pages that typically show operational data, such as Dashboard, Customers, Funds, Transactions, and Invoices.
    - expect: Protected tables do not leak denied rows through the UI.
    - expect: Counts, summaries, and row content stay consistent with the user’s permissions.
  3. Search, filter, or switch tabs on the same page.
    - expect: The user still cannot reveal hidden records through alternate filters or tabs.
    - expect: No restricted data appears in empty states, tooltips, or secondary panels.

#### 1.5. Direct URL access is blocked when the menu is hidden

**File:** `tests/user-permission/direct-url-guard.spec.ts`

**Steps:**
  1. Sign in as a user without permission for a hidden module and navigate directly to its URL, such as /users, /audit-logs, /invoices, or another restricted page.
    - expect: The portal blocks access, redirects, or shows an access-denied state according to product behavior.
    - expect: Restricted data does not render briefly before the denial state appears.
  2. Repeat the direct navigation after a browser refresh.
    - expect: The same restriction remains in place.
    - expect: The user cannot bypass menu hiding by typing the route directly.

#### 1.6. Permission changes take effect after save and reload

**File:** `tests/user-permission/permission-persistence.spec.ts`

**Steps:**
  1. Open the permission management page for a target user from Users Management.
    - expect: User Permission Management loads.
    - expect: The user-specific permission editor is visible.
  2. Grant a single permission, save the change, and return to the portal as that user.
    - expect: The newly granted menu or data becomes visible.
    - expect: The permission change survives logout, login, and refresh.
  3. Remove the same permission, save again, and re-test the same route or menu.
    - expect: The menu or data disappears again.
    - expect: The user can no longer reach the restricted page or content.

#### 1.7. Data prevention rules suppress specific data slices

**File:** `tests/user-permission/data-prevention-rules.spec.ts`

**Steps:**
  1. Open the Data Preventions tab for a user and inspect the available prevention rule.
    - expect: The data-prevention control is visible in the permission editor.
    - expect: The current active/inactive state is clear before changes are saved.
  2. Enable a prevention rule for a page or dataset and save it.
    - expect: The rule is persisted.
    - expect: The corresponding data slice is no longer shown to that user.
  3. Return to the portal page affected by the prevention rule and verify the result.
    - expect: Denied data is hidden from the UI.
    - expect: Allowed data remains visible so the page is still usable.
