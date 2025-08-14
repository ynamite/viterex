<?php

error_reporting(~E_DEPRECATED);

use FriendsOfRedaxo\MForm;

$mformWrap = MForm::factory();
$mformWrap->addImageListField(1, array('label' => 'Bilder'));
// $mformWrap->addCheckboxField(10, array('label' => 'Schmale Darstellung'));
// $mformWrap->addCheckboxField(11, array('label' => 'Im Raster anzeigen?'));

// $mformWrap->addTextField(1, array('label' => 'Spitzmarke'));

// 

// 
/*
$id = 1;
$mform = MForm::factory();
$mform->addMediaField(1, array('label' => 'Bild'));
$mform->addTextareaField("$id.0.title", array('label' => 'Titel'))->setAttribute("rows", 2);
$mform->addTextareaField("$id.0.body", array('label' => 'Text'))->setAttribute("rows", 4)->setAttribute("class", "tinyMCEEditor-massif");
$mform->addHtml('<div class="flexed col-2">');
$ylink = [['name' => 'Film', 'table' => 'rex_yf_film', 'column' => 'title_original']];
$mform->addCustomLinkField("$id.0.link", array('label' => 'Button-Link', 'ylink' => $ylink));
$mform->addTextField("$id.0.btnlabel", array('label' => 'Button-Text'));
$mform->addHtml('</div>');

$mformWrap->addHtml(MBlock::show($id, $mform->show(), array('min' => 1)));
*/
/*
$mformWrap->addSelectField(5, [0 => 'Mitte', 'top' => 'oben', 'bottom' => 'unten'], array('label' => 'Bild-Ausrichtung'));
$mformWrap->addHtml('<div class="alert alert-info">Vertikale Bildausrichtung</div>');
*/

echo $mformWrap->show();
