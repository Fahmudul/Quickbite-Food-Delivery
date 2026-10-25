# QuickBite SRS v1.1 → Code Module Map

This document maps the approved SRS v1.1 requirements to the boilerplate folders.
It is a development guide, not a replacement for the SRS.

| SRS area | Requirement IDs | Primary backend module(s) | Main frontend area |
|---|---|---|---|
| Customer registration, login, logout, reset | FR-01, FR-04 | `Auth`, `Accounts`, `Notifications` | `pages/auth/`, role pages |
| Restaurant/rider applications and admin approval | FR-02, FR-03 | `Accounts`, `Restaurants`, `Delivery`, `Notifications` | `pages/auth/`, `pages/admin/` |
| Supported delivery zones | FR-05 | `Zones` | customer / restaurant / admin pages |
| Restaurant profile and coverage | FR-06 | `Restaurants`, `Zones` | `pages/restaurant/` |
| Customer saved addresses | FR-07 | `Addresses`, `Zones` | `pages/customer/` |
| Restaurant discovery | FR-08 | `Restaurants`, `Menu`, `Zones` | `pages/customer/` |
| Restaurant accepting/stopping/closed state | FR-09 | `Restaurants` | `pages/restaurant/` |
| Platform-wide fixed delivery fee | FR-10 | `Settings` | checkout / admin pages |
| Menu management | FR-11 | `Menu`, `Inventory` | `pages/restaurant/` |
| Food availability | FR-12 | `Menu`, `Inventory` | customer / restaurant pages |
| Single-restaurant cart | FR-13 | `Cart` | `features/cart/`, customer pages |
| 15-minute inventory reservation | FR-14 | `Cart`, `Inventory` | `features/cart/` |
| Locked reservation prices | FR-15 | `Cart`, `Inventory` | customer cart / checkout |
| Reservation release and reserve-again | FR-16 | `Cart`, `Inventory` | customer cart |
| Availability changes preserve valid reservations | FR-17 | `Restaurants`, `Menu`, `Inventory`, `Cart` | customer / restaurant pages |
| Checkout validation | FR-18 | `Checkout`, `Cart`, `Addresses`, `Restaurants`, `Settings` | checkout page |
| COD checkout | FR-19 | `Checkout`, `Orders` | checkout page |
| Sandbox online payment | FR-20 | `Payments`, `Checkout`, `Orders` | checkout / payment UI |
| Checkout freeze during payment | FR-21 | `Checkout`, `Payments`, `Cart` | checkout page |
| Retry confirmed failed payment | FR-22 | `Payments`, `Checkout` | payment UI |
| Automatic order acceptance | FR-23 | `Orders`, `Checkout`, `Payments` | customer / restaurant pages |
| Cancellation permission | FR-24 | `Orders` | customer / admin pages |
| Stock restoration on cancellation | FR-25 | `Orders`, `Inventory` | no special frontend module required |
| Order history and polling | FR-26 | `Orders` | `features/orders/`, customer pages |
| Restaurant preparation | FR-27 | `Orders` | `pages/restaurant/` |
| Rider availability | FR-28 | `Delivery` | `pages/rider/` |
| Admin rider assignment | FR-29 | `Delivery`, `Orders` | `pages/admin/` |
| Pickup, delivery, COD collection | FR-30 | `Delivery`, `Orders`, `Payments` | `pages/rider/` |
| Delivery problems | FR-31 | `Delivery`, `Orders` | rider / admin pages |
| Transactional emails | FR-32 | `Notifications` | mostly backend |
| Paid-order refund/resolution record | FR-33 | `Payments`, `Orders` | admin pages |

## Cross-cutting non-functional requirements

- NFR-01 authentication/session/role checks → `Auth`, `Accounts`, `Middleware`
- NFR-02 validation, prepared SQL, CSRF, safe uploads → `Core`, `Middleware`, repositories
- NFR-03 transactions/data consistency → services + repositories in `Inventory`, `Cart`, `Checkout`, `Orders`, `Delivery`, `Payments`
- NFR-04 readable errors/statuses → shared API response conventions + frontend UI
- NFR-05 responsive layout → `frontend/assets/css/`
- NFR-06 Chrome/Edge + PHP/MySQL compatibility → setup docs/environment
- NFR-07 fault handling → `Core`, controllers, services, logs
- NFR-08 maintainable teamwork → repository structure, docs, Git workflow

## Optional P2 features

Do not create mandatory modules for these yet:

- Ratings/reviews
- Administrator analytics
- Restaurant Manager analytics
- Rider statistics

Only add folders for them if the team explicitly starts those P2 tasks after P0 completion.

## Important

The module map identifies ownership boundaries only. It does **not** mean each module needs Controller + Service + Repository immediately. Create only the files required by the feature being implemented.
