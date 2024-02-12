const defDuration = 0.6

const $html = document.querySelector('html')
const isMobile = $html.classList.contains('is-mobile')
const isTablet = $html.classList.contains('is-tablet')

const defaults = {
  clone: true,
  injectToBody: false,
  appendElements: [],
  eventNamePrefix: 'menu',
  hamburgerHtml:
    '<div class="icon"><i class="b b-t"></i><i class="b b-c"></i><i class="b b-b"></i></div>',
  hamburgerHtmlDesktop:
    '<div class="icon"><i class="b b-t"></i><i class="b b-c"></i><i class="b b-b"></i></div>',
  listItemsSelector:
    '.rex-navi1 >li,.rex-navi2 >li, .article-nav a, .lang-nav a, .footer__claim, .footer__company, .footer__articles',
  dropdownSelector: '.has-dropdown',
  strings: {
    trigger: 'Hauptnavigations-Menü    öffnen'
  },
  animation: {
    defDuration: defDuration,
    menu: {
      from: isMobile || isTablet ? { yPercent: -100 } : { yPercent: -100 },
      to:
        isMobile || isTablet
          ? {
              yPercent: 0,
              ease: 'menueasing',
              overwrite: true,
              duration: defDuration
            }
          : {
              yPercent: 0,
              ease: 'menueasing',
              overwrite: true,
              duration: defDuration
            }
    },
    listItem: {
      from:
        isMobile || isTablet
          ? { y: 10, autoAlpha: 0 }
          : { y: 10, autoAlpha: 0 },
      to:
        isMobile || isTablet
          ? {
              y: 0,
              autoAlpha: 1,
              overwrite: true,
              duration: 0.2,
              clearProps: true
            }
          : {
              y: 0,
              autoAlpha: 1,
              overwrite: true,
              duration: 0.2,
              clearProps: true
            }
    }
  },
  reInit: true,
  closeOnClick: false,
  closeOnClickEmptySpace: false
}

export default defaults
