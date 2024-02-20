<?php

namespace Ynamite\ViteRex;

use rex_addon;
use rex_config;
use rex_file;
use rex_sql;
use rex_path;
use rex_string;
use rex_exception;
use rex_functional_exception;
use rex_developer_manager;

class Favicon
{
  private static $addonName = 'viterex';

  public static function generateFaviconData()
  {
    try {
      $shellOutput = exec('source ~/.zshrc && cd ' . rex_path::base() . ' && yarn generate-favicon 2>&1');
      if (!str_contains($shellOutput, 'Done'))
        throw new rex_exception($shellOutput);
      $favIconData = rex_file::get(rex_path::base('faviconData.json'));
      if ($favIconData) {
        $favIconData = json_decode($favIconData, true);
        $favIconData['favicon']['html_code'] .= "\n<link rel=\"icon\" type=\"image/ico\" href=\"/favicon.ico\">\n<meta name=\"msapplication-config\" content=\"browserconfig.xml\" />\n";
        $sql = rex_sql::factory();
        $sql->setTable('rex_template');
        $sql->setWhere(['key' => 'html-favicon']);
        $sql->setValue('content', $favIconData['favicon']['html_code']);
        $sql->update();
        rex_developer_manager::start(true);
        return $favIconData['favicon']['html_code'];
      }
    } catch (rex_functional_exception $e) {
      dump($e);
    }
  }

  public static function beGenerateFaviconDataFromFields()
  {
    $addon = rex_addon::get(self::$addonName);
    $page = 'favicon';
    $pages = $addon->getProperty('page');
    $fields = $pages['subpages'][$page]['fields'];

    $addonName = $addon->getName();

    $map = [
      'master' => '["masterPicture"]',
      'name' => '["design"]["androidChrome"]["manifest"]["name"]',
      'desktop_bg' => '["design"]["desktopBrowser"]["backgroundColor"]',
      'desktop_radius' => '["design"]["desktopBrowser"]["backgroundRadius"]',
      'desktop_scale' => '["design"]["desktopBrowser"]["imageScale"]',
      'ios_bg' => '["design"]["ios"]["backgroundColor"]',
      'ios_margin' => '["design"]["ios"]["margin"]',
      'win_bg' => '["design"]["windows"]["backgroundColor"]',
      'android_margin' => '["design"]["androidChrome"]["margin"]',
      'android_bg' => '["design"]["androidChrome"]["backgroundColor"]',
      'android_theme' => '["design"]["androidChrome"]["themeColor"]',
      'safari_theme' => '["design"]["safariPinnedTab"]["themeColor"]',
    ];
    $values = rex_config::get($addonName);
    $json = rex_file::get($addon->getPath('data') . '/faviconDescription.json');
    if ($json) {
      $jsonData = json_decode($json, true);
      foreach ($fields as $field) {
        $name = $page . '_' . rex_string::normalize($field['name']);
        $value = isset($values[$name]) ? $values[$name] : '';
        if (isset($map[$field['name']])) {
          eval('$jsonData' . $map[$field['name']] . ' = $value;');
          eval('$value = $jsonData' . $map[$field['name']] . ';');
          rex_config::set($addonName, $name, $value);
          if ($field['name'] == 'desktop_bg') {
            $jsonData["design"]["desktopBrowser"]["design"] = $value === '' ? 'raw' : 'background';
          }
        }
      }
      $json = rex_file::put($addon->getDataPath('faviconDescription.json'), json_encode($jsonData, JSON_PRETTY_PRINT));
    }
    if (self::generateFaviconData()) {
      return true;
    }
  }
}
