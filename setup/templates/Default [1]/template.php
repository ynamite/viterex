REX_TEMPLATE[key="config"]

REX_TEMPLATE[key="html-head"]

<body class="<?= $pageClass ?> bg-white text-primary font-sans">

	REX_TEMPLATE[key="header"]

	<div class="content-wrap">
		<main role="main" class="content content-main" id="content" data-sp="<?= rex_getUrl(rex_article::getSiteStartArticleId()); ?>" data-lang-code="<?= rex_clang::getCurrent()->getCode() ?>" data-logo-href="<?= rex_getUrl(rex_article::getSiteStartArticleId()) ?>">
			Benutzer: admin<br />Passwort: sys64Bl00d$<?php
			$articleContent = $this->getArticle(1);
			echo $articleContent;
			?>
		</main>
	</div>

	REX_TEMPLATE[key="footer"]

	REX_TEMPLATE[key="html-scripts"]

</body>
<?php if (!rex::getProperty('req-with')) echo '</html>'; ?>