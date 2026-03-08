
SET NAMES utf8mb4;

DELETE FROM `rex_article` where id IN (1, 2, 3);
INSERT INTO `rex_article` (`pid`, `id`, `parent_id`, `name`, `catname`, `catpriority`, `startarticle`, `priority`, `path`, `status`, `template_id`, `clang_id`, `createdate`, `createuser`, `updatedate`, `updateuser`, `revision`, `yrewrite_url_type`, `yrewrite_url`, `yrewrite_redirection`, `yrewrite_title`, `yrewrite_description`, `yrewrite_image`, `yrewrite_changefreq`, `yrewrite_priority`, `yrewrite_index`, `yrewrite_canonical_url`) VALUES
(1,	1,	0,	'Home',	'Home',	1,	1,	1,	'|',	1,	1,	1,	'2024-01-11 15:21:10',	'admin',	'2024-01-11 15:21:08',	'admin',	0,	'AUTO',	'',	'',	'',	'',	'',	NULL,	NULL,	NULL,	''),
(2,	2,	0,	'404',	'',	0,	0,	1,	'|',	0,	1,	1,	'2024-01-11 15:23:39',	'admin',	'2024-01-11 15:23:39',	'admin',	0,	'AUTO',	'',	'',	'',	'',	'',	NULL,	NULL,	NULL,	''),
(3,	3,	0,	'Datenschutz',	'',	0,	0,	2,	'|',	1,	1,	1,	'2024-01-11 15:23:47',	'admin',	'2024-01-11 15:23:49',	'admin',	0,	'AUTO',	'',	'',	'',	'',	'',	NULL,	NULL,	NULL,	'');

--
-- Daten fuer Tabelle `rex_clang`
--

ALTER TABLE `rex_clang`
ADD `clang_locale` text NULL;

DELETE FROM `rex_clang` WHERE ((`id` = '1'));
INSERT INTO `rex_clang` (`id`, `code`, `name`, `priority`, `status`, `revision`, `clang_locale`) VALUES
(1, 'de', 'Deutsch', 1, 1, 0, 'de_CH');

-- --------------------------------------------------------

--
-- Daten fuer Tabelle `rex_module`
--
DELETE FROM `rex_module`;

--
-- Daten fuer Tabelle `rex_template`
--

SET NAMES utf8mb4;

