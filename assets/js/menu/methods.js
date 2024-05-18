import { addEvent, removeEvent } from '@/js/eventbus.js'
import dropdowns from './dropdowns.js'

import { gsap, CustomEase } from '@/js/gsap.js'
import { Logger } from '@/js/utilities.js'

const logger = new Logger()

const $doc = document
const $html = $doc.querySelector('html')

CustomEase.create(
  'menueasing',
  'M0,0 C0,0 0.1331,0.00299 0.21367,0.0142 0.28084,0.02355 0.32414,0.03298 0.38773,0.05396 0.4465,0.07336 0.48593,0.09003 0.53837,0.12135 0.59106,0.15282 0.62566,0.17978 0.66983,0.22244 0.71086,0.26206 0.73557,0.29357 0.76689,0.34203 0.80392,0.39932 0.82341,0.43958 0.85139,0.50331 0.87878,0.56567 0.89148,0.60453 0.91138,0.67106 0.94944,0.79827 1,1 1,1 '
)

const toggleMenu = () => {
  logger.log('Menu', 'toggleMenu')

  if (menu.settings.state == 'hidden') {
    menu.openMenu.call(this)
  }
  if (menu.settings.state == 'visible') {
    menu.closeMenu.call(this)
  }
}

const openMenu = (menu, event) => {
  if (
    !event.target.closest('[data-js-menu-trigger="' + menu.settings.ns + '"]')
  )
    return

  if (menu.settings.state != 'hidden') {
    closeMenu(menu, event)
    return
  }
  logger.log('Menu', 'openMenu', menu.settings.ns)

  menu.settings.currentScrollPosition = window.scrollY
  $html.classList.add(menu.settings.ns + '-open')

  menu.$trigger.dispatchEvent(new Event('blur'))
  menu.$trigger.classList.add('active')
  menu.$mobileMenu.classList.add('open')

  gsap.set(menu.$mobileMenu, { display: 'flex' })
  gsap.set(menu.$mobileMenu, menu.settings.animation.menu.from)
  gsap.set(menu.$listItems, menu.settings.animation.listItem.from)

  let to = { ...menu.settings.animation.menu.to }

  to.onComplete = function () {
    gsap.delayedCall(0.01, function () {
      $html.classList.add(menu.settings.ns + '-opened')
    })
    // Utils.setBodyScrollLock('off', menu.$mobileMenu);
    // $html.classList.add('disable-smooth-scroll');
    toggleListItems(menu)
    addEvent(
      $doc,
      'click',
      `closeOnClickEmptySpace.${menu.settings.ns}`,
      (event) => closeOnClickEmptySpace(menu, event)
    )
    addEvent(
      $doc,
      'keydown',
      `closeOnEscapePress.${menu.settings.ns}`,
      (event) => closeOnEscapePress(menu, event)
    )

    menu.settings.state = 'visible'

    if (menu.hasDropdowns) {
      addEvent($doc, 'click', `dropdowns.${menu.settings.ns}`, (event) =>
        dropdowns(menu, event)
      )
    }
  }

  gsap.fromTo(menu.$mobileMenu, menu.settings.animation.menu.from, to)
}

const toggleListItems = async (menu, toggle = 'on') => {
  let $items = menu.$listItems
  const timeOut = function ($li, to, delay) {
    return new Promise(function (resolve, reject) {
      setTimeout(async function () {
        await gsap.to($li, to)
        resolve()
      }, delay)
    })
  }
  const promises = []
  let to = { ...menu.settings.animation.listItem.to }
  let delayFactor = 50
  if (toggle == 'off') {
    delayFactor = 25
    to.autoAlpha = 0
    delete to.clearProps
    $items = [...$items].reverse()
  }
  $items.forEach(function ($item, i) {
    let delay = i == 0 ? delayFactor : delayFactor * (i + 0.5)
    promises.push(timeOut($item, to, delay))
  })
  return Promise.all(promises)
}

const closeMenu = (menu, event) => {
  logger.log('Menu', 'closeMenu', menu.settings.ns)

  if (menu.settings.state == 'hidden') return
  menu.settings.state = 'hidden'

  let callback = function () {
    if (!$html.classList.contains(menu.settings.ns + '-open')) return

    // Utils.setBodyScrollLock('on', menu.$mobileMenu);
    gsap.delayedCall(0.01, function () {
      $html.classList.remove(menu.settings.ns + '-opened')
      $html.classList.remove(menu.settings.ns + '-open')
      if (!event?.closeMenuOnAnchorClick) {
        $html.classList.add('disable-smooth-scroll')
        window.scrollTo(0, menu.settings.currentScrollPosition)
        $html.classList.remove('disable-smooth-scroll')
      }
    })
    let to = { ...menu.settings.animation.menu.from }
    to.overwrite = true
    to.duration = menu.settings.animation.menu.to.duration / 2
    to.clearProps = true
    to.onComplete = function () {
      menu.$mobileMenu.classList.remove('open')
      // if (window.location.hash) {
      //     let el = document.querySelector(window.location.hash);
      //     Utils.scrollElementIntoView(el);
      // }
    }

    gsap.to(menu.$mobileMenu, to)

    removeEvent(`closeOnClickEmptySpace.${menu.settings.ns}`)
    removeEvent(`closeOnEscapePress.${menu.settings.ns}`)
    removeEvent(`dropdowns.${menu.settings.ns}`)
  }

  toggleListItems(menu, 'off').then(function () {
    menu.$trigger.classList.remove('active')
    callback()
  })

  // gsap.delayedCall(1, function () {
  //     if ($html.classList.contains(self.settings.ns + '-open')) {
  //         callback();
  //     }
  // });

  // callback();
}

const closeOnClickEmptySpace = (menu, event) => {
  if (
    !menu.settings.closeOnClickEmptySpace ||
    event.target.closest(menu.selector)
    // !(
    //     menu.settings.closeOnClickEmptySpace &&
    //     event.target.closest(menu.selector)
    // ) &&
    // !(menu.settings.closeOnClick && event.target.closest('a'))
  ) {
    return
  }
  logger.log(
    'Menu',
    `click.${menu.settings.eventNamePrefix}-close`,
    menu.settings.closeOnClick
  )
  closeMenu(menu, event)
}

const closeOnEscapePress = (menu, event) => {
  var isEscape = false
  if ('keyCode' in event) {
    isEscape = event.key === 'Escape' || event.key === 'Esc'
  } else {
    isEscape = event.keyCode === 27
  }
  if (isEscape && menu.settings.state == 'visible') {
    logger.log('Menu', `keydown.${menu.settings.eventNamePrefix}-close`)
    closeMenu(menu, event)
  }
}

export {
  toggleMenu,
  openMenu,
  closeMenu,
  closeOnClickEmptySpace,
  closeOnEscapePress
}
