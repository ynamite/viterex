<?php

error_reporting(~E_DEPRECATED);

use FriendsOfRedaxo\MForm;

$mformWrap = MForm::factory();
$mformWrap->addTextareaField(1, ['label' => 'Titel'])->setAttribute("rows", 2)->setAttribute("style", "font-size: 2em; line-height: 1;");
$mformWrap->addTextareaField(2, ['label' => 'Text'])->setAttribute("rows", 3)->setAttribute("class", "tiny-editor")->setAttribute("data-profile", "massif");
$mformWrap->addMediaField(1, array('label' => 'Bild'));

$mformWrap->addHtml('<div style="margin-top: 4em;"></div>');
$mformWrap->addHtml('<div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 10px;">');
// $ylink = [['name' => 'Film', 'table' => 'rex_yf_film', 'column' => 'title_original']];
$mformWrap->addCustomLinkField(19, array('label' => 'Button-Link'));
$mformWrap->addTextField(20, array('label' => 'Button-Text'));
$mformWrap->addHtml('</div>');


echo $mformWrap->show();
