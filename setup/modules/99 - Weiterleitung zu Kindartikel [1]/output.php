<?php
if(!rex::isBackend()) {
    $cat = rex_article::get($this->getValue("id"))->getCategory();
    if($cat) {
        $children = $cat->getChildren();
        if(count($children)>=1){
            $kid = $children[0];
            rex_response::setStatus(rex_response::HTTP_MOVED_PERMANENTLY);
            rex_response::sendRedirect(rex_getUrl($kid->getId()));
        }
    }
}
?>