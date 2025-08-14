<?php

use Ynamite\Massif\Seo;
use Ynamite\ViteRex\ViteRex;

?>
<!--    
    Website by https://www.massif.ch
      __    __  ______  ______  ______  __  ______  
     /\ "-./  \/\  __ \/\  ___\/\  ___\/\ \/\  ___\ 
     \ \ \-./\ \ \  __ \ \___  \ \___  \ \ \ \  __\ 
      \ \_\ \ \_\ \_\ \_\/\_____\/\_____\ \_\ \_\/
       \/_/  \/_/\/_/\/_/\/_____/\/_____/\/_/\/_/   

-->

<meta charset="utf-8" />
<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />

<?= Seo::getTags() ?>

<?php /* Ynamite\MassifSettings\Utils::getFaviconHtml() */ ?>
REX_TEMPLATE[key="html-favicon"]

<?php if (!rex::getProperty('req-with')) { ?>

    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <?= ViteRex::getCriticalCss() ?>

    <?php if (!rex::isDebugMode()) { ?>
    <?php } ?>

<?php } ?>