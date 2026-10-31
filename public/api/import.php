<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_out(['error' => 'Method not allowed'], 405);
}
require_same_origin();
require_admin();

// Parses the exported WordPress HTML: <h1> title, .date, .tag spans, <article> body.
function parse_export(string $html): ?array
{
    $doc = new DOMDocument();
    libxml_use_internal_errors(true);
    $doc->loadHTML('<?xml encoding="utf-8"?>' . $html);
    libxml_clear_errors();
    $xp = new DOMXPath($doc);

    $article = $xp->query('//article')->item(0);
    if (!$article) {
        return null;
    }
    $decode = fn(string $s) => trim(html_entity_decode($s, ENT_QUOTES | ENT_HTML5, 'UTF-8'));

    $title = $decode((string) $xp->evaluate('string(//h1[1])'));
    if ($title === '') {
        $title = $decode((string) $xp->evaluate('string(//title)'));
    }
    $tags = [];
    foreach ($xp->query('//span[contains(@class,"tag")]') as $n) {
        $tags[] = $decode($n->textContent);
    }
    $body = '';
    foreach ($article->childNodes as $child) {
        $body .= $doc->saveHTML($child);
    }

    return [
        'title' => $title,
        'date' => parse_date(trim((string) $xp->evaluate('string(//div[@class="date"][1])'))),
        'tags' => implode(', ', array_filter($tags)),
        'content' => sanitize_html($body),
    ];
}

$data = read_json();
$publish = !empty($data['publish']);
$results = [];

try {
    $pdo = db();
    $exists = $pdo->prepare('SELECT 1 FROM blog_posts WHERE source = ?');
    $insert = $pdo->prepare(
        'INSERT INTO blog_posts (title, content, published, published_at, tags, source) VALUES (?, ?, ?, ?, ?, ?)'
    );

    foreach ((array) ($data['files'] ?? []) as $file) {
        $name = basename((string) ($file['name'] ?? ''));
        $parsed = parse_export((string) ($file['html'] ?? ''));
        if ($name === '' || !$parsed || $parsed['title'] === '' || $parsed['content'] === '') {
            $results[] = ['name' => $name, 'status' => 'error'];
            continue;
        }
        $exists->execute([$name]);
        if ($exists->fetchColumn()) {
            $results[] = ['name' => $name, 'status' => 'skipped'];
            continue;
        }
        $insert->execute([
            mb_substr($parsed['title'], 0, 255),
            $parsed['content'],
            $publish ? 1 : 0,
            $parsed['date'] ?? date('Y-m-d H:i:s'),
            mb_substr($parsed['tags'], 0, 1000),
            mb_substr($name, 0, 255),
        ]);
        $results[] = ['name' => $name, 'status' => 'imported'];
    }
} catch (PDOException $e) {
    error_log($e->getMessage());
    json_out(['error' => 'Database error'], 500);
}

json_out(['results' => $results]);
