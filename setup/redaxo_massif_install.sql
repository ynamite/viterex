
SET NAMES utf8mb4;

INSERT INTO `rex_article` (`pid`, `id`, `parent_id`, `name`, `catname`, `catpriority`, `startarticle`, `priority`, `path`, `status`, `template_id`, `clang_id`, `createdate`, `createuser`, `updatedate`, `updateuser`, `revision`, `yrewrite_url_type`, `yrewrite_url`, `yrewrite_redirection`, `yrewrite_title`, `yrewrite_description`, `yrewrite_image`, `yrewrite_changefreq`, `yrewrite_priority`, `yrewrite_index`, `yrewrite_canonical_url`) VALUES
(1,	1,	0,	'Home',	'Home',	1,	1,	1,	'|',	1,	1,	1,	'2024-01-11 15:21:10',	'admin',	'2024-01-11 15:21:08',	'admin',	0,	'AUTO',	'',	'',	'',	'',	'',	NULL,	NULL,	NULL,	''),
(2,	2,	0,	'404',	'',	0,	0,	1,	'|',	0,	1,	1,	'2024-01-11 15:23:39',	'admin',	'2024-01-11 15:23:39',	'admin',	0,	'AUTO',	'',	'',	'',	'',	'',	NULL,	NULL,	NULL,	''),
(3,	3,	0,	'Datenschutz',	'',	0,	0,	2,	'|',	1,	1,	1,	'2024-01-11 15:23:47',	'admin',	'2024-01-11 15:23:49',	'admin',	0,	'AUTO',	'',	'',	'',	'',	'',	NULL,	NULL,	NULL,	'');

--
-- Daten für Tabelle `rex_clang`
--

DELETE FROM `rex_clang`
WHERE ((`id` = '1'));

ALTER TABLE `rex_clang`
ADD `clang_locale` text NULL;

INSERT INTO `rex_clang` (`id`, `code`, `name`, `priority`, `status`, `revision`, `clang_locale`) VALUES
(1, 'de', 'Deutsch', 1, 1, 0, 'de_CH');

-- --------------------------------------------------------

--
--
-- Daten für Tabelle `rex_media_manager_type`
--

INSERT INTO `rex_media_manager_type` (`id`, `status`, `name`, `description`, `createdate`, `createuser`, `updatedate`, `updateuser`) VALUES
(100,	0,	'auto',	'',	'2024-01-31 16:01:40',	'admin',	'2024-02-09 15:03:49',	'admin');

-- --------------------------------------------------------

--
-- Daten für Tabelle `rex_media_manager_type_effect`
--

