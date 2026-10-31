<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_out(['error' => 'Method not allowed'], 405);
}
require_same_origin();
require_admin();

$file = $_FILES['image'] ?? null;
if (!$file || $file['error'] !== UPLOAD_ERR_OK || $file['size'] > 8 * 1024 * 1024) {
    json_out(['error' => 'Upload failed (max 8 MB)'], 422);
}

$types = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'image/gif' => 'gif'];
$mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
if (!isset($types[$mime])) {
    json_out(['error' => 'Only JPG, PNG, WebP or GIF allowed'], 422);
}

$dir = dirname(__DIR__) . '/uploads/blog';
if (!is_dir($dir)) {
    mkdir($dir, 0755, true);
    file_put_contents($dir . '/.htaccess', "php_flag engine off\nRemoveHandler .php .phtml\nOptions -ExecCGI\n");
}

$name = bin2hex(random_bytes(12)) . '.' . $types[$mime];
if (!move_uploaded_file($file['tmp_name'], "$dir/$name")) {
    json_out(['error' => 'Could not save file'], 500);
}
json_out(['url' => "/uploads/blog/$name"], 201);
