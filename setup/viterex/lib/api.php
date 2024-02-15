<?php

use Ynamite\ViteRex\ConfigForm;
use Ynamite\ViteRex\Favicon;

class rex_api_viterex extends rex_api_function
{
  protected $published = false;

  function execute()
  {

    $action = rex_request('action', 'string', '');

    $payload = $this->getPayload();

    try {
      switch ($action) {
        case 'generateFavicon':
          $message = $this->generateFavicon();
          break;
      }
      $success = true;
    } catch (rex_api_exception $e) {
      $message = $e->getMessage();
      $success = false;
    }
    $rex_api_result = new rex_api_result($success, $message);
    die($rex_api_result->toJSON());
  }

  private function generateFavicon()
  {
    try {
      $form = ConfigForm::getForm('favicon');
      $result = $form->manualSave();
      //$result = Favicon::generateFaviconData();
    } catch (rex_exception $e) {
      throw new rex_api_exception($e->getMessage());
    }
    return $result;
  }

  private function getPayload()
  {
    $contentType = isset($_SERVER["CONTENT_TYPE"]) ? trim($_SERVER["CONTENT_TYPE"]) : '';
    if ($contentType === "application/json") {
      $content = json_decode(file_get_contents("php://input"), true);
      return $content;
    } else {
      return $_REQUEST;
    }
  }
}