DELETE FROM `rex_template`;
INSERT INTO `rex_template` (`id`, `key`, `name`, `content`, `active`, `createdate`, `createuser`, `updatedate`, `updateuser`, `attributes`, `revision`) VALUES
(1,	'default',	'* Default',	'<?php\r\n\r\nuse Ynamite\\Massif\\Media;\r\n\r\n?>\r\nREX_TEMPLATE[key=\"config\"]\r\n\r\nREX_TEMPLATE[key=\"html-head\"]\r\n\r\n<body class=\"<?= $pageClass ?> bg-body text-primary font-sans\">\r\n\r\n	REX_TEMPLATE[key=\"header\"]\r\n\r\n	<main role=\"main\" class=\"flex flex-col flex-1 pt-[var(--shoulder)] page-margin section-p\" id=\"content\">\r\n		<?php\r\n\r\n		$articleContent = $this->getArticle(1);\r\n		echo $articleContent;\r\n		?>\r\n	</main>\r\n\r\n	REX_TEMPLATE[key=\"footer\"]\r\n\r\n	REX_TEMPLATE[key=\"html-scripts\"]\r\n\r\n</body>\r\n<?php if (!rex::getProperty(\'req-with\')) echo \'</html>\'; ?>',	1,	'2026-03-06 17:22:39',	'admin',	'2026-03-06 17:23:32',	'admin',	'{\"ctype\":[],\"modules\":{\"1\":{\"all\":\"1\"}},\"categories\":{\"all\":\"1\"}}',	0),
(2,	'html-scripts',	'HTML Scripts',	'<?php\r\n\r\nuse Ynamite\\ViteRex\\Assets;\r\n\r\n$assets = Assets::get();\r\necho $assets[\'js\'];\r\n',	0,	'2026-03-06 17:22:39',	'admin',	'2026-03-06 17:22:39',	'admin',	'{\"ctype\":[],\"modules\":{\"1\":{\"all\":\"1\"}},\"categories\":{\"all\":\"1\"}}',	0),
(3,	'config',	'Config',	'<?php\r\n\r\nuse Url\\Url;\r\nuse Ynamite\\Massif\\Utils;\r\n\r\nheader(\'Content-Type: text/html; charset=utf-8\');\r\nrex::setProperty(\'req-with\', isset($_SERVER[\'HTTP_X_REQUESTED_WITH\']) && $_SERVER[\'HTTP_X_REQUESTED_WITH\'] && $_SERVER[\'HTTP_X_REQUESTED_WITH\'] == \'swup\');\r\n\r\n/*\r\n	*	config\r\n	*/\r\n\r\n// get current language and locale\r\n$lang = rex_clang::getCurrent();\r\n$langLocale = $lang->getValue(\'locale\');\r\n\r\n$isMobileOrTablet = \'browser-is-\' . rex_string::normalize(useragent::getBrowser());\r\n\r\nif (useragent::isTablet()) {\r\n	$isMobileOrTablet .= \' is-tablet\';\r\n} else if (useragent::isMobile()) {\r\n	$isMobileOrTablet .= \' is-mobile\';\r\n}\r\nif (useragent::isBrowserEdge()) {\r\n	$isMobileOrTablet .= \' is-edge\';\r\n}\r\nif (useragent::isBrowserInternetExplorer()) {\r\n	$isMobileOrTablet .= \' is-ie\';\r\n}\r\n\r\n// get current path route (category-id depth)\r\n$pathRoute = Utils\\Article::getPathRoute();\r\n$pageClass = \'page-id-\' . rex_article::getCurrentId();\r\n$pageClass .= \' page-pid-\' . $pathRoute[0];\r\n\r\n$currentArticle = rex_article::getCurrent();\r\n$tmplId = $currentArticle->getTemplateId();\r\n$pageClass .= \' tmpl-id-\' . $tmplId;\r\n\r\n$manager = Url::resolveCurrent();\r\nif ($manager) {\r\n	$urlManagerData = [];\r\n	if ($profile = $manager->getProfile()) {\r\n		$ns = $profile->getNamespace();\r\n		$urlManagerData[$ns] = [];\r\n		$urlManagerData[$ns][\'url\'] = $manager->getUrl()->getPath();\r\n		$urlManagerData[$ns][\'id\'] = $manager->getDatasetId();\r\n		$urlManagerData[$ns][\'ns-id\'] = $profile->getId();\r\n		$urlManagerData[$ns][\'ns\'] = $profile->getNamespace();\r\n		$urlManagerData[$ns][\'table-name\'] = $profile->getTableName();\r\n		$pageClass .= \' url-manager-page url-profile-\' . $profile->getNamespace();\r\n		if ($manager->isUserPath()) {\r\n			$segments = $manager->getUrl()->getSegments();\r\n			foreach ($profile->getUserPaths() as $value => $label) {\r\n				if (in_array($value, $segments)) {\r\n					$urlManagerData[$ns][\'user-path\'] = $label;\r\n				}\r\n			}\r\n		}\r\n	}\r\n	rex::setProperty(\'url-manager-data\', $urlManagerData);\r\n}\r\n$pageClass .= (Utils\\Article::isStartArticle()) ? \' home-page\' : \' content-page\';\r\n',	0,	'2026-03-06 17:22:39',	'admin',	'2026-03-06 17:22:39',	'admin',	'{\"ctype\":[],\"modules\":{\"1\":{\"all\":\"1\"}},\"categories\":{\"all\":\"1\"}}',	0),
(5,	'html-head',	'HTML Head',	'<!doctype html>\r\n<html class=\"<?= $isMobileOrTablet ?>\" lang=\"<?= $lang->getCode() ?>\">\r\n\r\n<head>\r\n    REX_TEMPLATE[key=\"html-meta\"]\r\n</head>',	0,	'2026-03-06 17:22:39',	'admin',	'2026-03-06 17:22:39',	'admin',	'{\"ctype\":[],\"modules\":{\"1\":{\"all\":\"1\"}},\"categories\":{\"all\":\"1\"}}',	0),
(6,	'html-meta',	'HTML Meta',	'<?php\r\n\r\nuse Ynamite\\MassifSettings\\Seo;\r\nuse Ynamite\\ViteRex\\Assets;\r\n\r\n$assets = Assets::get();\r\n?>\r\n\r\n<!--    \r\n      __    __  ______  ______  ______  __  ______  \r\n     /\\ \"-./  \\/\\  __ \\/\\  ___\\/\\  ___\\/\\ \\/\\  ___\\ \r\n     \\ \\ \\-./\\ \\ \\  __ \\ \\___  \\ \\___  \\ \\ \\ \\  __\\ \r\n      \\ \\_\\ \\ \\_\\ \\_\\ \\_\\/\\_____\\/\\_____\\ \\_\\ \\_\\/\r\n       \\/_/  \\/_/\\/_/\\/_/\\/_____/\\/_____/\\/_/\\/_/   \r\n\r\n                Website by www.massif.ch\r\n\r\n-->\r\n\r\n<meta charset=\"utf-8\" />\r\n\r\n<?= Seo::getTags() ?>\r\n\r\n<?php /* Ynamite\\MassifSettings\\Utils::getFaviconHtml() */ ?>\r\nREX_TEMPLATE[key=\"html-favicon\"]\r\n\r\n<?php if (!rex::getProperty(\'req-with\')) { ?>\r\n\r\n    <?= $assets[\'preload\'] ?>\r\n\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\r\n    <meta name=\"generator\" content=\"REDAXO CMS\" />\r\n    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\" />\r\n\r\n    <?= $assets[\'criticalCSS\'] . $assets[\'css\'] ?>\r\n\r\n    <?php if (!rex::isDebugMode()) { ?>\r\n    <?php } ?>\r\n\r\n<?php } ?>',	0,	'2026-03-06 17:22:39',	'admin',	'2026-03-06 17:22:39',	'admin',	'{\"ctype\":[],\"modules\":{\"1\":{\"all\":\"1\"}},\"categories\":{\"all\":\"1\"}}',	0),
(7,	'footer',	'* Footer',	'<?php\r\n\r\nuse Ynamite\\Massif\\ArticleNav;\r\nuse Ynamite\\MassifSettings\\Utils;\r\n\r\n?>\r\n<footer id=\"footer\" class=\"lg:grid lg:grid-cols-2 xl:grid-cols-4 links-underlined-i footer section-p lg:clamp-[gap-x,10,20]\">\r\n	<div>\r\n		<?= Utils::getWrapped(\'address_firma\') ?>\r\n		<?= Utils::getWrapped(\'address_zusatz\') ?>\r\n	</div>\r\n	<div>\r\n		<?= Utils::getWrapped(\'address_phone_formatted\') ?>\r\n		<?= Utils::getWrapped(\'address_e_mail_formatted\') ?>\r\n	</div>\r\n	<div>\r\n		<?= ArticleNav::get(options_user: [\'list\' => true]) ?>\r\n	</div>\r\n	<div>\r\n		<?= Utils::getWrapped(\'social_instagram_formatted\') ?>\r\n		<?= Utils::getWrapped(\'social_linkedin_formatted\') ?>\r\n	</div>\r\n</footer>',	0,	'2026-03-06 17:22:39',	'admin',	'2026-03-06 17:22:39',	'admin',	'{\"ctype\":[],\"modules\":{\"1\":{\"all\":\"1\"}},\"categories\":{\"all\":\"1\"}}',	0),
(8,	'header',	'* Header',	'<?php\r\n\r\nuse Ynamite\\ViteRex\\Server;\r\n\r\n?>\r\n<a id=\"top\"></a>\r\n\r\n<header class=\"z-10 flex py-4 header section-px\" id=\"header\">\r\n\r\n	<div class=\"site-logo clamp-[w,40,52]\">\r\n		<a href=\"<?= rex_getUrl(rex_article::getSiteStartArticleId()); ?>\" title=\"<?= rex::getServerName() ?>\">\r\n			<span hidden><?= rex::getServerName() ?></span>\r\n			<?= Server::getImg(\'massif-logo.svg\') ?>\r\n		</a>\r\n	</div>\r\n\r\n	<a href=\"<?= rex_getUrl(rex_article::getCurrentId()) ?>#content\" data-scroll class=\"to-content\" title=\"Zum Inhalt\">\r\n		<span hidden>Zum Inhalt</span>\r\n	</a>\r\n\r\n	REX_TEMPLATE[key=\"menu\"]\r\n\r\n</header>',	0,	'2026-03-06 17:22:39',	'admin',	'2026-03-06 17:22:39',	'admin',	'{\"ctype\":[],\"modules\":{\"1\":{\"all\":\"1\"}},\"categories\":{\"all\":\"1\"}}',	0),
(10,	'mjml',	'MJML/Mail',	'<?php ob_start(); ?>\n<mjml>\n  <mj-head>\n        <mj-preview><?=rex::getServer();?></mj-preview>\n	\n        <mj-attributes>\n          <mj-all font-family=\"Arial, sans-serif\" />\n        </mj-attributes>\n		<mj-breakpoint width=\"730px\" />\n		<mj-style>\n	      .bg-white table {\n	        background-color: #ffffff !important;\n	      }\n	      \n	        \n		  @media (max-width:580px) { \n	        .sectionpadded  table:first-child > td:first-child  {\n	          padding-left:20px !important;\n	          padding-right:20px;\n	        }\n	      }\n	      \n	    </mj-style>\n	    \n	\n	\n\n  </mj-head>\n  <mj-body background-color=\"#F4F4F4\">\n  \n 	<mj-wrapper width=\"600px\" background-color=\"#F4F4F4\" padding=\"40px\">\n		<mj-wrapper padding=\"0\" >\n			\n			<mj-section background-color=\"#fff\" css-class=\"sectionpadded\" padding=\"40px 40px 40px 40px\">\n		      <mj-column padding=\"0\">\n		        <mj-image width=\"254\" padding=\"0\" align=\"left\" src=\"<?=rex_url::assets(\'theme/img/logo-vzf.png\')?>\" href=\"<?=rex_yrewrite::getCurrentDomain()?>\" />\n\n		      </mj-column>\n		    </mj-section>\n			\n			REX_ARTICLE[]\n			\n			<mj-section padding=\"40px 0\" css-class=\"sectionpadded\"  background-color=\"#202020\">\n			    <mj-column>\n			\n				\n					<mj-text align=\"left\" \n							 font-weight=\"normal\"\n							 font-size=\"14px\"\n							 line-height=\"20px\" \n							 color=\"#fff\"\n							 padding=\"0 40px\">\n							<b>{{address_firma}}<br />\n							{{address_firma_zusatz}}</b><br />\n							{{address_strasse}}<br />\n							{{address_plz}} {{address_ort}}<br /><br />\n							{{address_telefon_html}}<br>\n							{{address_fax_html}}<br>\n							{{address_e-mail_html}}<br>\n\n					</mj-text>\n					\n			    </mj-column>\n			</mj-section>\n		\n		</mj-wrapper>\n 	</mj-container>\n   \n  </mj-body>\n</mjml>\n<?php \n	\n	$mjml = ob_get_clean();\n\n	if(isset($_GET[\'mjml\']))	\n		die($mjml);\n		\n	$user = \'5db3a909-efbb-48e6-adee-50b88bbc0f22\';\n	$pwd = \'49ca4f4f-11b1-4940-b3b1-b520725d519e\';\n	\n	$mjmlClient = new mjmlClient($user, $pwd);\n	\n	\n	$response = $mjmlClient->render($mjml);\n	\n	\n	\n	echo $response;\n\n?>\n',	0,	'2026-03-06 17:22:39',	'admin',	'2026-03-06 17:22:39',	'admin',	'{\"ctype\":[],\"modules\":{\"1\":{\"0\":\"151\",\"1\":\"157\",\"2\":\"156\",\"all\":0}},\"categories\":{\"all\":\"1\"}}',	0),
(11,	'html-favicon',	'HTML Favicon',	'<link rel=\"apple-touch-icon\" sizes=\"180x180\" href=\"/apple-touch-icon.png\">\r\n<link rel=\"icon\" type=\"image/png\" sizes=\"32x32\" href=\"/favicon-32x32.png\">\r\n<link rel=\"icon\" type=\"image/png\" sizes=\"16x16\" href=\"/favicon-16x16.png\">\r\n<link rel=\"manifest\" href=\"/site.webmanifest\">\r\n<link rel=\"mask-icon\" href=\"/safari-pinned-tab.svg\" color=\"#7a7256\">\r\n<meta name=\"msapplication-TileColor\" content=\"#ebeae6\">\r\n<meta name=\"theme-color\" content=\"#ebeae6\">\r\n<link rel=\"icon\" type=\"image/ico\" href=\"/favicon.ico\">\r\n<meta name=\"msapplication-config\" content=\"browserconfig.xml\" />\r\n',	0,	'2026-03-06 17:22:39',	'admin',	'2026-03-06 17:22:39',	'admin',	'{\"ctype\":[],\"modules\":{\"1\":{\"all\":\"1\"}},\"categories\":{\"all\":\"1\"}}',	0),
(12,	'menu',	'* Menu',	'<?php\n\nuse Ynamite\\Massif\\Nav;\n\n$nav = Nav::factory();\n// $nav->addFilter(\'id\', 1, \'!=\', 1);\n// $nav->addCallback(callback: function (array $params) {\n//   [\'category\' => $category, \'a\' => &$a, \'name\' => &$name, \'depth\' => $depth] = $params;\n//   return true;\n// });\n\n$isPopup = rex_request(\'popup\', \'bool\', false);\n$params = [];\nif ($_GET) {\n  if (isset($_GET[\'popup\'])) {\n    unset($_GET[\'popup\']);\n  }\n  foreach ($_GET as $key => $val) {\n    $params[$key] = $val;\n  }\n}\n\nif (!$isPopup) { ?>\n\n  <!-- Desktop menu -->\n  <div class=\"hidden lg:block\">\n    <nav id=\"nav-desktop\" class=\"main-nav main-nav-desktop\" aria-label=\"Hauptmenü\">\n      <?= $nav->get(name: \'desktop\') ?>\n    </nav>\n  </div>\n\n  <!-- Mobile menu -->\n  <div class=\"lg:hidden\">\n    <button\n      type=\"button\"\n      id=\"mobile-menu-toggle\"\n      aria-label=\"Menü öffnen\"\n      data-label-open=\"Menü öffnen\"\n      data-label-close=\"Menü schliessen\"\n      aria-controls=\"mobile-menu\"\n      aria-expanded=\"false\"\n      style=\"--width: 36px; --bar-height: 2px; --bar-gap: 8px;\">\n      <span class=\"sr-only\">Menü öffnen</span>\n      <div class=\"icon hamburger\">\n        <span></span>\n        <span></span>\n        <span></span>\n      </div>\n    </button>\n\n    <div id=\"mobile-menu-overlay\" aria-hidden=\"true\"></div>\n\n    <div\n      id=\"mobile-menu\"\n      role=\"dialog\"\n      aria-modal=\"true\"\n      aria-labelledby=\"mobile-menu-title\"\n      inert>\n      <span id=\"mobile-menu-title\" class=\"sr-only\">Menü</span>\n\n      <nav id=\"nav-mobile\" class=\"main-nav main-nav-mobile\">\n        <?= $nav->get(name: \'mobile\') ?>\n      </nav>\n    </div>\n  </div>\n\n<?php } ?>',	0,	'2026-03-06 17:22:39',	'admin',	'2026-03-06 17:22:39',	'admin',	'{\"ctype\":[],\"modules\":{\"1\":{\"all\":\"1\"}},\"categories\":{\"all\":\"1\"}}',	0);