INSERT INTO `rex_media_manager_type_effect` (`type_id`, `effect`, `parameters`, `priority`, `createdate`, `createuser`, `updatedate`, `updateuser`) VALUES
(100,	'focuspoint_fit',	'{\"rex_effect_rounded_corners\":{\"rex_effect_rounded_corners_topleft\":\"\",\"rex_effect_rounded_corners_topright\":\"\",\"rex_effect_rounded_corners_bottomleft\":\"\",\"rex_effect_rounded_corners_bottomright\":\"\"},\"rex_effect_workspace\":{\"rex_effect_workspace_set_transparent\":\"colored\",\"rex_effect_workspace_width\":\"\",\"rex_effect_workspace_height\":\"\",\"rex_effect_workspace_hpos\":\"left\",\"rex_effect_workspace_vpos\":\"top\",\"rex_effect_workspace_padding_x\":\"0\",\"rex_effect_workspace_padding_y\":\"0\",\"rex_effect_workspace_bg_r\":\"\",\"rex_effect_workspace_bg_g\":\"\",\"rex_effect_workspace_bg_b\":\"\",\"rex_effect_workspace_bgimage\":\"\"},\"rex_effect_crop\":{\"rex_effect_crop_width\":\"\",\"rex_effect_crop_height\":\"\",\"rex_effect_crop_offset_width\":\"\",\"rex_effect_crop_offset_height\":\"\",\"rex_effect_crop_hpos\":\"center\",\"rex_effect_crop_vpos\":\"middle\"},\"rex_effect_insert_image\":{\"rex_effect_insert_image_brandimage\":\"\",\"rex_effect_insert_image_hpos\":\"left\",\"rex_effect_insert_image_vpos\":\"top\",\"rex_effect_insert_image_padding_x\":\"-10\",\"rex_effect_insert_image_padding_y\":\"-10\"},\"rex_effect_rotate\":{\"rex_effect_rotate_rotate\":\"0\"},\"rex_effect_filter_colorize\":{\"rex_effect_filter_colorize_filter_r\":\"\",\"rex_effect_filter_colorize_filter_g\":\"\",\"rex_effect_filter_colorize_filter_b\":\"\"},\"rex_effect_image_properties\":{\"rex_effect_image_properties_jpg_quality\":\"\",\"rex_effect_image_properties_png_compression\":\"\",\"rex_effect_image_properties_webp_quality\":\"\",\"rex_effect_image_properties_avif_quality\":\"\",\"rex_effect_image_properties_avif_speed\":\"\",\"rex_effect_image_properties_interlace\":null},\"rex_effect_focuspoint_fit\":{\"rex_effect_focuspoint_fit_meta\":\"med_focuspoint\",\"rex_effect_focuspoint_fit_focus\":\"\",\"rex_effect_focuspoint_fit_width\":\"1000\",\"rex_effect_focuspoint_fit_height\":\"\",\"rex_effect_focuspoint_fit_zoom\":\"100%\"},\"rex_effect_filter_brightness\":{\"rex_effect_filter_brightness_brightness\":\"\"},\"rex_effect_flip\":{\"rex_effect_flip_flip\":\"X\"},\"rex_effect_image_format\":{\"rex_effect_image_format_convert_to\":\"webp\"},\"rex_effect_filter_contrast\":{\"rex_effect_filter_contrast_contrast\":\"\"},\"rex_effect_filter_sharpen\":{\"rex_effect_filter_sharpen_amount\":\"80\",\"rex_effect_filter_sharpen_radius\":\"0.5\",\"rex_effect_filter_sharpen_threshold\":\"3\"},\"rex_effect_resize\":{\"rex_effect_resize_width\":\"\",\"rex_effect_resize_height\":\"\",\"rex_effect_resize_style\":\"maximum\",\"rex_effect_resize_allow_enlarge\":\"enlarge\"},\"rex_effect_filter_blur\":{\"rex_effect_filter_blur_repeats\":\"10\",\"rex_effect_filter_blur_type\":\"gaussian\",\"rex_effect_filter_blur_smoothit\":\"\"},\"rex_effect_mirror\":{\"rex_effect_mirror_height\":\"\",\"rex_effect_mirror_opacity\":\"100\",\"rex_effect_mirror_set_transparent\":\"colored\",\"rex_effect_mirror_bg_r\":\"\",\"rex_effect_mirror_bg_g\":\"\",\"rex_effect_mirror_bg_b\":\"\"},\"rex_effect_header\":{\"rex_effect_header_download\":\"open_media\",\"rex_effect_header_cache\":\"no_cache\",\"rex_effect_header_filename\":\"filename\",\"rex_effect_header_index\":\"index\"},\"rex_effect_convert2img\":{\"rex_effect_convert2img_convert_to\":\"jpg\",\"rex_effect_convert2img_density\":\"150\",\"rex_effect_convert2img_color\":\"\"},\"rex_effect_mediapath\":{\"rex_effect_mediapath_mediapath\":\"\"}}',	1,	'2024-01-31 16:02:13',	'admin',	'2024-02-09 15:03:49',	'admin'),
(100,	'negotiator',	'{\"rex_effect_rounded_corners\":{\"rex_effect_rounded_corners_topleft\":\"\",\"rex_effect_rounded_corners_topright\":\"\",\"rex_effect_rounded_corners_bottomleft\":\"\",\"rex_effect_rounded_corners_bottomright\":\"\"},\"rex_effect_workspace\":{\"rex_effect_workspace_set_transparent\":\"colored\",\"rex_effect_workspace_width\":\"\",\"rex_effect_workspace_height\":\"\",\"rex_effect_workspace_hpos\":\"left\",\"rex_effect_workspace_vpos\":\"top\",\"rex_effect_workspace_padding_x\":\"0\",\"rex_effect_workspace_padding_y\":\"0\",\"rex_effect_workspace_bg_r\":\"\",\"rex_effect_workspace_bg_g\":\"\",\"rex_effect_workspace_bg_b\":\"\",\"rex_effect_workspace_bgimage\":\"\"},\"rex_effect_crop\":{\"rex_effect_crop_width\":\"\",\"rex_effect_crop_height\":\"\",\"rex_effect_crop_offset_width\":\"\",\"rex_effect_crop_offset_height\":\"\",\"rex_effect_crop_hpos\":\"center\",\"rex_effect_crop_vpos\":\"middle\"},\"rex_effect_insert_image\":{\"rex_effect_insert_image_brandimage\":\"\",\"rex_effect_insert_image_hpos\":\"left\",\"rex_effect_insert_image_vpos\":\"top\",\"rex_effect_insert_image_padding_x\":\"-10\",\"rex_effect_insert_image_padding_y\":\"-10\"},\"rex_effect_rotate\":{\"rex_effect_rotate_rotate\":\"0\"},\"rex_effect_filter_colorize\":{\"rex_effect_filter_colorize_filter_r\":\"\",\"rex_effect_filter_colorize_filter_g\":\"\",\"rex_effect_filter_colorize_filter_b\":\"\"},\"rex_effect_image_properties\":{\"rex_effect_image_properties_jpg_quality\":\"\",\"rex_effect_image_properties_png_compression\":\"\",\"rex_effect_image_properties_webp_quality\":\"\",\"rex_effect_image_properties_avif_quality\":\"\",\"rex_effect_image_properties_avif_speed\":\"\",\"rex_effect_image_properties_interlace\":null},\"rex_effect_focuspoint_fit\":{\"rex_effect_focuspoint_fit_meta\":\"med_focuspoint\",\"rex_effect_focuspoint_fit_focus\":\"\",\"rex_effect_focuspoint_fit_width\":\"\",\"rex_effect_focuspoint_fit_height\":\"\",\"rex_effect_focuspoint_fit_zoom\":\"0%\"},\"rex_effect_filter_brightness\":{\"rex_effect_filter_brightness_brightness\":\"\"},\"rex_effect_flip\":{\"rex_effect_flip_flip\":\"X\"},\"rex_effect_image_format\":{\"rex_effect_image_format_convert_to\":\"webp\"},\"rex_effect_filter_contrast\":{\"rex_effect_filter_contrast_contrast\":\"\"},\"rex_effect_filter_sharpen\":{\"rex_effect_filter_sharpen_amount\":\"80\",\"rex_effect_filter_sharpen_radius\":\"0.5\",\"rex_effect_filter_sharpen_threshold\":\"3\"},\"rex_effect_resize\":{\"rex_effect_resize_width\":\"\",\"rex_effect_resize_height\":\"\",\"rex_effect_resize_style\":\"maximum\",\"rex_effect_resize_allow_enlarge\":\"enlarge\"},\"rex_effect_filter_blur\":{\"rex_effect_filter_blur_repeats\":\"10\",\"rex_effect_filter_blur_type\":\"gaussian\",\"rex_effect_filter_blur_smoothit\":\"\"},\"rex_effect_mirror\":{\"rex_effect_mirror_height\":\"\",\"rex_effect_mirror_opacity\":\"100\",\"rex_effect_mirror_set_transparent\":\"colored\",\"rex_effect_mirror_bg_r\":\"\",\"rex_effect_mirror_bg_g\":\"\",\"rex_effect_mirror_bg_b\":\"\"},\"rex_effect_header\":{\"rex_effect_header_download\":\"open_media\",\"rex_effect_header_cache\":\"no_cache\",\"rex_effect_header_filename\":\"filename\",\"rex_effect_header_index\":\"index\"},\"rex_effect_convert2img\":{\"rex_effect_convert2img_convert_to\":\"jpg\",\"rex_effect_convert2img_density\":\"150\",\"rex_effect_convert2img_color\":\"\"},\"rex_effect_mediapath\":{\"rex_effect_mediapath_mediapath\":\"\"}}',	3,	'2024-01-31 16:02:38',	'admin',	'2024-01-31 16:02:38',	'admin'),
(100,	'filter_blur',	'{\"rex_effect_rounded_corners\":{\"rex_effect_rounded_corners_topleft\":\"\",\"rex_effect_rounded_corners_topright\":\"\",\"rex_effect_rounded_corners_bottomleft\":\"\",\"rex_effect_rounded_corners_bottomright\":\"\"},\"rex_effect_workspace\":{\"rex_effect_workspace_set_transparent\":\"colored\",\"rex_effect_workspace_width\":\"\",\"rex_effect_workspace_height\":\"\",\"rex_effect_workspace_hpos\":\"left\",\"rex_effect_workspace_vpos\":\"top\",\"rex_effect_workspace_padding_x\":\"0\",\"rex_effect_workspace_padding_y\":\"0\",\"rex_effect_workspace_bg_r\":\"\",\"rex_effect_workspace_bg_g\":\"\",\"rex_effect_workspace_bg_b\":\"\",\"rex_effect_workspace_bgimage\":\"\"},\"rex_effect_crop\":{\"rex_effect_crop_width\":\"\",\"rex_effect_crop_height\":\"\",\"rex_effect_crop_offset_width\":\"\",\"rex_effect_crop_offset_height\":\"\",\"rex_effect_crop_hpos\":\"center\",\"rex_effect_crop_vpos\":\"middle\"},\"rex_effect_insert_image\":{\"rex_effect_insert_image_brandimage\":\"\",\"rex_effect_insert_image_hpos\":\"left\",\"rex_effect_insert_image_vpos\":\"top\",\"rex_effect_insert_image_padding_x\":\"-10\",\"rex_effect_insert_image_padding_y\":\"-10\"},\"rex_effect_rotate\":{\"rex_effect_rotate_rotate\":\"0\"},\"rex_effect_filter_colorize\":{\"rex_effect_filter_colorize_filter_r\":\"\",\"rex_effect_filter_colorize_filter_g\":\"\",\"rex_effect_filter_colorize_filter_b\":\"\"},\"rex_effect_image_properties\":{\"rex_effect_image_properties_jpg_quality\":\"\",\"rex_effect_image_properties_png_compression\":\"\",\"rex_effect_image_properties_webp_quality\":\"\",\"rex_effect_image_properties_avif_quality\":\"\",\"rex_effect_image_properties_avif_speed\":\"\",\"rex_effect_image_properties_interlace\":null},\"rex_effect_focuspoint_fit\":{\"rex_effect_focuspoint_fit_meta\":\"med_focuspoint\",\"rex_effect_focuspoint_fit_focus\":\"\",\"rex_effect_focuspoint_fit_width\":\"\",\"rex_effect_focuspoint_fit_height\":\"\",\"rex_effect_focuspoint_fit_zoom\":\"0%\"},\"rex_effect_filter_brightness\":{\"rex_effect_filter_brightness_brightness\":\"\"},\"rex_effect_flip\":{\"rex_effect_flip_flip\":\"X\"},\"rex_effect_image_format\":{\"rex_effect_image_format_convert_to\":\"webp\"},\"rex_effect_filter_contrast\":{\"rex_effect_filter_contrast_contrast\":\"\"},\"rex_effect_filter_sharpen\":{\"rex_effect_filter_sharpen_amount\":\"80\",\"rex_effect_filter_sharpen_radius\":\"0.5\",\"rex_effect_filter_sharpen_threshold\":\"3\"},\"rex_effect_resize\":{\"rex_effect_resize_width\":\"\",\"rex_effect_resize_height\":\"\",\"rex_effect_resize_style\":\"maximum\",\"rex_effect_resize_allow_enlarge\":\"enlarge\"},\"rex_effect_filter_blur\":{\"rex_effect_filter_blur_repeats\":\"1\",\"rex_effect_filter_blur_type\":\"gaussian\",\"rex_effect_filter_blur_smoothit\":\"0\"},\"rex_effect_mirror\":{\"rex_effect_mirror_height\":\"\",\"rex_effect_mirror_opacity\":\"100\",\"rex_effect_mirror_set_transparent\":\"colored\",\"rex_effect_mirror_bg_r\":\"\",\"rex_effect_mirror_bg_g\":\"\",\"rex_effect_mirror_bg_b\":\"\"},\"rex_effect_header\":{\"rex_effect_header_download\":\"open_media\",\"rex_effect_header_cache\":\"no_cache\",\"rex_effect_header_filename\":\"filename\",\"rex_effect_header_index\":\"index\"},\"rex_effect_convert2img\":{\"rex_effect_convert2img_convert_to\":\"jpg\",\"rex_effect_convert2img_density\":\"150\",\"rex_effect_convert2img_color\":\"\"},\"rex_effect_mediapath\":{\"rex_effect_mediapath_mediapath\":\"\"}}',	2,	'2024-01-31 17:00:23',	'admin',	'2024-01-31 17:00:23',	'admin');
-- --------------------------------------------------------


