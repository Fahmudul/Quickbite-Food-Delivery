# Local Setup

Assumes Apache + PHP + MySQL, e.g. XAMPP.

## 1. Put repo under Apache root

Example:

```text
C:\xampp\htdocs\quickbite
```

## 2. Start Apache and MySQL

## 3. Create DB

Run:

```text
database/schema.sql
```

This creates `quickbite_local`.

## 4. Configure backend

Copy:

```text
backend/config/local.example.php
```

to:

```text
backend/config/local.php
```

Update credentials if needed. `local.php` is ignored by Git.

## 5. Health check

Open:

```text
http://localhost/quickbite/backend/public/api/health
```

Expected JSON:

```json
{
  "success": true,
  "message": "QuickBite API is running",
  "database": "connected",
  "environment": "local"
}
```

## 6. Frontend

Open:

```text
http://localhost/quickbite/frontend/
```

Do not use `file://`.

If `/api/health` gives 404, verify Apache `mod_rewrite` and `.htaccess` support.
