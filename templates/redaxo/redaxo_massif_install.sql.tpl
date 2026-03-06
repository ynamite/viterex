
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
-- Daten fuer Tabelle `rex_media_manager_type`
--

DELETE FROM `rex_media_manager_type` WHERE ((`id` = '100'));
INSERT INTO `rex_media_manager_type` (`id`, `status`, `name`, `description`, `createdate`, `createuser`, `updatedate`, `updateuser`) VALUES
(100,	0,	'auto',	'',	'2024-01-31 16:01:40',	'admin',	'2024-02-09 15:03:49',	'admin');

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


-- --------------------------------------------------------

--
-- Daten fuer Tabelle `rex_cke5_profiles`
--

DELETE FROM `rex_cke5_profiles` WHERE `id` IN (4, 5);
INSERT INTO `rex_cke5_profiles` (`id`, `name`, `description`, `toolbar`, `expert_definition`, `expert_suboption`, `expert`, `extra_definition`, `extra`, `code_block`, `special_characters`, `group_when_full`, `table_color_default`, `table_color`, `ytable`, `transformation`, `transformation_extra`, `transformation_remove`, `transformation_include`, `html_support_allow`, `html_support_disallow`, `blank_to_external`, `link_internalcategory`, `link_mediatypes`, `link_mediacategory`, `link_downloadable`, `link_decorators`, `link_decorators_definition`, `auto_link`, `text_part_language`, `heading`, `alignment`, `image_toolbar`, `image_resize_unit`, `image_resize_handles`, `image_resize_options`, `image_resize_group_options`, `image_resize_options_definition`, `fontsize`, `highlight`, `emoji`, `table_toolbar`, `rexlink`, `list_style`, `list_start_index`, `list_reversed`, `html_preview`, `height_default`, `min_height`, `max_height`, `lang`, `lang_content`, `font_color`, `font_color_default`, `font_background_color`, `font_background_color_default`, `font_families`, `font_family_default`, `mediaembed`, `mentions`, `mentions_definition`, `styles`, `group_styles`, `templates`, `group_templates`, `sprog_mention`, `sprog_mention_definition`, `mediatype`, `mediatypes`, `mediapath`, `mediacategory`, `upload_mediacategory`, `upload_default`, `createdate`, `updatedate`, `createuser`, `updateuser`, `placeholder_sv_se`, `placeholder_es_es`, `placeholder_it_it`, `placeholder_en_gb`, `placeholder_nl_nl`, `placeholder_ru_ru`, `placeholder_pt_br`, `placeholder_de_de`) VALUES
(4,	'massif',	'MASSIF Default',	'heading,|,bold,italic,underline,strikethrough,blockQuote,|,subscript,superscript,|,bulletedList,numberedList,outdent,indent,|,link,rexImage,|,redo,undo,|,findAndReplace,removeFormat,selectAll,|,specialCharacters,|,sourceEditing',	'',	'',	NULL,	'',	NULL,	'css,html,javascript,php,plaintext,c,cs,cpp,diff,java,python,ruby,typescript,xml',	NULL,	'|group_when_full|',	'|default_table_color|',	'[{\"color\":\"\",\"label\":\"\",\"hasBorder\":\"true\"}]',	'[{\"table\":\"\",\"label\":\"\",\"title\":\"\"}]',	NULL,	'[{\"from\":\"\",\"to\":\"\"}]',	NULL,	NULL,	'[{\r\n    \"name\": \"regex(/^(div|section|article)$/)\",\r\n    \"attributes\": true,\r\n    \"classes\": true,\r\n    \"styles\": true\r\n}]',	'',	'|blank_to_external|',	0,	'',	0,	NULL,	NULL,	'[{\r\n    \"openInNewTab\": {\r\n        \"mode\": \"manual\",\r\n        \"label\": \"Open in a new tab\",\r\n        \"defaultValue\": true,\r\n        \"attributes\": {\r\n            \"target\": \"_blank\",\r\n            \"rel\": \"noopener noreferrer\"\r\n        }\r\n    }\r\n},\r\n{\r\n    \"isGallery\": {\r\n        \"mode\": \"manual\",\r\n        \"label\": \"Gallery link\",\r\n        \"classes\": \"gallery\"\r\n    }\r\n}]',	NULL,	'|en|fr|de|sl|tk|',	'h1,h2,h3,h4,h5,h6,paragraph',	'left,right,center,justify',	'imageTextAlternative,toggleImageCaption,linkImage',	'%',	NULL,	NULL,	'|default_resize_group_options|',	'[{\"name\":\"original\",\"value\":\"null\",\"icon\":\"original\"},{\"name\":\"25\",\"value\":\"25\",\"icon\":\"small\"},{\"name\":\"50\",\"value\":\"50\",\"icon\":\"medium\"},{\"name\":\"75\",\"value\":\"75\",\"icon\":\"large\"},{\"name\":\"10\",\"value\":\"10\",\"icon\":\"mini\"}]',	'default,tiny,small,big,huge',	'yellowMarker,greenMarker,redPen,greenPen,pinkMarker,blueMarker',	'EmojiPeople,EmojiNature,EmojiFood,EmojiSymbols',	'tableColumn,tableRow,mergeTableCells,|,tableProperties,tableCellProperties,toggleTableCaption',	'internal,media,email,phone',	'|liststyle|',	'|liststartindex|',	'|listreversed|',	'|html_preview|',	'|default_height|',	60,	800,	'',	'',	'',	'|default_font_color|',	'',	'|default_font_background_color|',	'',	'|default_font_family|',	'youtube,vimeo,dailymotion,spotify,instagram,twitter,googleMaps,flickr,facebook',	NULL,	'[{\r\n    \"marker\": \"@\",\r\n    \"feed\": [\r\n        \"@test\",\r\n        \"@test2\"\r\n    ],\r\n    \"minimumCharacters\": \"0\"\r\n}]',	NULL,	NULL,	NULL,	NULL,	NULL,	'[{\"sprog_key\":\"\",\"sprog_description\":\"\"}]',	'',	'',	'media',	0,	NULL,	NULL,	NULL,	'2025-10-01 16:58:10',	NULL,	'admin',	'',	'',	'',	'',	'',	'',	'',	''),
(5,	'massif_minimal',	'MASSIF Minimal',	'heading,|,bold,italic,underline,strikethrough,blockQuote,|,subscript,superscript,|,bulletedList,numberedList,outdent,indent,|,link,|,undo,|,findAndReplace,removeFormat,selectAll,|,specialCharacters,|,sourceEditing',	'',	'',	NULL,	'',	NULL,	'css,html,javascript,php,plaintext,c,cs,cpp,diff,java,python,ruby,typescript,xml',	NULL,	'|group_when_full|',	'|default_table_color|',	'[{\"color\":\"\",\"label\":\"\",\"hasBorder\":\"true\"}]',	'[{\"table\":\"\",\"label\":\"\",\"title\":\"\"}]',	NULL,	'[{\"from\":\"\",\"to\":\"\"}]',	NULL,	NULL,	'[{\r\n    \"name\": \"regex(/^(div|section|article)$/)\",\r\n    \"attributes\": true,\r\n    \"classes\": true,\r\n    \"styles\": true\r\n}]',	'',	'|blank_to_external|',	0,	'',	0,	NULL,	NULL,	'[{\r\n    \"openInNewTab\": {\r\n        \"mode\": \"manual\",\r\n        \"label\": \"Open in a new tab\",\r\n        \"defaultValue\": true,\r\n        \"attributes\": {\r\n            \"target\": \"_blank\",\r\n            \"rel\": \"noopener noreferrer\"\r\n        }\r\n    }\r\n},\r\n{\r\n    \"isGallery\": {\r\n        \"mode\": \"manual\",\r\n        \"label\": \"Gallery link\",\r\n        \"classes\": \"gallery\"\r\n    }\r\n}]',	NULL,	'|en|fr|de|sl|tk|',	'h3,paragraph',	'left,right,center,justify',	'imageTextAlternative,toggleImageCaption,linkImage',	'%',	NULL,	NULL,	'|default_resize_group_options|',	'[{\"name\":\"original\",\"value\":\"null\",\"icon\":\"original\"},{\"name\":\"25\",\"value\":\"25\",\"icon\":\"small\"},{\"name\":\"50\",\"value\":\"50\",\"icon\":\"medium\"},{\"name\":\"75\",\"value\":\"75\",\"icon\":\"large\"},{\"name\":\"10\",\"value\":\"10\",\"icon\":\"mini\"}]',	'default,tiny,small,big,huge',	'yellowMarker,greenMarker,redPen,greenPen,pinkMarker,blueMarker',	'EmojiPeople,EmojiNature,EmojiFood,EmojiSymbols',	'tableColumn,tableRow,mergeTableCells,|,tableProperties,tableCellProperties,toggleTableCaption',	'internal,media,email,phone',	NULL,	NULL,	NULL,	'|html_preview|',	NULL,	300,	1000,	'',	'',	'',	'|default_font_color|',	'',	'|default_font_background_color|',	'',	'|default_font_family|',	'youtube,vimeo,dailymotion,spotify,instagram,twitter,googleMaps,flickr,facebook',	NULL,	'[{\r\n    \"marker\": \"@\",\r\n    \"feed\": [\r\n        \"@test\",\r\n        \"@test2\"\r\n    ],\r\n    \"minimumCharacters\": \"0\"\r\n}]',	NULL,	NULL,	NULL,	NULL,	NULL,	'[{\"sprog_key\":\"\",\"sprog_description\":\"\"}]',	'',	'',	'media',	0,	NULL,	NULL,	NULL,	'2025-10-06 09:54:02',	NULL,	'admin',	'',	'',	'',	'',	'',	'',	'',	'');


