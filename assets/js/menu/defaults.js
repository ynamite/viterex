import { createSpring } from '@/js/CreateSpring'

const spring = createSpring({
  stiffness: 80,
  damping: 20
})
const springLis = createSpring()

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
  listItemsSelector:
    '.rex-navi1 >li,.rex-navi2 >li, .article-nav a, .lang-nav a',
  dropdownSelector: '.has-dropdown',
  strings: {
    trigger: 'Hauptnavigations-Menü    öffnen'
  },
  animation: {
    defDuration: defDuration,
    menu: {
      from: isMobile || isTablet ? { yPercent: -100 } : { xPercent: 100 },
      to:
        isMobile || isTablet
          ? {
              yPercent: 0,
              ease: spring,
              overwrite: true,
              duration: defDuration
            }
          : {
              xPercent: 0,
              ease: spring,
              overwrite: true,
              duration: defDuration
            }
    },
    listItem: {
      from:
        isMobile || isTablet
          ? { y: 10, autoAlpha: 0 }
          : { x: -10, autoAlpha: 0 },
      to:
        isMobile || isTablet
          ? {
              y: 0,
              ease: springLis,
              autoAlpha: 1,
              duration: 0.6,
              clearProps: true
            }
          : {
              x: 0,
              ease: springLis,
              autoAlpha: 1,
              duration: 0.6,
              clearProps: true
            }
    }
  },
  reInit: true,
  closeOnClick: false,
  closeOnClickOutside: false
}

export default defaults
