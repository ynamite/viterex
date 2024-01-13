<?php

/*
*   ––––––––
*/

namespace Deployer;

if ('cli' !== PHP_SAPI) {
    throw new \Exception('The deployer configuration must be used in cli.');
}

/*
*   Deployment-Host-Konfiguration
*/

$deploymentName = 'mein-deployment';
$deploymentHost = 'example.com';
$deploymentPort = '22';
$deploymentUser = 'benutzername';
$deploymentType = 'production';
$deploymentPath = '/httpdocs';
$deploymentRepository = 'git@github.com:user/repo.git';
// es muss nicht zwingend ein Git-Repository verwendet werden; dieses Skript prüft, ob ein Git-Repository initialisiert wurde.
// ohne Git-Repository muss ggf. der `deploy:update_code`-Task in dieser Datei angepasst werden (ab Zeile 105)

// -------------------------------------------------

require __DIR__ . '/src/addons/ydeploy/deploy.php';
require __DIR__ . '/setup/deployer.task.setup.php';

$isGit = is_dir(__DIR__ . '/.git');

set(
    'bin/php',
    function () {
        return '$HOME/Library/Application\ Support/Herd/bin/php';
    }
);

task('release', [
    'deploy:info',
    'deploy:unlock',
    'deploy:setup',
    'deploy:lock',
    'deploy:upgrade',
    'deploy:release',
    'deploy:copy_dirs',
    'deploy:upload',
    'deploy:shared',
    'deploy:dump_info',
    'setup',
    'database:migration',
    'deploy:publish',
]);

set('base_dir', 'public/');
set('cache_dir', 'var/cache');
set('data_dir', 'var/data');
set('src_dir', 'src');
set('bin/console', 'bin/console');

add('shared_dirs', [
    'var/log',
]);

add('writable_dirs', [
    'var/log',
]);

add('clear_paths', [
    'assets',
    '.env.local',
    'postcss.config.js',
    'stylelint.config.js',
    'tailwind.config.js',
    'vite.config.js',
    'main.js',
]);

// Hosts
host($deploymentName)
    ->setHostname($deploymentHost)
    ->setRemoteUser($deploymentUser)
    ->setPort($deploymentPort)
    ->set('http_user', 'benutzername')
    ->set('labels', ['stage' => $deploymentType])
    ->set(
        'bin/php',
        function () {
            return run('which php');
        }
    )
    ->setDeployPath($deploymentPath);


if ($isGit) {
    set('repository', $deploymentRepository);
    set('branch', static fn () => runLocally('{{bin/git}} rev-parse --abbrev-ref HEAD'));
} else {
    set('branch', 'main');

    desc('Updates code');
    task('deploy:update_code', function () {
        foreach ([
            'assets',
            'bin',
            'public',
            'src',
            'var',
            '.env.local',
            'package.json',
            'postcss.config.js',
            'stylelint.config.js',
            'tailwind.config.js',
            'vite.config.js',
            'main.js',
            'yarn.lock',
            'inc.vite.php',
            'LICENSE.md',
            'README.md',
        ] as $src) {
            upload($src, '{{release_path}}/', ['options' => ['--recursive', '--relative']]);
        }
        cd('{{release_path}}/var/data/core');
        run('mv config.yml default.config.yml');
    });

    desc('Dump info about current deployment');
    task('deploy:dump_info', static function () {
        $host = get('alias');
        $stage = get('labels')['stage'] ?? null;

        if (null === $stage && in_array($host, ['staging', 'test', 'testing', 'live', 'prod', 'production'], true)) {
            $stage = $host;
        }

        $infos = [
            'host' => $host,
            'stage' => $stage,
            'stage' => 'local',
            'commit' => 'none',
            'timestamp' => time(),
        ];

        $infos = json_encode($infos, JSON_PRETTY_PRINT);

        run('mkdir -p {{release_path}}/{{data_dir}}/addons/ydeploy');
        run('echo ' . escapeshellarg($infos) . ' > {{release_path}}/{{data_dir}}/addons/ydeploy/info.json');
    });
}
