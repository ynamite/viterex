<?php
/*
 * VITE & Tailwind JIT development
 * Inspired by https://github.com/andrefelipe/vite-php-setup
 *
 */

$config = @parse_ini_file(rex_path::base('/setup/setup.cfg'));
$devHost = $config ? $config['REDAXO_HOST_NAME'] : 'redaxo-2024.test';

$env = @parse_ini_file(rex_path::base('.env.local'));

define('IS_VITE_DEVELOPMENT', $env ? $devHost === $_SERVER['HTTP_HOST'] && $env['MODE'] !== 'production' : false);

// dist subfolder - defined in vite.config.json
define('DIST_DEF', $env ? $env['VITE_DIST_DIR'] : '/dist');

// defining some base urls and paths
define('DIST_URI', DIST_DEF);
define('DIST_PATH', rex_path::base(ltrim($env['VITE_PUBLIC_DIR'], '/') . DIST_DEF));

// js enqueue settings
define('JS_DEPENDENCY', []); // array('jquery') as example

// deafult server address, port and entry point can be customized in env.local
define('VITE_SERVER', $env ? $env['VITE_DEV_SERVER'] . ':' . $env['VITE_DEV_SERVER_PORT'] : 'http://localhost:3000');
define('VITE_ENTRY_POINT', $env ? $env['VITE_ENTRY_POINT'] : '/main.js');

$manifest = 'manifest.json';
$manifestPath = DIST_PATH . '/' . $manifest;
$manifestVitePath = DIST_PATH . '/.vite/' . $manifest;
define('VITE_MANIFEST', file_exists($manifestPath) ? $manifestPath : $manifestVitePath);
