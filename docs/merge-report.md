# Frontend Integration Report — `integration/merge-all`

Date: 23 November 2026
Base: `dev`
Result: one frontend with all team branches merged, duplicate screens combined, and pages linked into working journeys.

This branch has **not been pushed yet**. Review it, then open a PR `integration/merge-all → dev` as `development-conventions.md` describes.

---

## 1. How to run

The pages are plain HTML/CSS/JS. Serve the `frontend/` folder over HTTP (for example XAMPP `htdocs`) and open `frontend/index.html`. That page lists every Figma screen by role.

> Opening files with `file://` partly works, but browsers block the ES-module scripts some pages use (`payment-retry`, `sandbox-payment-return`, `home`). Use XAMPP or any local web server.

There is no PHP API yet. Pages use sample data, and the customer journey keeps its data in the browser's `localStorage`. To reset the demo, clear site data in DevTools → Application.

---

## 2. What was merged

All 16 work branches were merged with real `git merge --no-ff`, so every commit and author is kept. There were no textual conflicts. The problems were duplicate screens, broken paths and dead links, which the separate *Integration:* commits fix.

| Member | Branch(es) | Trello tickets |
|---|---|---|
| Raiyan Mehedi | `QB-DEV-004` | 004, 016, 017, 018, 026, 034 |
| Md. Ehatesam Haider | `QB-DEV-005` | 005, 006, 007, 010, 029, 031, 032 |
| Hamza Bin Masud | `QB-DEV-008-new`, `011`, `021`, `027`, `027-new`, `030`, `030-new`, `033`, `QB-OPT-002` | 008, 011, 021, 027, 030, 033, OPT-002 |
| Fahmudul Hassan Siam | `QB-DEV-019`, `022`, `023`, `024`, `025` | 019, 022, 023, 024, 025 |
| Yusha Ahmed | — | 009, 012, 013, 014, 015, 020, 028 are still in Backlog (no branch) |

Not merged: `QB-DEV-003`, `shared-layout-fixture` and `chore/project-boilerplate`, which were already in `dev`, and `main`.

> Hamza's commits are authored as `= <=>`, so his git name and email are not configured. He should run `git config --global user.name/user.email` before his next commit.

### Commit order on this branch

1. 16 × `Merge branch 'QB-…'`: the team's original work, unchanged.
2. `Integration: fix absolute C:\xampp asset paths and restore deleted shared files`
3. `Integration: combine duplicate screens into single pages`
4. `Integration: rename frontend files to kebab-case`
5. `Integration: shared role navigation and working links between pages`
6. `Integration: home page, browser-test fixes and small-screen layout`

Steps 2–6 are the integration work. Each commit message explains what changed and why.

---

## 3. Problems found and how they were fixed

| Problem | Where | Fix |
|---|---|---|
| CSS/JS linked as `C:\xampp\htdocs\…` (only worked on one PC) | 20 pages from QB-DEV-004 / 005 | Relative `../../assets/…` paths |
| Link to `D:\QuickBite\…` | ADMIN-06 sidebar | Shared navigation |
| `home.js` and folder `.gitkeep` files deleted | QB-DEV-004 / 005 / 008-new | Restored from `dev` |
| Two files differing only in letter case (`RIDER-dashboard.html` / `rider-dashboard.html`) | QB-OPT-002 vs QB-DEV-005 | Merged into one page (see §4), which avoids the Windows case clash |
| Links to non-existent pages (`./restaurants.html`, `"Active Cart.html"`, `admin-orders-riders.html`, `href="#"` …) | almost every page | Shared navigation plus corrected page links |
| Naming not kebab-case (`ActiveCart.html`, `ADMIN-06-…`, `P2-RM-01-…`) | many | Renamed (see §5) |
| **Bug:** Admin *Cancel Order* threw `list.appendChild is not a function`, so cancellation never finished | QB-DEV-027-new | `results.push(...)` instead of `addResultLine(results, ...)` |
| Customer could cancel while **Preparing** (SRS FR-24 says only while Accepted) | QB-DEV-026 tracking page | Uses QB-DEV-027 rule (§4) |
| Discovery filter used cities (Dhaka, Chattogram…) instead of Admin delivery zones (FR-05) | QB-DEV-016 | Dhanmondi / Uttara / Banani, the zones from ADMIN-06 |
| Customer header and admin sidebars overflowed at phone width | shared `layout.css` | Small-screen rules in `layout.css` |

---

## 4. Duplicate screens: how each was combined

When two people built the same Figma screen, the **ticket owner's page is the base** and the other person's feature was moved into it. The SRS decided any conflicting rules.

