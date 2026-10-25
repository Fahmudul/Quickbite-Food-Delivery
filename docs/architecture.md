# QuickBite Architecture

## Selected approach

- Multi-page HTML frontend
- CSS
- Vanilla JavaScript modules
- PHP JSON API backend
- MySQL database
- One monorepo

## Request flow

```text
HTML page
  -> JavaScript fetch()
  -> API route
  -> Controller
  -> Service (when business logic exists)
  -> Repository
  -> MySQL
```

## Backend responsibilities

### Controller
Reads request data, calls backend logic, returns JSON and HTTP status.

### Service
Contains business rules such as inventory reservation, order state rules, payment checks, and rider assignment rules.

### Repository
Contains PDO database queries and prepared statements.

Simple CRUD does not need a forced service layer. Complex workflows should use Controller + Service + Repository.

## Frontend responsibilities

- `frontend/pages/`: actual HTML pages
- `frontend/assets/js/core/`: shared helpers such as API client/config
- `frontend/assets/js/features/`: reusable feature logic
- `frontend/assets/js/pages/`: page entry scripts
- `frontend/assets/css/components/`: reusable styles
- `frontend/assets/css/pages/`: page-specific styles

## Domain modules

Backend logic is organized by business domain, not user role.

Preferred:
`Modules/Orders/`

Avoid duplicating order logic under customer/admin/rider/restaurant folders.

Likely modules:
Auth, Accounts, Addresses, Restaurants, Zones, Settings, Menu, Inventory, Cart, Checkout, Orders, Delivery, Payments, Notifications.
