/*!
 * massif scripts
 * @author: Yves Torres, studio@massif.ch
 */
import {
  Logger,
  browserIsIE,
  isTouchDevice,
  getScrollBarWidth,
  setBodyScrollLock,
  decryptEmailaddresses
} from '@/js/utilities.js'
import menu from '@/js/menu'
import form from '@/js/form'
import accordion from '@/js/accordion'
import swup from '@/js/swup.js'
// import 'vidstack/player/styles/base.css'
// import 'vidstack/player'
// import 'vidstack/player/ui'
// import 'vidstack/icons'
window.debugMode = false

const logger = new Logger()

const $html = document.documentElement
const $body = $html.querySelector('body')
const $header = $html.querySelector('.header')

// const isMobile = $html.classList.contains('is-mobile')
// const isTablet = $html.classList.contains('is-tablet')
const isIE = browserIsIE()
// const isEdge = !isIE && !!window.StyleMedia
const touchDevice = isTouchDevice()
// const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1
// const isSsafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1
const scrollBarWidth = getScrollBarWidth()

let mainMenu = new menu('.main-menu', {
  clone: true,
  injectToBody: true,
})
// massif_form = new MASSIF_form('.rex-yform', {
//     //animateLabels: true,
//     callbacks: { initForm: [formToggleFields] },
// });

// massif_accordion = new MASSIF_accordion();

// massif_filter = new MASSIF_filter({
//     selector: '.filter',
//     itemsWrapper: '.row-team',
//     itemsSelector: '.department',
// });

const init = async () => {
  logger.log('commonInits')

  document.documentElement.style.setProperty(
    '--scrollbarwidth',
    scrollBarWidth + 'px'
  )

  if (touchDevice) {
    $html.classList.add('touch-device')
  } else {
    $html.classList.add('not-touch-device')
  }

  mainMenu.init()

  decryptEmailaddresses()

  // massif_form.init()
  // massif_accordion.openInitial()

  // formToggleFields()

  // lightboxes();

  // setupPlyr()

  // downloads()

  // sisyphus()

  let $firstContent = document.querySelector('.content-main > :first-child')
  if ($firstContent) {
    $firstContent.classList.add('first-row')
  }
  let $lastContent = document.querySelector('.content-main > :last-child')
  if ($lastContent != $firstContent) {
    $lastContent.classList.add('last-row')
  }

  await initImages()

  const accordions = new accordion({
    openDuration: 0.3,
    closeOthers: true,
    parentSelector: '[data-accordion-parent]'
  })
  accordions.init()

  const forms = new form('.rex-yform', {})
  forms.init()

  // const swipers = await initSwipers();

}

const swupRefresh = () => {
  logger.log('swup refresh')
  // main.forms();

  init()

  setBodyScrollLock('on', $html)

  const backBtns = document.querySelectorAll('.back-btn')
  if (backBtns) {
    backBtns.forEach((btn) => {
      btn.href = 'javascript:void(0);'
      btn.addEventListener('click', (event) => {
        event.preventDefault()
        window.history.back()
      })
    })
  }

  let logoHref = document.getElementById('content').dataset?.logoHref
  $header.querySelector('.site-logo a').setAttribute('href', logoHref)

}

const initImages = async () => {
  logger.log('images')

  if (isIE) {
    document.querySelectorAll('.img-cell img').forEach(($img) => {
      const $container = $img.parentElement
      bgPos =
        $img.dataset?.bgPost && $img.dataset?.bgPost != '%'
          ? $img.dataset.bgPost
          : ''
      let styleStr = $container.getAttribute('style')
      $container.setAttribute(
        'style',
        `background-position: ${bgPos};${styleStr}`
      )
    })
  }
}

const initSwipers = async () => {
  const swiper = await import('@/js/swiper')
  swiper.init()
}

const importModules = async () => {
  logger.log('importModules')
  const modules = {
    lazysizes: await import('@/js/lazysizes.js')
  }
}

init()
importModules()

swup.hooks.on('content:replace', () => swupRefresh())
