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

$localPhpBinary = '$HOME/Library/Application\ Support/Herd/bin/php';
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
require __DIR__ . '/deployer.task.setup.php';

$isGit = is_dir(__DIR__ . '/.git');

set(
    'bin/php',
    function () {
        return $localPhpBinary;
    }
);

add('shared_dirs', [
    '{{data_dir}}/addons/statistics'
]);

add('clear_paths', [
    'assets',
    'public/dist/assets/img/.gitkeep',
    '.env.local',
    'deployer.task.setup.php',
    'postcss.config.js',
    'stylelint.config.js',
    'tailwind.config.js',
    'vite.config.js',
    'main.js',
    '.yarn',
    '.prettierrc',
    'jsconfig.json',
    'browserslistrc',
    'LocalValetDriver.php',
    'composer.json',
    '.eslintrc.cjs',
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
    set('branch', static fn() => runLocally('{{bin/git}} rev-parse --abbrev-ref HEAD'));
} else {
    set('branch', 'main');

    desc('Updates code');
    task('deploy:update_code', function () {
        foreach (
            [
                'assets',
                'bin',
                'public',
                'src',
                'var',
                '.env',
                'package.json',
                'postcss.config.js',
                'stylelint.config.js',
                'tailwind.config.js',
                'vite.config.js',
                'main.js',
                'yarn.lock',
                'LICENSE.md',
                'README.md',
            ] as $src
        ) {
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
