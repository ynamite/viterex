/*!
 * massif accordion
 * @author: Yves Torres, studio@massif.ch
 */
import './style.css'
import {
  animateIn as animateIconIn,
  animateOut as animateIconOut
} from './iconAnimations.js'

import { addEvent, removeAllEvents } from '@/js/eventbus.js'
import { Logger } from '@/js/utilities.js'
import { gsap } from '@/js/gsap.js'

const logger = new Logger()

const defaults = {
  hidden: true,
  namespace: 'accordion',
  closeOthers: false,
  parentSelector: '.accordion',
  openDuration: 0.6,
  callbacks: {
    init: null,
    beforeOpen: null,
    afterOpen: null,
    beforeClose: null,
    afterClose: null
  }
}

class accordion {
  constructor(options) {
    logger.log('Accordion', 'constructor')
    this.settings = { ...defaults, ...options }
    this.settings.callbacks = { ...defaults.callbacks, ...options.callbacks }
    // this.init()
  }

  init = () => {
    logger.log('Accordion', 'init')
    this.bindEvents()
  }

  bindEvents = () => {
    logger.log('Accordion', 'bindEvents')

    const self = this

    // const $accordions = document.querySelectorAll('.accordion');
    // if (!$accordions.length) return;
    // $accordions.forEach(($accordion) => {
    // const $items = $accordion.querySelectorAll('.accordion-item');
    // $items.forEach(($item) => {
    // const $itemTrigger = $item.querySelector('[data-accordion]');
    // const $itemLabel = $itemTrigger.querySelector('span');
    // const $itemIcon = $itemTrigger.querySelector('.icon');
    // const $itemExp = $item.querySelector('[data-accordion-id]');
    // this.closeItem($itemTrigger, $itemLabel, $itemIcon, $itemExp);
    // });
    // });

    // .querySelectorAll('.accordion-item.open');
    removeAllEvents(self.settings.namespace)

    addEvent(
      document,
      'click',
      `trigger.${self.settings.namespace}`,
      async (event) => {
        if (event.target.closest('[data-accordion]')) {
          if (event.target.tagName === 'A') return

          const $trigger = event.target.closest('[data-accordion]')
          const $label = $trigger.querySelector('.accordion-label')
          const $icon = $trigger.querySelector('.icon')
          const id = $trigger.dataset?.accordion
          if (!id) return
          const $exp = document.querySelector(
            '[data-accordion-id="' + id + '"]'
          )
          if (!$exp) return
          $trigger.blur()
          event.preventDefault()

          if (!self.settings[id])
            self.settings[id] = { state: self.settings.hidden }

          const state = self.settings[id].state

          if (state) {
            if (this.settings.closeOthers) {
              await this.closeOthers($trigger)
            }

            return this.openItem($trigger, $label, $icon, $exp)
          }
          return this.closeItem($trigger, $label, $icon, $exp)
        }
      }
    )
  }

  openInitial = () => {
    logger.log('Accordion', 'openInitial')

    const $openItems = document.querySelectorAll('[data-accordion-initial]')
    if ($openItems.length) {
      $openItems.forEach(async ($trigger) => {
        const id = $trigger.dataset?.accordion
        const $label = $trigger.querySelector('.accordion-label')
        const $icon = $trigger.querySelector('.icon')
        if (!id) return
        const $exp = document.querySelector('[data-accordion-id="' + id + '"]')
        if (!$exp) return
        await this.openItem($trigger, $label, $icon, $exp)
      })
    }
  }

  closeOthers = async ($trigger) => {
    const $openItems = $trigger
      .closest(this.settings.parentSelector)
      .querySelectorAll('.accordion-open')
    if ($openItems.length) {
      console.log('closeOthers', $openItems)
      $openItems.forEach(($item) => {
        const $itemTrigger = $item.dataset?.accordion
          ? $item
          : $item.querySelector('[data-accordion]')
        const id = $itemTrigger.dataset?.accordion
        const $itemLabel = $itemTrigger.querySelector('span')
        const $itemIcon = $itemTrigger.querySelector('.icon')
        const $itemExp = document.querySelector(
          '[data-accordion-id="' + id + '"]'
        )
        this.closeItem($itemTrigger, $itemLabel, $itemIcon, $itemExp)
      })
    }
  }

  handleCallbacks = async (type, $exp, $trigger) => {
    if (typeof this.settings.callbacks[type] === 'function')
      await this.settings.callbacks[type]($exp, $trigger)
  }

  openItem = async ($trigger, $label, $icon, $exp) => {
    const self = this
    const id = $trigger.dataset?.accordion

    animateIconIn($icon)

    $exp.removeAttribute('hidden')
    self.settings[id].state = !self.settings[id].state
    $trigger.classList.add('accordion-open')

    await self.handleCallbacks('beforeOpen', $exp, $trigger)
    gsap.from($exp, {
      height: 0.001,
      opacity: 0.001,
      duration: self.settings.openDuration,
      clearProps: true,
      onComplete: () => {
        self.handleCallbacks('afterOpen', $exp, $trigger)
        if (window?.ScrollTrigger)
          gsap.delayedCall(0.1, () => ScrollTrigger.refresh())
      }
    })
    if ($label) {
      $trigger.dataset.accordionLabel = $label.innerHTML
      if ($trigger.dataset?.accordionToggledLabel)
        $label.innerHTML = $trigger.dataset.accordionToggledLabel
    }
    return false
  }

  closeItem = async ($trigger, $label, $icon, $exp) => {
    const self = this
    const id = $trigger.dataset?.accordion

    animateIconOut($icon)

    await self.handleCallbacks('beforeClose', $exp, $trigger)

    if ($label && $trigger.dataset?.accordionLabel)
      $label.innerHTML = $trigger.dataset.accordionLabel
    $trigger.classList.remove('accordion-open')
    await gsap.to($exp, {
      height: 0.001,
      opacity: 0.001,
      duration: self.settings.openDuration,
      clearProps: true,
      onComplete: () => {
        if (window?.ScrollTrigger)
          gsap.delayedCall(0.1, () => ScrollTrigger.refresh())
        self.handleCallbacks('afterClose', $exp, $trigger)
      }
    })
    self.settings[id].state = !self.settings[id].state
    $exp.setAttribute('hidden', true)
    return false
  }
}

export default accordion
