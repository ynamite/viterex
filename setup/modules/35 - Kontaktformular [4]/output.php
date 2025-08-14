<?php


$tag = 'h1';
if (rex::getProperty('has-text-block')) {
    $tag = 'h3';
}

rex::setProperty('has-text-block', true);
?>

<div class="page-margin row-padding row-prose">

    <div class="wrap">
        <?php if ('REX_VALUE[1]') { ?><h1>REX_VALUE[1]</h1><?php } ?>
        <div class="contact-grid">
            <div class="contact-grid__address">
                REX_VALUE[2 output=html]
            </div>
            <div class="contact-grid__form">
                <h3>Anfrageformular</h3>
                <?php
                echo massif_utils::parse('massif-form-general', ['response' => 'REX_VALUE[4 output=html]']);
                ?>
            </div>
        </div>
    </div>

</div>