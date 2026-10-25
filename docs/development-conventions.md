# Development Conventions

## New frontend page

Example customer cart:

```text
frontend/pages/customer/cart.html
frontend/assets/js/pages/customer-cart.js
frontend/assets/css/pages/customer-cart.css
```

Reusable cart logic goes under:

```text
frontend/assets/js/features/cart/
```

Do not place large JS blocks inside HTML.

## New backend feature

Example Cart:

```text
backend/src/Modules/Cart/
├── CartController.php
├── CartService.php
└── CartRepository.php
```

Only create the files actually needed.

- Simple read/CRUD: Controller + Repository can be enough.
- Complex workflows: Controller + Service + Repository.

## API routes

Register routes in:

```text
backend/routes/api.php
```

Do not scatter unrelated standalone PHP endpoint files around the project.

## Database changes

For now:

```text
database/schema.sql
database/seeds.sql
```

Discuss schema changes before merge. Never change only your local DB and forget the SQL files.

## Naming

PHP classes: `PascalCase`
- `OrderController.php`
- `CartService.php`

JS/CSS files: `kebab-case`
- `order-tracking.js`
- `customer-cart.css`

DB tables/columns: `snake_case`
- `menu_items`
- `restaurant_id`

## API response shape

Success:

```json
{"success": true, "data": {}}
```

Error:

```json
{"success": false, "message": "Readable error message"}
```

Never expose raw SQL errors.

## Git flow

```text
main
  ^
dev
  ^
feature/<ticket-name>
```

Typical:

```bash
git checkout dev
git pull origin dev
git checkout -b feature/cart-reservation
```

Open PR back to `dev`. Do not push directly to `main`.

## Security baseline

- PHP sessions for auth
- server-side authorization
- `password_hash()` / `password_verify()`
- prepared SQL
- server-side validation
- CSRF protection for state-changing requests
- never trust frontend role checks
- never commit secrets
