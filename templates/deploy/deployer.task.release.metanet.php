<?php

namespace Deployer;

use Deployer\Host\Localhost;
use Deployer\Task\Context;

set('writable_mode', 'chmod');

add('clear_paths', [
  'deployer.task.release.metanet.php',
]);

task('deploy:setAlias', function () {
  $host = Context::get()->getHost();
  $local = $host instanceof Localhost;
  if (!$local) {
    run('alias php=\'/opt/php82/bin/php\' && echo "alias php=\'/opt/php82/bin/php\'" >> ~/.bash_profile && export PATH=/opt/php82/bin:$PATH && echo "export PATH=/opt/php82/bin:\$PATH" >> ~/.bash_profile');
  }
  writeln('Deploy done!');
})->once();

before('release', 'deploy:setAlias');
