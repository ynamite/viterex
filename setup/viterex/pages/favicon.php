<?php

use Ynamite\ViteRex\ConfigForm;

$key = rex_be_controller::getCurrentPageObject()->getKey();
$package = $this->getProperty('package') . '-';
$pages = $this->getProperty('page');
$be_page = \rex_be_controller::getCurrentPageObject();

$fields = $pages['subpages'][$key]['fields'];

$form = ConfigForm::getForm($key);

$content = '';
if ($key == 'favicon' && !class_exists('Ynamite\ViteRex\ViteRex')) {
    $content .= '<div class="alert alert-info" role="alert">Requires ViteRex!</div>';
} else {

    if ($key == 'favicon') {
        $icons = [
            'favicon-16x16.png',
            'favicon-32x32.png',
            'favicon.ico',
            'mstile-150x150.png',
            'android-chrome-192x192.png',
            'android-chrome-512x512.png',
            'apple-touch-icon.png',
            'safari-pinned-tab.svg',
        ];
        $content .= '<div style="display: flex; gap: 10px; margin-bottom: 40px;">';
        foreach ($icons as $icon) {
            $content .= '<div style="display: flex; text-align: center; align-items:end;">';
            $content .= '<div>';
            $content .= '<img src="' . rex_url::base() . $icon . '?time=' . time() . '" class="thumbnail" style="max-width: 100px; display: inline-block;"><br /><span style="font-size: 0.7em">' . $icon . '</span>';
            $content .= '</div>';
            $content .= '</div>';
        }
        $content .= '</div>';
    }

    $content .= $form->get();
}

$fragment = new rex_fragment();
$fragment->setVar('class', 'edit', false);
$fragment->setVar('title', $be_page->getTitle(), false);
$fragment->setVar('body', $content, false);
echo $fragment->parse('core/page/section.php');
?>
<script>
    const rexApiCall = async (endpoint, action, body, params = {}) => {
        let defaults = {
            mode: 'same-origin',
            credentials: 'same-origin',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }
        const response = await fetch(`index.php?rex-api-call=${endpoint}&action=${action}`, {
            ...defaults,
            ...params
        })
        const json = await response.json()
        if (json.succeeded) {
            return json.message
        }
        throw new Error(json.message)

    }

    $(document).on('rex:ready', () => {
        $('#rex-page-viterex-favicon #rex-js-page-main form').on('submit', async function(e) {
            e.preventDefault();
            rex_loader.show();
            const data = new FormData(this);
            const response = await rexApiCall('viterex', 'generateFavicon', {}, {
                body: data,
                headers: {}
            })
            console.log(response);
            if (response) {
                window.location.reload();
            }
            rex_loader.hide();
        });
    });
</script>