| Figma screen | Built by | Result |
|---|---|---|
| CUST-01 Restaurant Discovery | Raiyan (016), Ehatesam (007 sample) | Raiyan's page (it links to the menu). Ehatesam's sample page removed; his navigation pattern lives on in `core/navigation.js`. |
| CUST-03 Active Cart | Raiyan (018), Fahmudul (019) | Raiyan's page and cart logic. Fahmudul's countdown moved to `assets/js/features/cart/reservation-timer.js`: one 15-minute window from the first item, not restarted by later items (FR-14, BR-04). Expiry blocks checkout. |
| CUST-06 Checkout | Hamza (021), Fahmudul (022, 023) | Hamza's validation page, now reading the real cart. *Place order* goes into Fahmudul's COD flow (order created → CUST-08) or the sandbox flow (checkout frozen → payment return → retry/confirmation). Fahmudul's duplicate `checkout.html` / `online-checkout.html` removed. |
| CUST-07 Payment Failed | Fahmudul (023 static, 024 full) | `payment-retry.html` (024) kept: failed and "verification pending" states, frozen checkout summary. An unknown gateway result is treated as pending, not failed (SRS §9). |
| CUST-08 Order Confirmation | Fahmudul (022 COD, 023 online) | One page for both, filled from the created order. |
| CUST-09 Current Order Tracking | Raiyan (026/034), Hamza (027) | Raiyan's page (auto-refresh every 12 s). Hamza's cancellation rules moved to `assets/js/features/orders/order-cancellation.js`: cancel only while Accepted, restore stock once, release rider, refund review for prepaid (FR-24, FR-25). |
| ADMIN-09 Order Administration | Hamza (027-new cancel, 030-new rider) | One page with both sections. Cancelling releases the rider and locks the assignment controls. |
| RIDER-01 Dashboard | Ehatesam (029), Hamza (OPT-002) | Ehatesam's dashboard with Hamza's *Completed / Failed deliveries* counters inside it. SRS §7 says "no separate analytics page". Hamza's duplicate duty-status card was dropped because the availability card already shows it. |

New shared helper: `assets/js/features/orders/order-store.js` holds the order data used by checkout, payment, confirmation, history and tracking. It uses Raiyan's QB-DEV-026 order shape.

---

## 5. Final page map

All page triplets follow `pages/<role>/<name>.html`, `assets/css/pages/<name>.css` and `assets/js/pages/<name>.js`.

| Screen | File | Owner (ticket) |
|---|---|---|
| AUTH-01 Login | `auth/login.html` | Raiyan (004) |
| AUTH-02 Customer Registration | `auth/customer-registration.html` | Raiyan (004) |
| AUTH-04 Rider Application | `auth/rider-application.html` | Ehatesam (010) |
| AUTH-05 / 06 Forgot / Reset Password | `auth/forgot-password.html`, `auth/reset-password.html` | Ehatesam (006) |
| AUTH-07 Profile | `auth/profile.html` | Ehatesam (005) |
| CUST-01 / 02 Discovery, Menu | `customer/restaurant-discovery.html`, `customer/restaurant-menu.html` | Raiyan (016) |
| CUST-03 Active Cart | `customer/active-cart.html` (+ `features/cart/reservation-timer.js`) | Raiyan (018) + Fahmudul (019) |
| CUST-05 Saved Addresses | `customer/saved-addresses.html` | Raiyan (017) |
| CUST-06 Checkout | `customer/checkout.html` | Hamza (021) + Fahmudul (022/023) |
| CUST-07 Payment Retry | `customer/payment-retry.html`, `customer/sandbox-payment-return.html` | Fahmudul (023/024) |
| CUST-08 Order Confirmation | `customer/order-confirmation.html` | Fahmudul (022) |
| CUST-09 Tracking | `customer/current-order-tracking.html` (+ `features/orders/order-cancellation.js`) | Raiyan (026/034) + Hamza (027) |
| CUST-10 Order History | `customer/order-history.html` | Raiyan (026) |
| RM-01 Dashboard | `restaurant/manager-dashboard.html` | Ehatesam (007) |
| P2-RM-01 Analytics | `restaurant/manager-analytics-dashboard.html` | Hamza (OPT-002) |
| RIDER-01 Dashboard (+ P2 stats) | `rider/rider-dashboard.html` | Ehatesam (029) + Hamza (OPT-002) |
| RIDER-02 Assigned Delivery | `rider/rider-current-delivery.html` | Ehatesam (031) |
| RIDER-03 Active Delivery | `rider/rider-active-delivery.html` | Ehatesam (032) |
| RIDER-04 Report Problem | `rider/rider-report-delivery-problem.html` | Hamza (033) |
| ADMIN-01 Dashboard | `admin/admin-dashboard.html` | Ehatesam (007) |
| ADMIN-04 / 05 Rider Applications, Review | `admin/admin-rider-applications.html`, `admin/admin-rider-review.html` | Ehatesam (010) |
| ADMIN-06 Delivery Zones | `admin/admin-delivery-zones.html` | Hamza (008) |
| ADMIN-07 Delivery Fee | `admin/admin-delivery-fee.html` | Hamza (011) |
| ADMIN-08 Orders & Rider Assignment | `admin/admin-orders-rider-assignment.html` | Hamza (030) |
| ADMIN-09 Order Administration | `admin/admin-order-administration.html` | Hamza (027 + 030) |
| ADMIN-10 Delivery Problems | `admin/admin-delivery-problem-resolution.html` | Hamza (033) |
| ADMIN-11 / 12 Refunds, Review | `admin/admin-refunds.html`, `admin/admin-refund-review.html` | Fahmudul (025) |
| P2-ADMIN-01 Analytics | `admin/admin-analytics-dashboard.html` | Hamza (OPT-002) |

