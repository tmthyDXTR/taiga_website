<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? (int) $_GET['id'] : 0;

try {
    $pdo = db();

    if ($method === 'GET') {
        $admin = isset($_GET['all']) && is_admin();
        if ($id) {
            $stmt = $pdo->prepare('SELECT * FROM blog_posts WHERE id = ?' . ($admin ? '' : ' AND published = 1'));
            $stmt->execute([$id]);
            $row = $stmt->fetch();
            $row ? json_out($row) : json_out(['error' => 'Not found'], 404);
        }
        $sql = 'SELECT * FROM blog_posts' . ($admin ? '' : ' WHERE published = 1') . ' ORDER BY published_at DESC, id DESC';
        json_out($pdo->query($sql)->fetchAll());
    }

    require_same_origin();
    require_admin();

    if ($method === 'POST' || $method === 'PUT') {
        $data = read_json();
        $title = trim((string) ($data['title'] ?? ''));
        if ($title === '') {
            json_out(['error' => 'Title required'], 422);
        }
        $content = sanitize_html((string) ($data['content'] ?? ''));
        $published = empty($data['published']) ? 0 : 1;
        $date = parse_date($data['published_at'] ?? null);

        if ($method === 'POST') {
            $pdo->prepare('INSERT INTO blog_posts (title, content, published, published_at) VALUES (?, ?, ?, ?)')
                ->execute([mb_substr($title, 0, 255), $content, $published, $date ?? date('Y-m-d H:i:s')]);
            json_out(['id' => (int) $pdo->lastInsertId()], 201);
        }
        $id = (int) ($data['id'] ?? $id);
        $pdo->prepare('UPDATE blog_posts SET title = ?, content = ?, published = ?, published_at = COALESCE(?, published_at) WHERE id = ?')
            ->execute([mb_substr($title, 0, 255), $content, $published, $date, $id]);
        json_out(['id' => $id]);
    }

    if ($method === 'DELETE' && $id) {
        $pdo->prepare('DELETE FROM blog_posts WHERE id = ?')->execute([$id]);
        json_out(['ok' => true]);
    }

    json_out(['error' => 'Method not allowed'], 405);
} catch (PDOException $e) {
    error_log($e->getMessage());
    json_out(['error' => 'Database error'], 500);
}
