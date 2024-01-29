
<?php

use Valet\Drivers\LaravelValetDriver;

class LocalValetDriver extends LaravelValetDriver
{

  protected $hasPublicDirectory = false;

  /**
   * Emulate the REDAXO CMS .htaccess file
   */
  public function emulateRedaxoHtaccess($uri)
  {
    $uriParts = array_filter(explode('/', $uri));
    switch ($uriParts[1]) {
      case 'sitemap.xml':
        $_REQUEST['rex_yrewrite_func'] = 'sitemap';
        break;
      case 'robots.txt':
        $_REQUEST['rex_yrewrite_func'] = 'robots';
        break;
      case 'mediatypes':
      case 'media':
        $mmType = isset($uriParts[2]) ? $uriParts[2] : null;
        $mmFile = isset($uriParts[3]) ? $uriParts[3] : null;
        if ($mmType && $mmFile) {
          $_GET['rex_media_type'] = $mmType;
          $_GET['rex_media_file'] = $mmFile;
        }
        break;
    }
  }

  /**
   * Get the path to the application's front controller.
   */
  public function getPublicPath($sitePath)
  {
    $publicPath = $sitePath . '/';
    if ($this->hasPublicDirectory) {
      $publicPath .= 'public/';
    }
    return $publicPath;
  }

  /**
   * Determine if the driver serves the request.
   */
  public function serves(string $sitePath, string $siteName, string $uri): bool
  {
    $this->hasPublicDirectory = is_dir($sitePath . '/public/');
    return ($this->hasPublicDirectory && file_exists($sitePath . '/public/redaxo/index.php')) || file_exists($sitePath . '/redaxo/index.php');
  }

  /**
   * Take any steps necessary before loading the front controller for this driver.
   */
  public function beforeLoading(string $sitePath, string $siteName, string $uri): void
  {
    $this->emulateRedaxoHtaccess($uri);
  }

  /**
   * Determine if the incoming request is for a static file.
   */
  public function isStaticFile(string $sitePath, string $siteName, string $uri)/*: string|false */
  {
    $publicPath = $this->getPublicPath($sitePath) . trim($uri, '/');
    if ($this->isActualFile($publicPath)) {
      return $publicPath;
    } elseif (file_exists($publicPath . '/index.html')) {
      return $publicPath . '/index.html';
    }

    return false;
  }

  /**
   * Get the fully resolved path to the application's front controller.
   */
  public function frontControllerPath(string $sitePath, string $siteName, string $uri): ?string
  {
    $_SERVER['PHP_SELF'] = $uri;
    $_SERVER['SERVER_ADDR'] = '127.0.0.1';
    $_SERVER['SERVER_NAME'] = $_SERVER['HTTP_HOST'];

    $docRoot = $this->getPublicPath($sitePath);
    $uri = rtrim($uri, '/');

    $candidates = [
      $docRoot . $uri,
      $docRoot . $uri . '/index.php',
      $docRoot . '/index.php',
    ];

    foreach ($candidates as $candidate) {
      if ($this->isActualFile($candidate)) {
        $_SERVER['SCRIPT_FILENAME'] = $candidate;
        $_SERVER['SCRIPT_NAME'] = str_replace($docRoot, '', $candidate);
        $_SERVER['DOCUMENT_ROOT'] = $docRoot;

        return $candidate;
      }
    }

    return null;
  }
}