-- --------------------------------------------------------

--
-- Login data and user config
--

UPDATE `rex_user` SET `name` = '{{ADMIN_USER}}', `description` = '', `email` = '{{ADMIN_EMAIL}}' WHERE `id` = 1;
DELETE FROM rex_config WHERE `namespace` = 'phpmailer';
INSERT INTO `rex_config` (`namespace`, `key`, `value`) VALUES
('phpmailer', 'archive', 'true'),
('phpmailer', 'bcc', '""'),
('phpmailer', 'charset', '"utf-8"'),
('phpmailer', 'confirmto', '""'),
('phpmailer', 'detour_mode', 'true'),
('phpmailer', 'encoding', '"8bit"'),
('phpmailer', 'errormail', '0'),
('phpmailer', 'from',	'"{{ERROR_EMAIL}}"'),
('phpmailer',  'fromname',	'"{{PROJECT_NAME}}"'),
('phpmailer', 'host', '"localhost"'),
('phpmailer', 'logging', '0'),
('phpmailer',  'mailer',	'"mail"'),
('phpmailer', 'password', '""'),
('phpmailer', 'port', '587'),
('phpmailer', 'priority', '0'),
('phpmailer', 'security_mode', 'false'),
('phpmailer', 'smtp_debug', '"0"'),
('phpmailer', 'smtpauth', 'true'),
('phpmailer', 'smtpsecure', '"tls"'),
('phpmailer',  'test_address',	'"{{ERROR_EMAIL}}"'),
('phpmailer', 'username', '""'),
('phpmailer', 'wordwrap', '120');
INSERT INTO `rex_yrewrite_domain` (`id`, `domain`, `mount_id`, `start_id`, `notfound_id`, `clangs`, `clang_start`, `clang_start_auto`, `clang_start_hidden`, `robots`, `title_scheme`, `description`, `auto_redirect`, `auto_redirect_days`) VALUES
(1,	'{{HOST_PROTOCOL}}://{{SERVER_NAME}}/',	0,	1,	2,	'',	1,	0,	0,	'User-agent: *\r\nDisallow:',	'%T / %SN',	'',	1,	0);
