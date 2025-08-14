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

require __DIR__ . '/src/addons/ydeploy/deploy_yak.php';
require __DIR__ . '/deployer.task.setup.php';

$isGit = is_dir(__DIR__ . '/.git');

set(
    'bin/php',
    function () {
        return '$HOME/Library/Application\ Support/Herd/bin/php';
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
    'index.js',
    '.yarn',
    '.prettierrc',
    'jsconfig.json',
    'browserslistrc',
    'LocalValetDriver.php',
    'composer.json',
    '.eslintrc.cjs',
]);

set('update_code_strategy', 'clone');

desc('Install Git submodules if they exist');
after('build:start', static function () {
    on(host('local'), static function () {
        // install Git submodules if they exist
        if (test('[ -f {{release_path}}/.gitmodules ]')) {
            info('Installing Git submodules');
            run('cd {{release_path}} && git submodule update --init --recursive');
            info('Git submodules installed');
            // get submodule paths
            $submodulePaths = run('cd {{release_path}} && git config --file .gitmodules --get-regexp path | awk \'{ print $2 }\'');
            $submodulePaths = explode("\n", $submodulePaths);
            foreach ($submodulePaths as $path) {
                // run composer install in each submodule
                if (test("[ -f {{release_path}}/$path/composer.json ]")) {
                    info("Running composer install in submodule: $path");
                    run("cd {{release_path}}/$path && composer install --no-dev --optimize-autoloader");
                }
                // remove .git directory from submodules
                if (test("[ -d {{release_path}}/$path/.git ]")) {
                    info("Removing .git directory from submodule: $path");
                    run("rm -rf {{release_path}}/$path/.git");
                }
                if (test("[ -d {{release_path}}/$path/.github ]")) {
                    info("Removing .github directory from submodule: $path");
                    run("rm -rf {{release_path}}/$path/.github");
                }
            }
        } else {
            info('No Git submodules found in {{release_path}}/.gitmodules');
        }
        // Remove git
        run('rm -rf {{release_path}}/.git && rm -rf {{release_path}}/.gitmodules');
    });
});


// delete shared/media directory if it exists
before('deploy:success', function () {
    if (test('[ -d {{deploy_path}}/shared/media ]')) {
        run('rm -rf {{deploy_path}}/shared/media');
    }
});


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
                '.env.local',
                'package.json',
                'postcss.config.js',
                'stylelint.config.js',
                'tailwind.config.js',
                'vite.config.js',
                'index.js',
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
