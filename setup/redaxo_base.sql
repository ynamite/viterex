
SET NAMES utf8mb4;

INSERT INTO `rex_article` (`pid`, `id`, `parent_id`, `name`, `catname`, `catpriority`, `startarticle`, `priority`, `path`, `status`, `template_id`, `clang_id`, `createdate`, `createuser`, `updatedate`, `updateuser`, `revision`, `yrewrite_url_type`, `yrewrite_url`, `yrewrite_redirection`, `yrewrite_title`, `yrewrite_description`, `yrewrite_image`, `yrewrite_changefreq`, `yrewrite_priority`, `yrewrite_index`, `yrewrite_canonical_url`) VALUES
(1,	1,	0,	'Home',	'Home',	1,	1,	1,	'|',	1,	1,	1,	'2024-01-11 15:21:10',	'admin',	'2024-01-11 15:21:08',	'admin',	0,	'AUTO',	'',	'',	'',	'',	'',	NULL,	NULL,	NULL,	'');

--
-- Daten für Tabelle `rex_template`
--

SET NAMES utf8mb4;

DELETE FROM `rex_template`;

INSERT INTO `rex_template` (`id`, `key`, `name`, `content`, `active`, `createdate`, `createuser`, `updatedate`, `updateuser`, `attributes`, `revision`) VALUES
(1,	'default',	'* Default',	'<?php\r\nheader(\'Content-Type: text/html; charset=utf-8\');\r\n\n?>\r\n<!doctype html>\r\n<html lang=\"de\">\r\n\r\n<head>\r\n	REX_TEMPLATE[key=\"html-meta\"]\r\n</head>\r\n\r\n<body class=\"bg-slate-600 font-roboto\">\r\n\r\n	REX_TEMPLATE[key=\"header\"]\r\n\r\n	<main role=\"main\">\r\n		<?php\r\n		$articleContent = $this->getArticle(1);\r\n		echo $articleContent;\r\n		?>\r\n	</main>\r\n\r\n	REX_TEMPLATE[key=\"footer\"]\r\n\r\n	REX_TEMPLATE[key=\"html-scripts\"]\r\n\r\n</body>\r\n\r\n</html>',	1,	'2024-01-09 16:13:37',	'admin',	'2024-01-14 10:42:57',	'admin',	'{\"ctype\":[],\"modules\":{\"1\":{\"all\":\"1\"}},\"categories\":{\"all\":\"1\"}}',	0),
(2,	'html-scripts',	'04 - HTML Scripts',	'<?= \\Ynamite\\ViteRex\\ViteRex::getAssets() ?>',	0,	'2024-01-09 16:15:15',	'admin',	'2024-01-14 16:33:09',	'admin',	'{\"ctype\":[],\"modules\":{\"1\":{\"all\":\"1\"}},\"categories\":{\"all\":\"1\"}}',	0),
(3,	'html-meta',	'03 - HTML Meta',	'<?php\r\n$rewriter_seo = new rex_yrewrite_seo();\r\n?>\r\n\r\n<meta charset=\"utf-8\" />\r\n<meta http-equiv=\"content-type\" content=\"text/html; charset=utf-8\" />\r\n<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\" />\r\n\r\n<?= $rewriter_seo->getTags() ?>\r\n\r\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />',	0,	'2024-01-09 16:13:12',	'admin',	'2024-01-14 10:46:05',	'admin',	'{\"ctype\":[],\"modules\":{\"1\":{\"all\":\"1\"}},\"categories\":{\"all\":\"1\"}}',	0),
(4,	'footer',	'* Footer',	'<footer>\r\n</footer>',	0,	'2024-01-09 16:17:19',	'admin',	'2024-01-14 16:32:29',	'admin',	'{\"ctype\":[],\"modules\":{\"1\":{\"all\":\"1\"}},\"categories\":{\"all\":\"1\"}}',	0),
(5,	'header',	'* Header',	'<?php\r\n\r\n$nav = rex_navigation::factory();\r\n?>\r\n\r\n<header>\r\n	<div class=\"site-logo\">\r\n		<a href=\"<?= rex_getUrl(rex_article::getSiteStartArticleId()); ?>\" class=\"site-logo__anchor\" data-dialog-close>\r\n			<span hidden><?= rex::getServerName() ?></span>\r\n		</a>\r\n	</div>\r\n	<nav class=\"main-nav\">\r\n		<?= $nav->get(0, 1, false, true) ?>\r\n	</nav>\r\n</header>',	0,	'2024-01-09 16:18:04',	'admin',	'2024-01-14 16:31:40',	'admin',	'{\"ctype\":[],\"modules\":{\"1\":{\"all\":\"1\"}},\"categories\":{\"all\":\"1\"}}',	0);