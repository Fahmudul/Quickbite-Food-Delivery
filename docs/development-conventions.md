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

## GitHub Pull Request Workflow

Every development ticket must be completed on its own feature branch and merged into `dev` through a Pull Request.

### 1. Start from the latest `dev`

Before starting a new task:

```bash
git checkout dev
git pull origin dev
```

Create a branch for the assigned Trello ticket:

```bash
git checkout -b feature/qb-dev-017-saved-addresses
```

Branch names should preferably include the Trello ticket ID.

Examples:

```text
feature/qb-dev-014-menu-management
feature/qb-dev-017-saved-addresses
feature/qb-dev-029-rider-availability
```

Do not develop directly on `dev` or `main`.

### 2. Work and commit normally

Check changed files:

```bash
git status
```

Stage the required files:

```bash
git add .
```

Commit with a clear message:

```bash
git commit -m "QB-DEV-017: implement customer saved addresses"
```

Avoid unclear commit messages such as:

```text
update
fix
done
changes
final
```

### 3. Push the feature branch

The first time:

```bash
git push -u origin feature/qb-dev-017-saved-addresses
```

After that:

```bash
git push
```

### 4. Create a Pull Request

On GitHub, create a Pull Request with:

```text
base: dev
compare: feature/qb-dev-017-saved-addresses
```

Never open a normal feature PR directly to `main`.

PR title:

```text
QB-DEV-017 — Implement customer saved delivery addresses
```

PR description should briefly include:

```text
Trello Ticket: QB-DEV-017

What was implemented:
- Add saved address
- View saved addresses
- Edit saved address
- Remove saved address
- Validate supported delivery zone

Database changes:
- Yes / No

Testing:
- Briefly mention what was tested
```

### 5. Self-check before requesting review

Before requesting review:

- Run the feature locally.
- Test the main successful flow.
- Test important validation/error cases.
- Check that unrelated files were not accidentally changed.
- Make sure database changes are reflected in `database/schema.sql` or `database/seeds.sql`.
- Make sure no passwords, API keys, `.env` files, or other secrets were committed.
- Verify the code follows the project conventions.

### 6. Code review

The feature is not considered complete immediately after opening the PR.

A team member/project lead reviews the PR before it is merged.

If changes are requested, continue working on the **same feature branch**:

```bash
git add .
git commit -m "QB-DEV-017: address PR review feedback"
git push
```

The existing Pull Request updates automatically.

Do not create another PR for review fixes.

### 7. Handling conflicts

If `dev` changed while you were working, update your branch before merge:

```bash
git checkout dev
git pull origin dev

git checkout feature/qb-dev-017-saved-addresses
git merge dev
```

Resolve conflicts carefully, test again, then:

```bash
git add .
git commit -m "Resolve dev merge conflicts"
git push
```

Do not randomly delete conflicting code just to make Git accept the merge. Ask the project lead if the correct resolution is unclear.

### 8. Merge and cleanup

After the PR is reviewed, tested, and approved, it can be merged into `dev`.

After merge:

```bash
git checkout dev
git pull origin dev
git branch -d feature/qb-dev-017-saved-addresses
```

The remote feature branch may also be deleted after successful merge.

### Important Rules

- `main` represents the stable project version.
- `dev` is the integration branch.
- Feature development happens only in `feature/...` branches.
- Feature Pull Requests target `dev`.
- Do not push directly to `main`.
- Do not force-push shared branches unless the project lead explicitly approves it.
- Do not merge code that has not been tested.
- One Pull Request should normally correspond to one Trello development ticket.

## Security baseline

- PHP sessions for auth
- server-side authorization
- `password_hash()` / `password_verify()`
- prepared SQL
- server-side validation
- CSRF protection for state-changing requests
- never trust frontend role checks
- never commit secrets
