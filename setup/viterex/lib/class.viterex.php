<?php
/*
 *  Class with utility functions for loading scripts in templates
 */

namespace Ynamite\ViteRex;

use Dotenv\Dotenv;
use rex;
use rex_be_controller;
use rex_file;
use rex_finder;
use rex_path;
use rex_url;
use rex_ydeploy;

use function file_exists;
use function str_starts_with;
use function strtolower;

/** @api */
final class ViteRex
{
  private static ?self $instance = null;

  // private string $distUri = '';
  // private string $distPath = '';
  // private string $viteServer = '';
  // private string $viteEntryPoint = '';
  // private string $viteManifestPath = '';

  private string $buildPath;
  private string $buildUrl;
  private string $devServerUrl;
  private string $entryPoint;
  private bool $isDev;
  private array $manifest = [];
  private string $manifestPath;

  public function __construct()
  {
    $dotenv = Dotenv::createImmutable(rex_path::base(), ['.env', '.env.local', '.env.development', '.env.production'], false);
    $dotenv->load();

    $this->buildUrl = $_ENV['VITE_DIST_DIR'] ?: '/dist';
    $this->buildPath = isset($_ENV['VITE_PUBLIC_DIR']) ? rex_path::base(ltrim($_ENV['VITE_PUBLIC_DIR'], '/') . $this->buildUrl) : rex_path::base('public' . $this->buildUrl);
    $this->devServerUrl = isset($_ENV['VITE_DEV_SERVER']) ? $_ENV['VITE_DEV_SERVER'] . ':' . $_ENV['VITE_DEV_SERVER_PORT'] : 'http://localhost:3000';
    $this->entryPoint = $_ENV['VITE_ENTRY_POINT'] ?: '/index.js';
    $this->manifestPath = $this->buildPath . '/.vite/manifest.json';

    $this->isDev = $this->isDevServerRunning();
    // dd($this->devServerUrl);

    $this->checkGitBranch('main');
    $this->checkDebugMode();
  }

  public static function factory(): self
  {
    if (self::$instance) {
      return self::$instance;
    }

    return self::$instance = new self();
  }

  private function isDevServerRunning(): bool
  {
    // Check if Vite dev server is accessible
    $context = stream_context_create([
      'http' => [
        'timeout' => 1,
        'ignore_errors' => true,
      ],
      'ssl' => [
        'verify_peer' => false,
        'verify_peer_name' => false,
      ]
    ]);
    return @file_get_contents($this->devServerUrl . '/@vite/client', false, $context) !== false;
  }

  /**
   *  outputs tags and paths for assets in dev and production environments
   *  @return array<string> html
   */
  public static function getAssets(): array
  {
    $instance = self::factory();

    // preload webfonts
    $webfontsPreload = $instance->getWebfontsPreload();

    if ($instance->isDev) {
      return [
        'preload' => $webfontsPreload,
        'criticalCSS' => '',
        'css' => '<link rel="stylesheet" href="' . self::getAssetsUrl() . 'css/style.css" media="all">', // Vite injects CSS in dev mode
        'js' => '<script type="module" src="' . $instance->devServerUrl . '/@vite/client"></script>' .
          '<script type="module" src="' . $instance->devServerUrl . $instance->entryPoint . '"></script>'
      ];
    }

    // Production: Read manifest.json
    $manifest = $instance->getManifestArray();
    $entryPoint = trim($instance->entryPoint, '/');
    $entry = $manifest[$entryPoint];

    $criticalPath = $instance->buildPath . "/assets/critical.css";
    $criticalCSS = file_exists($criticalPath) ? '<style>' . rex_file::get($criticalPath) . '</style>' : '';

    return [
      'preload' => $webfontsPreload,
      'criticalCSS' => $criticalCSS,
      'css' => '<link rel="stylesheet" href="' . $instance->buildUrl . '/' . $entry['css'][0] . '" media="print" onload="this.media=\'all\'">',
      'js' => '<script type="module" src="' . $instance->buildUrl . '/' . $entry['file'] . '"></script>'
    ];
  }

  /**
   * Get preload links for webfonts
   * 
   * @return string
   */
  public function getWebfontsPreload(): string
  {
    $preloadArray = [];

    if ($this->isDev) {
      foreach (rex_finder::factory(self::getAssetsPath() . 'fonts')->filesOnly()->sort() as $file) {
        $preloadArray[] = '<link rel="preload" href="' . self::getAssetsUrl() . 'fonts/' . $file->getFilename() . '" as="font" type="font/' . $file->getExtension() . '" crossorigin>';
      }
    } else {
      $manifest = $this->getManifestArray();
      $entryPoint = trim($this->entryPoint, '/');
      $entry = $manifest[$entryPoint];

      // Preload web fonts
      foreach ($entry['assets'] as $asset) {
        // check if is font woff2|woff|ttf|otf
        $extension = pathinfo($asset, PATHINFO_EXTENSION);
        if (in_array(strtolower($extension), ['woff2', 'woff', 'ttf', 'otf'])) {
          $preloadArray[] = '<link rel="preload" href="' . $this->buildUrl . '/' . $asset . '" as="font" type="font/' . $extension . '" crossorigin>';
        }
      }
    }
    return implode("\n", $preloadArray);
  }