-- --------------------------------------------------------

--
-- Daten fuer Tabelle `rex_config`
--

DELETE FROM `rex_config` WHERE `namespace` = 'sprog' OR `namespace` = 'block_peek';
INSERT INTO `rex_config` (`namespace`, `key`, `value`) VALUES
('sprog',	'chunkSizeArticles',	'4'),
('sprog',	'clang_base',	'[]'),
('sprog',	'sync_metainfo_art',	'[]'),
('sprog',	'sync_metainfo_cat',	'[]'),
('sprog',	'sync_structure_article_name_to_category_name',	'true'),
('sprog',	'sync_structure_category_name_to_article_name',	'true'),
('sprog',	'sync_structure_status',	'false'),
('sprog',	'sync_structure_template',	'true'),
('sprog',	'wildcard_clang_switch',	'true'),
('sprog',	'wildcard_close_tag',	'" }}"'),
('sprog',	'wildcard_open_tag',	'"{{ "');
UPDATE `rex_config` SET `value` = 'true' WHERE `namespace` = 'uploader' AND `key` = 'filename-as-title-checked';
UPDATE `rex_config` SET `value` = '3000' WHERE `namespace` = 'uploader' AND `key` = 'image-max-width';
UPDATE `rex_config` SET `value` = '3000' WHERE `namespace` = 'uploader' AND `key` = 'image-max-height';
INSERT INTO `rex_config` (`namespace`, `key`, `value`) VALUES
('block_peek',	'template',	'"<?php\\r\\n    $clang = rex_clang::getCurrent();\\r\\n    $langCode = $clang ? $clang->getCode() : \'en\';\\r\\n    $assets = \\\\Ynamite\\\\ViteRex\\\\Assets::get();\\r\\n\\r\\n?>\\r\\n<!DOCTYPE html>\\r\\n<html lang=\\"<?=$langCode?>\\">\\r\\n<head>\\r\\n    <meta charset=\\"UTF-8\\">\\r\\n    <meta name=\\"viewport\\" content=\\"width=device-width, initial-scale=1\\">\\r\\n    <?=$assets[\'preload\'] . $assets[\'criticalCSS\'] . $assets[\'css\']?>\\r\\n<\\/head>\\r\\n<body class=\\"bg-body\\">\\r\\n    {{block_peek_content}}\\r\\n    <?=$assets[\'js\']?>\\r\\n<\\/body>\\r\\n<\\/html>"');