Shared files: `assets/js/core/navigation.js` holds the role menus, based on Ehatesam's QB-DEV-007 pattern. Menu links for any role are changed there, not in each page.

---

## 6. Screens in Figma that are not built yet

These show greyed out in menus and on `index.html`.

| Screen | Ticket | Assignee | Suggested file name |
|---|---|---|---|
| AUTH-03 Restaurant Manager Application, ADMIN-02/03 Restaurant Applications & Review | QB-DEV-009 | Yusha | `auth/restaurant-application.html`, `admin/admin-restaurant-applications.html`, `admin/admin-restaurant-review.html` |
| RM-02 Restaurant Profile & Coverage | QB-DEV-012 | Yusha | `restaurant/manager-restaurant-profile.html` |
| RM-06 Operating Status | QB-DEV-013 | Yusha | `restaurant/manager-operating-status.html` |
| RM-03 / RM-04 Menu Management, Add/Edit Item | QB-DEV-014 | Yusha | `restaurant/manager-menu.html`, `restaurant/manager-menu-item.html` |
| RM-05 Inventory | QB-DEV-015 | Yusha | `restaurant/manager-inventory.html` |
| CUST-04 Expired Cart — Reserve Again | QB-DEV-020 | Yusha | `customer/expired-cart.html` |
| RM-07 / RM-08 Current Orders, Order Preparation | QB-DEV-028 | Yusha | `restaurant/manager-orders.html`, `restaurant/manager-order-details.html` |
| RIDER-05 Delivery History | none (in Figma only) | — | `rider/rider-delivery-history.html` |
| P2-CUST-01 Rating & Review (optional) | QB-OPT-001 | Raiyan | `customer/rating-review.html` |

When one of these is built, change its `href: null` in `core/navigation.js`, and in the dashboard quick actions, to the new file.

---

## 7. What was tested

Tested in Chromium over HTTP:

- All 32 pages load with every CSS/JS file (no 404s except the PHP health check, which needs XAMPP) and no JavaScript errors. The correct menu item is highlighted on each.
- No page scrolls sideways at 375px phone width.
- **Customer COD journey:** menu → add items (one reservation window) → cart shows live countdown → checkout rejects the Banani address (restaurant does not serve it) → COD order created → confirmation → tracking → cancel while Accepted (stock restored, no refund for COD).
- A **Preparing** order cannot be cancelled by the customer.
- **Online payment journey:** checkout (online) → failed attempt → protected retry page with the frozen ৳280 checkout → retry → order Accepted as *Online Payment*.
- **ADMIN-09:** reassign rider, then cancel with a reason. The rider is released, assignment controls lock, and the prepaid order is referred for refund.

Not tested: any PHP/MySQL behaviour (none exists yet), and pages that only use their own sample data (e.g. rider delivery actions, refund review) beyond loading without errors.

---

## 8. Suggested next steps

1. Each member opens their own pages from `index.html` and checks they still behave as they built them.
2. Open the PR `integration/merge-all → dev` and review it as a team (see the commit list in §2).
3. Close or delete the merged feature branches after the PR is merged.
4. Yusha's Restaurant Manager tickets (§6) are the main missing MVP frontend work.
5. Backend work (PHP modules, `api.php` routes, schema) can now be built against one stable set of pages.
