<?php
$buttons = [['url' => 'REX_VALUE[19]', 'label' => '<span>' . 'REX_VALUE[20]' . '</span>', 'style' => 'grid']];

?>
<section class="page-margin section-x-padding section-y-padding default-content<?= massif_utils::isFirstLastSlice('REX_SLICE_ID') ?>">

    <?php if ('REX_VALUE[1]REX_VALUE[2]') { ?>
        <div class="prose md:max-w-prose">
            <?= massif_utils::getH1('REX_VALUE[1]') ?>
            REX_VALUE[2 output=html]
        </div>
    <?php } ?>

    <?= massif_img::get('REX_MEDIA[1]', ['width' => '1216', 'classes' => 'REX_VALUE[1]REX_VALUE[2]' ? ['mt-4 md:mt-8'] : []]) ?>

    <?php if ('REX_VALUE[19]REX_VALUE[20]') { ?>
        <div class="prose<?php if ('REX_VALUE[1]REX_VALUE[2]REX_MEDIA[1]') { ?> mt-8 md:mt-16<?php } ?>">
            <?= massif_utils::getCustomLinks($buttons) ?>
        </div>
    <?php } ?>

</section>