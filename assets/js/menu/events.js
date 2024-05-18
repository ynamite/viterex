import { openMenu, closeMenu } from './methods.js'

import { addEvent, removeAllEvents } from '@/js/eventbus.js'
import { Logger } from '@/js/utilities.js'

const logger = new Logger()

const $doc = document

const events = (menu) => {
  logger.log('Menu', 'bindEvents')
  // remove events
  removeAllEvents(menu.settings.ns)

  // add events
  addEvent($doc, 'click', `openMenu.${menu.settings.ns}`, (event) =>
    openMenu(menu, event)
  )

  if (menu.hasDropdowns) {
    menu.$dropdownTriggers.forEach(function (element) {
      const $dd = element.querySelector('ul')
      if (!element.classList.contains('rex-active')) {
        $dd.setAttribute('hidden', true)
      } else {
        element.classList.add('dd-active')
      }
    })
  } else {
    let $anchors = [...menu.$mobileMenu.querySelectorAll('a')]
    $anchors.forEach(function (element) {
      logger.log('Menu', 'bindEvents', 'add element closeMenu event', element)
      addEvent(
        element,
        'click',
        `closeMenuOnAnchorClick.${menu.settings.ns}`,
        (event) => {
          event.closeMenuOnAnchorClick = true
          return closeMenu(menu, event)
        }
      )
    })
  }
}

export { events }
export default events
