<?php
if(!rex::isBackend()) {
    if("REX_LINK[1]") {
        rex_response::setStatus(rex_response::HTTP_MOVED_PERMANENTLY);
        rex_response::sendRedirect(rex_getUrl("REX_LINK[1]"));
    } else if("REX_VALUE[id=1]"){
        rex_response::sendRedirect("REX_VALUE[id=1]");
    }
} else {
    $link = ("REX_LINK[1]") ? rex_getUrl("REX_LINK[1]") : "REX_VALUE[id=1]";
    echo '<p>Weiterleitung zu <b>'.$link.'</b></p>';
}
?>