
<?php

use Valet\Drivers\LaravelValetDriver;

class LocalValetDriver extends LaravelValetDriver
{

  protected $hasPublicDirectory = false;


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

    $docRoot = rtrim($this->getPublicPath($sitePath), '/');
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

  /**
   * Get the logs paths for the application to show in Herds log viewer.
   */
  public function logFilesPaths()
  {
    return ["/var/log"];
  }

  /**
   * Display information about the application in the information tab of the Sites UI.
   * For Laravel, it's the output of the `php artisan about` command.
   */
  public function siteInformation(string $sitePath, string $phpBinary): array
  {
    $output = shell_exec('herd php bin/console system:report 2>&1');
    if ($output === null) {
      return [];
    }
    $output = trim($output);
    if (empty($output)) {
      return [];
    }

    return [
      "Overview" => [
        "Site" => $sitePath,
        // "Runway operational" => true,
      ],
      "System Info" => [
        "output" => $output
      ],
    ];
  }
}