--
-- Daten für Tabelle `rex_module`
--
DELETE FROM `rex_module`;

--
-- Daten für Tabelle `rex_template`
--

SET NAMES utf8mb4;

DELETE FROM `rex_template`;


-- --------------------------------------------------------

--
-- Daten für Tabelle `rex_markitup_profiles`
--

INSERT INTO `rex_markitup_profiles` (`id`, `name`, `description`, `urltype`, `minheight`, `maxheight`, `type`, `markitup_buttons`) VALUES
(3,	'markdown_massif',	'Markdown MASSIF configuration',	'relative',	300,	800,	'markdown',	'groupheading[1|2|3|4|5|6],italic,bold,deleted,sub,sup,unorderedlist,orderedlist,grouplink[file|internal|external|mailto],media,quote,code,table');
-- 2025-08-29 09:45:40 UTC


-- --------------------------------------------------------

--
-- Daten für Tabelle `rex_redactor_profile`
--

INSERT INTO `rex_redactor_profile` (`id`, `name`, `description`, `min_height`, `max_height`, `plugin_counter`, `plugin_limiter`, `plugins`, `settings`) VALUES
(1,	'default',	'',	200,	100,	1,	'',	'html,|,undo,redo,|,h1,h2,h3,h4,format[p],bold,italic,ol,ul,indent,outdent,|,blockquote,|,image,linkExternal,linkInternal,linkMedia',	'');
-- 2025-09-03 12:11:37 UTC

