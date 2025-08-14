<?php

use Ynamite\Massif\Nav;
use Ynamite\Massif\Utils;


$nav = Nav::factory();
$nav->addFilter('id', 1, '!=', 1);
$nav->addCallback(function ($cat, $depth, &$li, &$a, &$name) {
	$a['title'] = $cat->getName();
	$name = '<span>' . $name . '</span>';
	// if ($depth == 1) {
	// 	if (count($cat->getChildren()) > 0) {
	// 		$li['class'][] = 'has-dropdown';
	// 		$name = '<span>' . $name . '</span><i class="icon fa fa-chevron-down"></i>';
	// 	}
	// }

	// if ($depth == 1) {
	// 	if (count($cat->getChildren()) > 0) {
	// 		$li['class'][] = 'has-dropdown';
	// 	}
	// }

	return true;
});

$pathRoute = Utils::getPathRoute();


$isPopup = rex_request('popup', 'bool', false);
$params = [];
if ($_GET) {
	if (isset($_GET['popup'])) {
		unset($_GET['popup']);
	}
	foreach ($_GET as $key => $val) {
		$params[$key] = $val;
	}
}


?>
<a id="top"></a>

<header class="flex py-4 header header section-px" id="header">

	<div class="site-logo ~w-40/52">
		<a href="<?= rex_getUrl(rex_article::getSiteStartArticleId()); ?>" title="<?= rex::getServerName() ?>">
			<span hidden><?= rex::getServerName() ?></span>
			<?= \Ynamite\ViteRex\ViteRex::getImg('massif-logo.svg') ?>
		</a>
	</div>

	<a href="<?= rex_getUrl(rex_article::getCurrentId()) ?>#content" data-scroll class="to-content" title="Zum Inhalt"><span hidden>Zum Inhalt</span></a>

	<div id="menus">

		<?php if (!$isPopup) { ?>

			<div class="menu main-menu" data-menu-desktop data-menu-id="main-menu">

				<nav class="main-nav">
					<?= $nav->get(0, 1, false, true) ?>
				</nav>

			</div>
		<?php } ?>

	</div>

</header>