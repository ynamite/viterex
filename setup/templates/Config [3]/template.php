<?php

use Ynamite\Massif\Utils as massif_utils;

header('Content-Type: text/html; charset=utf-8');
rex::setProperty('req-with', isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] && $_SERVER['HTTP_X_REQUESTED_WITH'] == 'swup');

/*
	*	config
	*/

// get current language and locale
$lang = rex_clang::getCurrent();
$langLocale = $lang->getValue('locale');

$isMobileOrTablet = ' browser-is-' . rex_string::normalize(useragent::getBrowser());

if (useragent::isTablet()) {
	$isMobileOrTablet .= ' is-tablet';
} else if (useragent::isMobile()) {
	$isMobileOrTablet .= ' is-mobile';
}
if (useragent::isBrowserEdge()) {
	$isMobileOrTablet .= ' is-edge';
}
if (useragent::isBrowserInternetExplorer()) {
	$isMobileOrTablet .= ' is-ie';
}

// get current path route (category-id depth)
$pathRoute = massif_utils::getPathRoute();
$pageClass = 'page-id-' . rex_article::getCurrentId();
$pageClass .= ' page-pid-' . $pathRoute[0];

$currentArticle = rex_article::getCurrent();
$tmplId = $currentArticle->getTemplateId();
$pageClass .= ' tmpl-id-' . $tmplId;

$manager = Url\Url::resolveCurrent();
if ($manager) {
	$urlManagerData = [];
	if ($profile = $manager->getProfile()) {
		$ns = $profile->getNamespace();
		$urlManagerData[$ns] = [];
		$urlManagerData[$ns]['url'] = $manager->getUrl()->getPath();
		$urlManagerData[$ns]['id'] = $manager->getDatasetId();
		$urlManagerData[$ns]['ns-id'] = $profile->getId();
		$urlManagerData[$ns]['ns'] = $profile->getNamespace();
		$urlManagerData[$ns]['table-name'] = $profile->getTableName();
		$pageClass .= ' url-manager-page url-profile-' . $profile->getNamespace();
		if ($manager->isUserPath()) {
			$segments = $manager->getUrl()->getSegments();
			foreach ($profile->getUserPaths() as $value => $label) {
				if (in_array($value, $segments)) {
					$urlManagerData[$ns]['user-path'] = $label;
				}
			}
		}
	}
	rex::setProperty('url-manager-data', $urlManagerData);
}
$pageClass .= (massif_utils::isStartPage()) ? ' home-page' : ' content-page';
