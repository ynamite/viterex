<script>
  window.lazySizesConfig = window.lazySizesConfig || {};
  const app = {
    lang: {
      'code': '<?= rex_clang::getCurrent()->getValue('code') ?>',
      'weiterlesen': "{{mehr}}",
      'keineTreffer': "{{keine Suchtreffer}}"
    }
  };
</script>
<?= \Ynamite\ViteRex\ViteRex::getAssets() ?>