  /**
   *  get manifest data as array
   *  @return array
   */
  public function getManifestArray(): array
  {
    if (!empty($this->manifest)) {
      return $this->manifest;
    }
    $manifest = rex_file::get($this->manifestPath);
    if (!$manifest) {
      $this->manifest = [];
    }
    $this->manifest = array_reverse(json_decode($manifest, true));
    return $this->manifest;
  }

  /**
   *  sets key/value pairs
   *  @param string $key Key to set
   *  @param string $value Value to set
   *  @return void
   */
  public static function setValue($key, $value): void
  {
    self::${$key} = $value;
  }

  /**
   *  get asset content
   *  @param string $filename Filename to get
   *  @param string $dir Directory to get from
   *  @return string
   */
  public static function getAsset($file, $dir = ''): string|null
  {
    return rex_file::get(self::getAssetsPath() . $dir . '/' . $file);
  }

  /**
   *  get image content
   *  @param string $filename Filename to get
   *  @return string
   */
  public static function getImg($name): string|null
  {
    return self::getAsset($name, 'img');
  }

  /**
   *  get css content
   *  @param string $filename Filename to get
   *  @return string
   */
  public static function getCss($name): string
  {
    return self::getAsset($name, 'css');
  }

  /**
   *  get font content
   *  @param string $filename Filename to get
   *  @return string
   */
  public static function getFont($name): string
  {
    return self::getAsset($name, 'fonts');
  }

  /**
   *  get js content
   *  @param string $filename Filename to get
   *  @return string
   */
  public static function getJs($name): string
  {
    return self::getAsset($name, 'js');
  }

  /**
   *  get assets path
   *  @return string
   */
  public static function getAssetsPath(): string
  {
    $instance = self::factory();
    return $instance->isDev ? rex_path::base('src/assets/') : $instance->buildPath . '/assets/';
  }

  /**
   *  get assets url
   *  @return string
   */
  public static function getAssetsUrl(): string
  {
    $instance = self::factory();
    return $instance->isDev ? $instance->devServerUrl . rex_url::base('src/assets/') : $instance->buildUrl . '/assets/';
  }

  /**
   *  get current git branch
   *  @return string
   */
  public static function getGitBranch(): string
  {
    $contents = rex_file::get(rex_path::base('.git/HEAD')); //read the file
    $explodedstring = explode("/", $contents, 3); //seperate out by the "/" in the string
    return trim($explodedstring[2]); //get the one that is always the branch name
  }

  /**
   *  check if dev branch is active if in dev mode or display warning
   *  @return void
   */
  public function checkGitBranch($branch = 'dev'): void
  {
    $isMediaPool = false;
    if (rex::isBackend()) {
      $pagePart1 = rex_be_controller::getCurrentPagePart(1);
      $pagePart2 = rex_be_controller::getCurrentPagePart(2);
      $isMediaPool = $pagePart1 === 'mediapool';
      $isUploaderEndpoint = $pagePart1 === 'uploader' && $pagePart2 === 'endpoint';
      if ($isMediaPool || $isUploaderEndpoint) {
        return;
      }
    }
    if (!file_exists(rex_path::base('.git'))) return;
    if ($this->isDev) {
      $currentBranch = self::getGitBranch();
      if ($currentBranch !== $branch)
        echo '<div style="z-index: 1000; position: sticky; top: 0; left: 0; right: 0; background: red; color: white; padding: 1rem; font-size: 1.5rem; text-align: center;">You are not on the dev branch! Current branch: ' . $branch . '</div>';
    }
  }

  /**
   *  check if debug mode is active and set it if not
   *  @return void
   */
  public function checkDebugMode(): void
  {
    $isDebugMode = rex::isDebugMode();
    if ($this->isDev) {
      if (!$isDebugMode) {
        self::setDebugMode(true);
      }
    } else {
      if (self::isProductionDeployment() && $isDebugMode) {
        self::setDebugMode(false);
      } else if (!$isDebugMode) {
        self::setDebugMode(true);
      }
    }
  }

  /**
   *  set debug mode
   *  @param boolean $mode Debug mode to set
   *  @return void
   */
  public static function setDebugMode($mode): void
  {
    $configFile = rex_path::coreData('config.yml');
    $config =
      rex_file::getConfig($configFile);

    if (!is_array($config['debug'])) {
      $config['debug'] = [];
    }

    $config['debug']['enabled'] = $mode;
    rex::setProperty('debug', $mode);
    rex_file::putConfig($configFile, $config);
  }

  /**
   * Check if the current environment is a production deployment
   * @return bool
   */
  public static function isProductionDeployment(): bool
  {
    $ydeploy = rex_ydeploy::factory();
    if ($ydeploy->isDeployed()) {
      $stage = strtolower($ydeploy->getStage());
      return str_starts_with($stage, 'prod');
    }
    return false;
  }
}
