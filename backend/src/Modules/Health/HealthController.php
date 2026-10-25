<?php
declare(strict_types=1);

final class HealthController
{
    public static function show(): void
    {
        $db = Database::connection();
        $db->query('SELECT 1');

        JsonResponse::send([
            'success' => true,
            'message' => 'QuickBite API is running',
            'database' => 'connected',
            'environment' => 'local'
        ]);
    }
}
