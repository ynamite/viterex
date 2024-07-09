/*!
 * massif menu
 * @author: Yves Torres, studio@massif.ch
 */
import './style.css'
import defaults from './defaults.js'
import events from './events.js'
import { toggleMenu, openMenu, closeMenu } from './methods.js'

import { Logger } from '@/js/utilities.js'

const logger = new Logger()

const $html = document.querySelector('html')

class menu {
  constructor(selector, options) {
    logger.log('Menu', 'constructor')

    this.initialized = false
    this.selector = selector

    this.settings = { ...defaults, ...options }
    this.settings.strings = { ...defaults.strings, ...options.strings }
    this.settings.animation = { ...defaults.animation, ...options.animation }
    this.settings.animation.menu = {
      ...defaults.animation.menu,
      ...options?.animation?.menu
    }
    this.settings.animation.listItem = {
      ...defaults.animation.listItem,
      ...options?.animation?.listItem
    }
    this.settings.selector = selector
    this.settings.state = 'hidden'
  }

  init = () => {
    logger.log('Menu', 'init')
    // setBodyScrollLock('clear');
    $html.classList.remove(this.settings.ns + '-opened')
    $html.classList.remove(this.settings.ns + '-open')
    // if (this.initialized) {
    //     logger.log('Menu', 'init close');
    //     this.closeMenu.call(this);
    // }

    if (this.initialized === false || this.settings?.reInit === true) {
      this.$menu = document.querySelector(
        this.selector + ':not([data-js-menu-id])'
      )

      if (!this.$menu) {
        return
      }

      if (!this.initialized) {
        let date = new Date()
        this.settings.ns = this.$menu.dataset.menuId || 'menu-' + date.getTime()
      }

      logger.log('Menu', 'initializing', this.settings.ns)

      const $oldMenuTrigger = document.querySelector(
        '[data-js-menu-trigger="' + this.settings.ns + '"]'
      )
      if ($oldMenuTrigger) $oldMenuTrigger.remove()
      const $oldMenu = document.querySelector(
        '[data-js-menu-id="' + this.settings.ns + '"]'
      )
      if ($oldMenu) $oldMenu.remove()

      this.$trigger = document.createElement('button')
      this.$trigger.classList.add('js-menu-trigger')
      this.$trigger.dataset.jsMenuTrigger = this.settings.ns
      this.$trigger.setAttribute('title', this.settings.strings.trigger)
      this.$trigger.setAttribute('aria-expanded', true)
      this.$trigger.setAttribute('aria-controls', this.settings.ns)
      this.$menu.querySelector('.main-nav').setAttribute('id', this.settings.ns)
      let $triggerLabel = document.createElement('span')
      $triggerLabel.setAttribute('hidden', true)
      $triggerLabel.innerHTML = this.settings.strings.trigger
      this.$trigger.append($triggerLabel)
      $triggerLabel.insertAdjacentHTML('afterend', this.settings.hamburgerHtml)

      if (this.settings.injectToBody)
        document.querySelector('body').append(this.$trigger)
      else document.querySelector('#menus').append(this.$trigger)

      this.hamburgers = this.$trigger.querySelectorAll(
        '.' + this.settings.ns + '-hamburger-html'
      )

      this.$mobileMenu = this.settings.clone
        ? this.$menu.cloneNode(true)
        : this.$menu

      delete this.$mobileMenu.dataset.menuDesktop
      this.$mobileMenu.classList.add('js-menu')
      this.$mobileMenu.dataset.jsMenuId = this.settings.ns
      this.$mobileMenu.dataset.menuMobile = true
      // wrapInner(this.$mobileMenu, 'div', 'class', 'row-o')

      const $langNav = this.$mobileMenu.querySelector('#lang-nav')
      if ($langNav) $langNav.setAttribute('id', 'lang-nav-mobile')

      if (this.settings.appendElements.length) {
        this.settings.appendElements.forEach((element) => {
          if (element && element instanceof HTMLElement) {
            const clone = element.cloneNode(true)
            this.$mobileMenu.append(clone)
          }
        })
      }

      if (this.settings.injectToBody)
        document.querySelector('body').append(this.$mobileMenu)
      else document.querySelector('#menus').append(this.$mobileMenu)

      this.$listItems = this.$mobileMenu.querySelectorAll(
        this.settings.listItemsSelector
      )

      this.$dropdownTriggers = this.$mobileMenu.querySelectorAll(
        this.settings.dropdownSelector
      )
      this.$dropdowns = this.$mobileMenu.querySelectorAll(
        this.settings.dropdownSelector + '    >    ul'
      )
      this.hasDropdowns = this.$dropdowns.length ? true : false

      events(this)

      this.initialized = true
    }
    // setBodyScrollLock('on', self.$mobileMenu);
  }

  toggleMenu = (event) => {
    toggleMenu(this, event)
  }

  openMenu = (event) => {
    openMenu(this, event)
  }

  closeMenu = (event) => {
    closeMenu(this, event)
  }
}

export default menu
