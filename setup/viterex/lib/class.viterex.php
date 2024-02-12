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

/** @api */
class ViteRex
{
  /** @var boolean */
  private static $isDev = false;
  /** @var string */
  private static $distUri = '';
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
      $manifest = self::$viteManifestPath;
      $manifestArray = array_reverse(json_decode($manifest, true));
      if (is_array($manifestArray)) {
        foreach ($manifestArray as $key => $dependency) {
          if (isset($dependency['isEntry']) && $dependency['isEntry'] === true) {
            // enqueue CSS files
            $cssFiles = isset($dependency['css']) ? $dependency['css'] : [];
            foreach ($cssFiles as $cssFile) {
              $html .= '<link rel="stylesheet" href="' . self::$distUri . '/' . $cssFile . '">';
            }
            // enqueue main JS file
            $html .= '<script type="module" crossorigin src="' . self::$distUri  . '/' . $dependency['file'] . '"></script>';
          }
        }
      }
    }
    return $html;
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
}
