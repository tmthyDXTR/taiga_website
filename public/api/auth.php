<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    json_out(['admin' => is_admin()]);
}

require_same_origin();
start_session();

if ($method === 'POST') {
    $password = (string) (read_json()['password'] ?? '');
    $hash = (string) ($config['admin_password_hash'] ?? '');
    if ($hash !== '' && password_verify($password, $hash)) {
        session_regenerate_id(true);
        $_SESSION['admin'] = true;
        json_out(['admin' => true]);
    }
    sleep(1);
    json_out(['error' => 'Invalid password'], 401);
}

if ($method === 'DELETE') {
    $_SESSION = [];
    session_destroy();
    json_out(['admin' => false]);
}

json_out(['error' => 'Method not allowed'], 405);
