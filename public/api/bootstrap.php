<?php
declare(strict_types=1);

$config = require __DIR__ . '/config.php';

function json_out($data, int $code = 200): never
{
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function start_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => !empty($_SERVER['HTTPS']),
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
    session_start();
}

function is_admin(): bool
{
    start_session();
    return !empty($_SESSION['admin']);
}

function require_admin(): void
{
    if (!is_admin()) {
        json_out(['error' => 'Unauthorized'], 401);
    }
}

// Mutating requests must be JSON or multipart sent by our own origin.
function require_same_origin(): void
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? null;
    if ($origin === null) {
        return;
    }
    $port = parse_url($origin, PHP_URL_PORT);
    $host = parse_url($origin, PHP_URL_HOST) . ($port ? ":$port" : '');
    if ($host !== ($_SERVER['HTTP_HOST'] ?? '')) {
        json_out(['error' => 'Bad origin'], 403);
    }
}

function read_json(): array
{
    $data = json_decode(file_get_contents('php://input') ?: '', true);
    return is_array($data) ? $data : [];
}

function db(): PDO
{
    global $config;
    static $pdo = null;
    if ($pdo === null) {
        $pdo = new PDO(
            "mysql:host={$config['db_host']};port=" . ($config['db_port'] ?? 3306) . ";dbname={$config['db_name']};charset=utf8mb4",
            $config['db_user'],
            $config['db_pass'],
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
        );
        $pdo->exec(
            'CREATE TABLE IF NOT EXISTS blog_posts (
                id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                content MEDIUMTEXT NOT NULL,
                published TINYINT(1) NOT NULL DEFAULT 0,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) CHARACTER SET utf8mb4'
        );
        $cols = $pdo->query('SHOW COLUMNS FROM blog_posts')->fetchAll(PDO::FETCH_COLUMN);
        if (!in_array('published_at', $cols, true)) {
            $pdo->exec('ALTER TABLE blog_posts ADD COLUMN published_at DATETIME NULL');
            $pdo->exec('UPDATE blog_posts SET published_at = created_at');
        }
        if (!in_array('tags', $cols, true)) {
            $pdo->exec("ALTER TABLE blog_posts ADD COLUMN tags VARCHAR(1000) NOT NULL DEFAULT ''");
        }
        if (!in_array('source', $cols, true)) {
            $pdo->exec('ALTER TABLE blog_posts ADD COLUMN source VARCHAR(255) NULL, ADD UNIQUE KEY uq_source (source)');
        }
    }
    return $pdo;
}

// Accepts 'YYYY-MM-DD HH:MM[:SS]' or the datetime-local 'T' form; null if invalid.
function parse_date($value): ?string
{
    if (!is_string($value) || !preg_match('/^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2})?$/', trim($value))) {
        return null;
    }
    $ts = strtotime(str_replace('T', ' ', trim($value)));
    return $ts === false ? null : date('Y-m-d H:i:s', $ts);
}

function sanitize_html(string $html): string
{
    $allowed = [
        'p' => [], 'br' => [], 'b' => [], 'strong' => [], 'i' => [], 'em' => [], 'u' => [],
        'h2' => [], 'h3' => [], 'h4' => [], 'h5' => [], 'ul' => [], 'ol' => [], 'li' => [], 'blockquote' => [],
        'figure' => [], 'figcaption' => [], 'cite' => [],
        'a' => ['href'], 'img' => ['src', 'alt'],
    ];
    $drop = ['script', 'style', 'iframe', 'object', 'embed', 'head', 'title'];

    $doc = new DOMDocument();
    libxml_use_internal_errors(true);
    $doc->loadHTML('<?xml encoding="utf-8"?><body><div id="root">' . $html . '</div></body>', LIBXML_NOERROR | LIBXML_NOWARNING);
    libxml_clear_errors();
    $root = $doc->getElementById('root');
    if (!$root) {
        return '';
    }

    $clean = function (DOMNode $node) use (&$clean, $allowed, $drop): void {
        foreach (iterator_to_array($node->childNodes) as $child) {
            if ($child instanceof DOMElement) {
                $tag = strtolower($child->tagName);
                if (!isset($allowed[$tag])) {
                    if (in_array($tag, $drop, true)) {
                        $node->removeChild($child);
                        continue;
                    }
                    $clean($child);
                    while ($child->firstChild) {
                        $node->insertBefore($child->firstChild, $child);
                    }
                    $node->removeChild($child);
                    continue;
                }
                foreach (iterator_to_array($child->attributes) as $attr) {
                    $name = strtolower($attr->name);
                    $ok = in_array($name, $allowed[$tag], true);
                    if ($ok && ($name === 'href' || $name === 'src')) {
                        $ok = (bool) preg_match('#^(https?://|/(?!/)|mailto:)#i', trim($attr->value))
                            && !($tag === 'img' && stripos(trim($attr->value), 'mailto:') === 0);
                    }
                    if (!$ok) {
                        $child->removeAttribute($attr->name);
                    }
                }
                if ($tag === 'a') {
                    $child->setAttribute('rel', 'noopener noreferrer');
                }
                $clean($child);
            } elseif (!($child instanceof DOMText)) {
                $node->removeChild($child);
            }
        }
    };
    $clean($root);

    $out = '';
    foreach ($root->childNodes as $child) {
        $out .= $doc->saveHTML($child);
    }
    return trim($out);
}
