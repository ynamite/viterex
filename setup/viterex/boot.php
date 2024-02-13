<?php
/*
 * Redaxo CMS VITE JIT development
 * Inspired by https://github.com/andrefelipe/vite-php-setup
 *
 *  @author      ynamite @ GitHub <https://github.com/ynamite/viterex>
 *  @version     1.0.0
 *
 *  For copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 */

namespace Ynamite\ViteRex;

use rex_path;
use rex_addon;
use rex_developer_manager;


if (rex_addon::get('developer')->isAvailable()) {
    rex_developer_manager::setBasePath(rex_path::src());
}

$env = @parse_ini_file(rex_path::base('.env'));
if (file_exists(rex_path::base('.env.local')))
    $env = @parse_ini_file(rex_path::base('.env.local'));
$devHost = $env ? $env['REDAXO_HOST_NAME'] : 'redaxo-2024.test';

// is development?
viterex::setValue('isDev', $env ? $devHost === $_SERVER['HTTP_HOST'] && $env['MODE'] !== 'production' : false);

// dist subfolder - defined in vite.config.json
$distDef = $env ? $env['VITE_DIST_DIR'] : '/dist';

// defining some base urls and paths
viterex::setValue('distUri', $distDef);
$distPath = rex_path::base(ltrim($env['VITE_PUBLIC_DIR'], '/') . $distDef);
viterex::setValue('distPath', $distPath);

// deafult server address, port and entry point can be customized in env.local
viterex::setValue('viteServer', $env ? $env['VITE_DEV_SERVER'] . ':' . $env['VITE_DEV_SERVER_PORT'] : 'http://localhost:3000');
viterex::setValue('viteEntryPoint', $env ? $env['VITE_ENTRY_POINT'] : '/main.js');

$manifest = 'manifest.json';
$manifestPath = $distPath . '/' . $manifest;
$manifestVitePath = $distPath . '/.vite/' . $manifest;
viterex::setValue('viteManifestPath', file_exists($manifestPath) ? $manifestPath : $manifestVitePath);
