# QuickBite

QuickBite uses HTML, CSS, Vanilla JavaScript, PHP, and MySQL with no application framework.

## Architecture

Multi-page frontend + PHP JSON API + MySQL.

```text
HTML / CSS / Vanilla JS
        |
        | fetch() / JSON
        v
PHP API
        |
        | PDO
        v
MySQL
```

## Rules

1. Frontend never talks directly to MySQL.
2. SQL belongs in backend repositories, not HTML/JS.
3. Business rules belong in services when the feature is complex.
4. All API input must be validated server-side.
5. Use prepared statements.
6. Never commit credentials or API keys.
7. Follow the existing folder pattern before creating new folders.
8. A feature branch may include frontend, backend, and database changes for the same Trello ticket.

See `docs/` for setup and conventions.

## SRS traceability

See `docs/srs-module-map.md` for the approved SRS v1.1 → code module mapping.
