<?php

use Ynamite\Massif\Nav;

$settings = rex_config::get('massif_settings');
?>
<footer id="footer" class="lg:grid lg:grid-cols-2 xl:grid-cols-4 links-underlined-i footer section-p lg:~gap-x-10/20">
	<div>
		<div>{{address_firma}}</div>
		<?php if (isset($settings['address_zusatz']) && $settings['address_zusatz']) { ?>
			<div>{{address_zusatz}}</div>
		<?php } ?>
	</div>
	<div>
		<?php if (isset($settings['address_phone']) && $settings['address_phone']) { ?>
			<div>T {{address_phone_html}}</div>
		<?php } ?>
		<?php if (isset($settings['address_e_mail']) && $settings['address_e_mail']) { ?>
			<div>{{address_e-mail_html}}</div>
		<?php } ?>
	</div>
	<div>
		<?= Nav::articles() ?>
	</div>
	<div>
		<?php if (isset($settings['social_instagram']) && $settings['social_instagram']) { ?>
			<div>
				<a href="{{social_instagram}}" target="_blank">Instagram</a>
			</div>
		<?php } ?>
		<?php if (isset($settings['social_linkedin']) && $settings['social_linkedin']) { ?>
			<div>
				<a href="{{social_linkedin}}" target="_blank">LinkedIn</a>
			</div>
		<?php } ?>
	</div>
</footer>