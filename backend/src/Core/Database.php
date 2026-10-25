<?php
declare(strict_types=1);

final class Database
{
    private static ?PDO $connection = null;

    public static function connection(): PDO
    {
        if (self::$connection instanceof PDO) {
            return self::$connection;
        }

        $path = __DIR__ . '/../../config/local.php';

        if (!file_exists($path)) {
            throw new RuntimeException('Missing backend/config/local.php');
        }

        $config = require $path;
        $db = $config['database'];

        $dsn = sprintf(
            'mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4',
            $db['host'], $db['port'], $db['name']
        );

        self::$connection = new PDO(
            $dsn,
            $db['username'],
            $db['password'],
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]
        );

        return self::$connection;
    }

    private function __construct() {}
}