-- --------------------------------------------------------

--
-- Daten fuer Tabelle `be_tools`
--

DELETE FROM `rex_config` WHERE `namespace` = 'be_tools';
INSERT INTO `rex_config` (`namespace`, `key`, `value`) VALUES
('be_tools',	'config',	'{"be_hplink":"checked","be_minnav":"","be_minsidebar":"","be_gototop":"checked","be_tree":"top","be_tree_menu":"","be_tree_shortnames":"","be_tree_showid":"","be_tree_onlystructure":"checked","be_tree_activemode":"checked","be_tree_persist":"checked","be_mediapool_usesort":"","be_mediapool_sort":"name|asc","be_crop":"","be_crop_pre1":"","be_crop_pre2":"","be_crop_pre3":"","be_crop_pre4":"","be_crop_pre5":"","be_collapse_addons":"","be_collapse_ycom":"","be_collapse_yformmanager":"","be_slicetimer":"","be_slicetimer_workversion":"","be_slicetimer_infoblock":""}');


-- --------------------------------------------------------

--
-- Daten fuer Tabelle `emailobfuscator`
--

DELETE FROM rex_config WHERE `namespace` = 'emailobfuscator';
INSERT INTO `rex_config` (`namespace`, `key`, `value`) VALUES
('emailobfuscator',	'articles',	'""'),
('emailobfuscator',	'autoload_css',	'false'),
('emailobfuscator',	'autoload_js',	'false'),
('emailobfuscator',	'mailto_only',	'false'),
('emailobfuscator',	'method',	'"rot13_unicorn"'),
('emailobfuscator',	'templates',	'[]');

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

-- --------------------------------------------------------

--
-- Massif Settings (business contact info)
--

DELETE FROM rex_config WHERE `namespace` = 'massif_settings';
INSERT INTO `rex_config` (`namespace`, `key`, `value`) VALUES
('massif_settings',	'address_e_mail',	'"{{MASSIF_EMAIL}}"'),
('massif_settings',	'address_firma',	'"{{MASSIF_FIRMA}}"'),
('massif_settings',	'google_geo_lat',	'"{{MASSIF_GEO_LAT}}"'),
('massif_settings',	'google_geo_long',	'"{{MASSIF_GEO_LONG}}"'),
('massif_settings',	'google_maps_link',	'"{{MASSIF_GOOGLE_MAPS_LINK}}"'),
('massif_settings',	'address_kanton_code',	'"{{MASSIF_KANTON_CODE}}"'),
('massif_settings',	'address_land',	'"{{MASSIF_LAND}}"'),
('massif_settings',	'address_land_code',	'"{{MASSIF_LAND_CODE}}"'),
('massif_settings',	'address_ort',	'"{{MASSIF_ORT}}"'),
('massif_settings',	'address_phone',	'"{{MASSIF_PHONE}}"'),
('massif_settings',	'address_plz',	'"{{MASSIF_PLZ}}"'),
('massif_settings',	'address_strasse',	'"{{MASSIF_STRASSE}}"');
