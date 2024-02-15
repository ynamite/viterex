<?php

$package = $this->getPackageId() . '-';
$be_page = \rex_be_controller::getCurrentPageObject();
$key = $be_page->getKey();

$context = new rex_context([
    'page' => rex_be_controller::getCurrentPage(),
    'clang' => rex_clang::getCurrentId(),
    'func' => isset($_REQUEST['func']) ? $_REQUEST['func'] : '',
    'data_id' => isset($_REQUEST['data_id']) ? $_REQUEST['data_id'] : '',
    'table_name' => isset($_REQUEST['table_name']) ? $_REQUEST['table_name'] : ''
]);

echo rex_view::clangSwitchAsButtons($context, true);
echo rex_view::title($this->getProperty('page')['title']);
//echo massif_utils::backendNav($this->getProperty('page')['title'], $this->getProperty('page'));

//rex_addon::get('myaddon')->getProperty('author')

//rex_be_controller::includeCurrentPageSubPath();

if (file_exists($be_page->getSubPath())) {
    rex_be_controller::includeCurrentPageSubPath();
} else {
    include($this->getPath() . '/pages/def-page.php');
}
?>
<style>
    .minicolors-input {
        max-width: 150px;
    }
</style>