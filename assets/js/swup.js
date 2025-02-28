/*!
 * massif swup
 * @author: Yves Torres, studio@massif.ch
 */

import Swup from 'swup'
import SwupPreloadPlugin from '@swup/preload-plugin'
import SwupBodyClassPlugin from '@swup/body-class-plugin'
import SwupHeadPlugin from '@swup/head-plugin'
import SwupJsPlugin from '@swup/js-plugin'
import SwupA11yPlugin from '@swup/a11y-plugin'
import SwupMorphPlugin from 'swup-morph-plugin'
import SwupRouteNamePlugin from '@swup/route-name-plugin'
import SwupScrollPlugin from '@swup/scroll-plugin'
import routeTransitions from '@/js/routeTransitions'

import { gsap, ScrollTrigger, ScrollToPlugin } from '@/js/gsap.js'
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const style = getComputedStyle(document.documentElement, null)

const swup = new Swup({
  ignoreVisit: (url, { el } = {}) =>
    el?.closest('[href^="tel:"]') ||
    el?.closest('[href^="mailto:"]') ||
    el?.closest('[target="_blank"]') ||
    el?.closest('[data-no-swup]') ||
    el?.closest('[data-modal]') ||
    el?.closest('.glightbox'),
  containers: ['#content'],
  native: true,
  plugins: [
    new SwupPreloadPlugin({
      preloadHoveredLinks: process.env.NODE_ENV !== 'development'
    }),
    new SwupBodyClassPlugin(),
    new SwupHeadPlugin({
      persistAssets: true
    }),
    new SwupJsPlugin({ animations: routeTransitions }),
    new SwupA11yPlugin({
      respectReducedMotion: false
    }),
    new SwupMorphPlugin({
      containers: ['#menus', '#footer', '#swup-css']
    }),
    new SwupRouteNamePlugin(),
    new SwupScrollPlugin({
      shouldResetScrollPosition: (link) => !link.matches('.back-btn')
    })
  ]
})

function getCustomPropertyValue(element, property) {
  // getComputedStyle(…).getPropertyValue(…) returns the raw expression for a CSS calc value,
  // i.e. a string of the form "calc(…)"
  //
  // To evaluate the calc, we create a temporary element and give it a max-width, which is a CSS
  // property that (1) expects a length and (2) will always resolve to the same actual pixel value
  // regardless of its containing element and surrounding CSS. We read the max-width back, now
  // computed and expressed as pixels, then discard the element.
  const value = getComputedStyle(element).getPropertyValue(property)
  const measureElem = document.createElement('div')
  document.body.appendChild(measureElem)
  measureElem.style.maxWidth = value
  const length = parseFloat(getComputedStyle(measureElem).maxWidth)
  document.body.removeChild(measureElem)
  return parseFloat(length, 10)
}

/**
 * Overwrite swup's scrollTo function
 */
swup.scrollTo = (offsetY) => {
  const scrollPadding = parseFloat(
    style.getPropertyValue('scroll-padding-top'),
    10
  )
  // const offset = getCustomPropertyValue(document.documentElement, '--padding')
  swup.hooks.callSync('scroll:start', undefined)
  window.scrollTo(0, offsetY - scrollPadding)
  swup.hooks.callSync('scroll:end', undefined)
  return
}

export { style, getCustomPropertyValue }
export default swup
