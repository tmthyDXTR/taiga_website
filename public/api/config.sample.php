<?php
// Copy to config.php on the server (do not deploy real credentials via git).
// Hash: php -r 'echo password_hash("your-password", PASSWORD_DEFAULT), "\n";'
return [
    'db_host' => 'localhost',
    'db_port' => 3306, // optional; e.g. 3307 when using an SSH tunnel
    'db_name' => 'supacoda_taiga_blog',
    'db_user' => '',
    'db_pass' => '',
    'admin_password_hash' => '',
];
