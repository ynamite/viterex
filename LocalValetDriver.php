
<?php

use Valet\Drivers\LaravelValetDriver;

class LocalValetDriver extends LaravelValetDriver
{

  public function getUrlParts($uri)
  {
    $uriParts = array_filter(explode('/', $uri));
    return $uriParts;
  }

  /**
   * Determine if the driver serves the request.
   */
  public function serves(string $sitePath, string $siteName, string $uri): bool
  {

    $uriParts = $this->getUrlParts($uri);
    switch ($uriParts[1]) {
      case 'sitemap.xml':
        $_REQUEST['rex_yrewrite_func'] = 'sitemap';
        break;
      case 'robots.txt':
        $_REQUEST['rex_yrewrite_func'] = 'robots';
        break;
      case 'mediatypes':
      case 'media':
        $mmType = $uriParts[2];
        $mmFile = $uriParts[3];
        if ($mmType && $mmFile) {
          $_GET['rex_media_type'] = $mmType;
          $_GET['rex_media_file'] = $mmFile;
        }
        break;
    }

    return file_exists($sitePath . '/public/index.php') &&
      file_exists($sitePath . '/artisan');
  }
}
