<?php
rex::setProperty('has-visual', true);

$slides = explode(',', 'REX_MEDIALIST[1]');
shuffle($slides);
$slides = array_slice($slides, 0, 7);
$swiperHtml = [];
foreach ($slides as $idx => $slide) {
    $content = [];
    $content[] = massif_img::get($slide, ['width' => 1999, 'loading' => $idx == 0 ? 'eager' : 'lazy']);
    $swiperHtml[] = massif_utils::parse('massif-swiper-slide', ['idx' => $idx, 'content' => implode("\n", $content)]);
}

?>

<div class="swiper swiper-fs">
    <?php
    echo massif_img::getSwiper(['content' => implode("\n", $swiperHtml), 'controls' => false, 'dir-nav' => false, 'pager' => false]);
    ?>
</div>