-- --------------------------------------------------------

--
-- Daten für Tabelle `rex_config`
--

DELETE FROM `rex_config` WHERE `namespace` = 'sprog';
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
('sprog',	'wildcard_close_tag',	'\" }}\"'),
('sprog',	'wildcard_open_tag',	'\"{{ \"');
UPDATE `rex_config` SET `value` = 'true' WHERE `namespace` = 'uploader' AND `key` = 'filename-as-title-checked';
UPDATE `rex_config` SET `value` = '3000' WHERE `namespace` = 'uploader' AND `key` = 'image-max-width';
UPDATE `rex_config` SET `value` = '3000' WHERE `namespace` = 'uploader' AND `key` = 'image-max-height';
INSERT INTO `rex_config` (`namespace`, `key`, `value`) VALUES
('block_peek',	'template',	'\"<?php\\r\\n    $clang = rex_clang::getCurrent();\\r\\n    $langCode = $clang ? $clang->getCode() : \'en\';\\r\\n    $assets = \\\\Ynamite\\\\ViteRex\\\\Assets::get();\\r\\n\\r\\n?>\\r\\n<!DOCTYPE html>\\r\\n<html lang=\\\"<?=$langCode?>\\\">\\r\\n<head>\\r\\n    <meta charset=\\\"UTF-8\\\">\\r\\n    <meta name=\\\"viewport\\\" content=\\\"width=device-width, initial-scale=1\\\">\\r\\n    <?=$assets[\'preload\'] . $assets[\'criticalCSS\'] . $assets[\'css\']?>\\r\\n<\\/head>\\r\\n<body class=\\\"bg-body\\\">\\r\\n    {{block_peek_content}}\\r\\n    <?=$assets[\'js\']?>\\r\\n<\\/body>\\r\\n<\\/html>\"');

