<?php
declare(strict_types=1);

require_once __DIR__ . '/../src/Core/Database.php';
require_once __DIR__ . '/../src/Core/JsonResponse.php';
require_once __DIR__ . '/../src/Modules/Health/HealthController.php';

$routes = require __DIR__ . '/../routes/api.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';

$apiPosition = strpos($path, '/api/');
$routePath = $apiPosition !== false ? substr($path, $apiPosition) : $path;
$routeKey = $method . ' ' . $routePath;

if (!isset($routes[$routeKey])) {
    JsonResponse::send(['success' => false, 'message' => 'Route not found.'], 404);
    exit;
}

try {
    $routes[$routeKey]();
} catch (Throwable $exception) {
    error_log($exception->__toString());
    JsonResponse::send(['success' => false, 'message' => 'Internal server error.'], 500);
}
