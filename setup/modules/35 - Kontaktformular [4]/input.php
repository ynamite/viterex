<?php


use FriendsOfRedaxo\MForm;

$mformWrap = MForm::factory();


$mformWrap->addTextareaField(1, ['label' => 'Titel'])->setAttribute("rows", 3);
$mformWrap->addTextareaField(2, ['label' => 'Text'])->setAttribute("rows", 8)->setAttribute("class", "tiny-editor")->setAttribute("data-profile", "massif");
$mformWrap->addTextareaField(3, ['label' => 'Formular-Code Tally'])->setAttribute("rows", 10);
$mformWrap->addTextareaField(4, ['label' => 'Text nach Versand'])->setAttribute("rows", 8)->setAttribute("class", "tiny-editor")->setAttribute("data-profile", "massif");

echo $mformWrap->show();

?>
<?= massif_utils::getModuleInJsCss() ?>
