<?php
/*
 * Redaxo CMS VITE JIT development
 * Inspired by https://github.com/andrefelipe/vite-php-setup
 *
 *  @author      ynamite @ GitHub <https://github.com/ynamite/viterex>
 *  @version     1.0.0
 *
 *  For copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  ------------------------------------------------------------------------------------------------
 *
 *  Class with utility functions for loading scripts in templates
 */

namespace Ynamite\ViteRex;

use rex_file;
use rex_path;
use rex_url;

/** @api */
class ViteRex
{
  /** @var boolean */
  private static $isDev = false;
  /** @var string */
  private static $distUri = '';
  /** @var string */
  private static $distPath = '';
  /** @var string */
  private static $viteServer = '';
  /** @var string */
  private static $viteEntryPoint = '';
  /** @var string */
  private static $viteManifestPath = '';

  /**
   *  outputs tags and paths for assets in dev and production environments
   *  @return string html
   */
  public static function getAssets()
  {
    $html = '';
    if (self::$isDev) {
      $html .= '<script type="module" crossorigin src="' . self::$viteServer . self::$viteEntryPoint . '"></script>';
    } else {
      $manifestArray = self::getManifestArray();
      if (is_array($manifestArray)) {
        foreach ($manifestArray as $key => $dependency) {
          if (isset($dependency['isEntry']) && $dependency['isEntry'] === true) {
            $pathInfo = pathinfo($dependency['file']);
            if ($pathInfo['extension'] !== 'js') continue;
            $cssFiles = isset($dependency['css']) ? $dependency['css'] : [];
            foreach ($cssFiles as $cssFile) {
              $html .= '<link rel="stylesheet" href="' . self::$distUri . '/' . $cssFile . '">';
            }
            $html .= '<script type="module" crossorigin src="' . self::$distUri  . '/' . $dependency['file'] . '"></script>';
          }
        }
      }
    }
    return $html;
  }

  /**
   *  outputs critical css in production for a specific article
   *  @return string html
   */
  public static function getCriticalCss($loadInDev = false)
  {
    if (self::$isDev && !$loadInDev) return;
    $manifestArray = self::getManifestArray();
    $key = 'assets/css/critical.css';
    $criticalCss = isset($manifestArray[$key]) ? $manifestArray[$key] : null;
    if (!$criticalCss) return;
    $criticalCssPath = self::$distPath . '/' . $criticalCss['file'];
    if (!file_exists($criticalCssPath)) return;
    $html = '<style>';
    $html .= rex_file::get($criticalCssPath);
    $html .= '</style>';
    return $html;
  }

  /**
   *  get manifest data as array
   *  @return array
   */
  public static function getManifestArray()
  {
    $manifest = rex_file::get(self::$viteManifestPath);
    return array_reverse(json_decode($manifest, true));
  }

  /**
   *  sets key/value pairs
   *  @param string $key Key to set
   *  @param string $value Value to set
   *  @return void
   */
  public static function setValue($key, $value)
  {
    self::${$key} = $value;
  }

  /**
   *  get asset content
   *  @param string $filename Filename to get
   *  @param string $dir Directory to get from
   *  @return string
   */
  public static function getAsset($name, $dir = '')
  {
    return rex_file::get(self::getAssetsPath() . $dir . '/' . $name);
  }

  /**
   *  get image content
   *  @param string $filename Filename to get
   *  @return string
   */
  public static function getImg($name)
  {
    return self::getAsset($name, 'img');
  }

  /**
   *  get css content
   *  @param string $filename Filename to get
   *  @return string
   */
  public static function getCss($name)
  {
    return self::getAsset($name, 'css');
  }

  /**
   *  get font content
   *  @param string $filename Filename to get
   *  @return string
   */
  public static function getFont($name)
  {
    return self::getAsset($name, 'fonts');
  }

  /**
   *  get js content
   *  @param string $filename Filename to get
   *  @return string
   */
  public static function getJs($name)
  {
    return self::getAsset($name, 'js');
  }

  /**
   *  get assets path
   *  @return string
   */
  public static function getAssetsPath()
  {
    return self::$isDev ? rex_path::base('assets/') : self::$distPath . '/assets/';
  }

  /**
   *  get assets url
   *  @return string
   */
  public static function getAssetsUrl()
  {
    return self::$isDev ? rex_url::base('assets/') : self::$distUri . '/assets/';
  }
}
