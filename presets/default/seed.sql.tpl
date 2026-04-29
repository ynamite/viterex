

SET NAMES utf8mb4;

-- --------------------------------------------------------

TRUNCATE `rex_metainfo_field`;
INSERT INTO `rex_metainfo_field` (`id`, `title`, `name`, `priority`, `attributes`, `type_id`, `default`, `params`, `validate`, `callback`, `restrictions`, `templates`, `createdate`, `createuser`, `updatedate`, `updateuser`) VALUES
(1,	'Locale',	'clang_locale',	1,	'',	1,	'',	'',	NULL,	'',	NULL,	NULL,	'2026-04-29 22:32:19',	'admin',	'2026-04-29 22:32:19',	'admin');

-- --------------------------------------------------------


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
(1, 'de', 'Deutsch', 1, 1, 0, 'de_DE');

-- --------------------------------------------------------

--
-- Daten fuer Tabelle `rex_template`
--

TRUNCATE `rex_template`;
INSERT INTO `rex_template` (`id`, `key`, `name`, `content`, `active`, `createdate`, `createuser`, `updatedate`, `updateuser`, `attributes`, `revision`) VALUES
(1,	'default',	'* Default',	'REX_TEMPLATE[key=\"config\"]\n\n<!doctype html>\n<html lang=\"<?= $lang->getCode() ?>\">\n\n<head>\n	REX_TEMPLATE[key=\"meta\"]\n</head>\n\n<body>\n\n	REX_TEMPLATE[key=\"header\"]\n\n	REX_TEMPLATE[key=\"main\"]\n\n	REX_TEMPLATE[key=\"footer\"]\n\n</body>\n\n</html>',	1,	'2026-03-06 17:22:39',	'admin',	'2026-04-29 22:03:05',	'admin',	'{\"ctype\":[],\"modules\":{\"1\":{\"all\":\"1\"}},\"categories\":{\"all\":\"1\"}}',	0),
(2,	'main',	'Main',	'<main role=\"main\" class=\"flex flex-col flex-1 pt-[var(--shoulder)] page-margin section-p\" id=\"content\">\n	<?php\n\n	$articleContent = $this->getArticle(1);\n	echo $articleContent;\n	?>\n</main>',	0,	'2026-03-06 17:22:39',	'admin',	'2026-04-29 19:55:06',	'admin',	'{\"ctype\":[],\"modules\":{\"1\":{\"all\":\"1\"}},\"categories\":{\"all\":\"1\"}}',	0),
(3,	'config',	'Config',	'<?php\r\n\r\nheader(\'Content-Type: text/html; charset=utf-8\');\r\n\r\n/*\r\n	*	config\r\n	*/\r\n\r\n// get current language and locale\r\n$lang = rex_clang::getCurrent();\r\n$langLocale = $lang->getValue(\'locale\') ?? \'de_DE\';\r\nLocale::setDefault($langLocale);\r\n',	0,	'2026-03-06 17:22:39',	'admin',	'2026-04-29 22:22:31',	'console',	'{\"ctype\":[],\"modules\":{\"1\":{\"all\":\"1\"}},\"categories\":{\"all\":\"1\"}}',	0),
(5,	'meta',	'Meta',	'<meta charset=\"utf-8\" />\n\n<?= (new rex_yrewrite_seo())->getTags() ?>\n\n<link rel=\"apple-touch-icon\" sizes=\"180x180\" href=\"/apple-touch-icon.png\">\n<link rel=\"icon\" type=\"image/png\" sizes=\"32x32\" href=\"/favicon-32x32.png\">\n<link rel=\"icon\" type=\"image/png\" sizes=\"16x16\" href=\"/favicon-16x16.png\">\n<link rel=\"manifest\" href=\"/site.webmanifest\">\n<link rel=\"mask-icon\" href=\"/safari-pinned-tab.svg\" color=\"#7a7256\">\n<meta name=\"msapplication-TileColor\" content=\"#ebeae6\">\n<meta name=\"theme-color\" content=\"#ebeae6\">\n<link rel=\"icon\" type=\"image/ico\" href=\"/favicon.ico\">\n<meta name=\"msapplication-config\" content=\"browserconfig.xml\" />\n\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n<meta name=\"generator\" content=\"REDAXO CMS\" />\n<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\" />\n\nREX_VITE',	0,	'2026-03-06 17:22:39',	'admin',	'2026-04-29 22:18:33',	'admin',	'{\"ctype\":[],\"modules\":{\"1\":{\"all\":\"1\"}},\"categories\":{\"all\":\"1\"}}',	0),
(7,	'footer',	'* Footer',	'<footer>\r\n</footer>',	0,	'2026-03-06 17:22:39',	'admin',	'2026-04-29 22:03:36',	'admin',	'{\"ctype\":[],\"modules\":{\"1\":{\"all\":\"1\"}},\"categories\":{\"all\":\"1\"}}',	0),
(8,	'header',	'* Header',	'<header>\n\n	REX_TEMPLATE[key=\"menu\"]\n\n</header>',	0,	'2026-03-06 17:22:39',	'admin',	'2026-04-29 22:22:49',	'console',	'{\"ctype\":[],\"modules\":{\"1\":{\"all\":\"1\"}},\"categories\":{\"all\":\"1\"}}',	0),
(12,	'menu',	'* Menu',	'<?php\n\n$nav = rex_navigation::factory();\n\n?>\n\n<!-- Desktop menu -->\n<nav aria-label=\"Hauptmenü\">\n  <?= $nav->get() ?>\n</nav>',	0,	'2026-03-06 17:22:39',	'admin',	'2026-04-29 22:17:55',	'admin',	'{\"ctype\":[],\"modules\":{\"1\":{\"all\":\"1\"}},\"categories\":{\"all\":\"1\"}}',	0);


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
