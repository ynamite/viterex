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
// import SwupProgressPlugin from '@swup/progress-plugin'

import gsap from '@/js/gsap.js'

import { elementIsVisibleInViewport } from '@/js/utilities.js'

const animations = [
  {
    from: '(.*)',
    to: '(.*)',
    out: async (done) => {
      const container = document.querySelector('#content')
      container.style.opacity = 1

      const sections = await Array.from(container.querySelectorAll('section'))
        .filter((el) => elementIsVisibleInViewport(el, true))
        .reverse()

      await gsap.to(sections, {
        y: -20,
        opacity: 0,
        stagger: 0.3,
        duration: 0.6,
        ease: 'power2.out'
      })
      gsap.to(container, {
        opacity: 0,
        duration: 0.5,
        onComplete: done
      })
    },
    in: async (done) => {
      const container = document.querySelector('#content')
      const sections = await Array.from(
        container.querySelectorAll('section')
      ).filter((el) => elementIsVisibleInViewport(el, true))

      await gsap.from(sections, {
        y: -20,
        opacity: 0.001,
        stagger: 0.3,
        duration: 0.6,
        ease: 'power2.out',
        clearProps: true
      })
      done()
    }
  }
]

const swup = new Swup({
  ignoreVisit: (url, { el } = {}) =>
    el?.closest('[href^="mailto:"]') ||
    el?.closest('[target="_blank"]') ||
    el?.closest('[data-no-swup]') ||
    el?.closest('[data-modal]') ||
    el?.closest('.glightbox'),
  containers: ['#content'],
  plugins: [
    new SwupPreloadPlugin(),
    new SwupBodyClassPlugin(),
    new SwupHeadPlugin({
      persistAssets: true
    }),
    new SwupJsPlugin(animations),
    new SwupA11yPlugin(),
    new SwupMorphPlugin({
      containers: ['#menus', '#footer']
    }),
    new SwupRouteNamePlugin()
    // new SwupProgressPlugin()
  ]
})

export default swup