-- --------------------------------------------------------

--
-- Daten für Tabelle `be_tools`
--

DELETE FROM `rex_config` WHERE `namespace` = 'be_tools';
INSERT INTO `rex_config` (`namespace`, `key`, `value`) VALUES
('be_tools',	'config',	'{\"be_hplink\":\"checked\",\"be_minnav\":\"\",\"be_minsidebar\":\"\",\"be_gototop\":\"checked\",\"be_tree\":\"top\",\"be_tree_menu\":\"\",\"be_tree_shortnames\":\"\",\"be_tree_showid\":\"\",\"be_tree_onlystructure\":\"checked\",\"be_tree_activemode\":\"checked\",\"be_tree_persist\":\"checked\",\"be_mediapool_usesort\":\"\",\"be_mediapool_sort\":\"name|asc\",\"be_crop\":\"\",\"be_crop_pre1\":\"\",\"be_crop_pre2\":\"\",\"be_crop_pre3\":\"\",\"be_crop_pre4\":\"\",\"be_crop_pre5\":\"\",\"be_collapse_addons\":\"\",\"be_collapse_ycom\":\"\",\"be_collapse_yformmanager\":\"\",\"be_slicetimer\":\"\",\"be_slicetimer_workversion\":\"\",\"be_slicetimer_infoblock\":\"\"}');


-- --------------------------------------------------------

--
-- Daten für Tabelle `emailobfuscator`
--

DELETE FROM rex_config WHERE `namespace` = 'emailobfuscator';
INSERT INTO `rex_config` (`namespace`, `key`, `value`) VALUES 
('emailobfuscator',	'articles',	'\"\"'),
('emailobfuscator',	'autoload_css',	'false'),
('emailobfuscator',	'autoload_js',	'false'),
('emailobfuscator',	'mailto_only',	'false'),
('emailobfuscator',	'method',	'\"rot13_unicorn\"'),
('emailobfuscator',	'templates',	'[]');
