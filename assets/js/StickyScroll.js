import swup, { style, getCustomPropertyValue } from '@/js/swup'
import { addEvent } from '@/js/eventbus'

const timeout = 500
const smoothFactor = 0.25
const instances = []
let padding = 0
let scrollPadding = 0

const setValues = () => {
  padding = getCustomPropertyValue(document.documentElement, '--padding')
  scrollPadding = parseFloat(style.getPropertyValue('scroll-padding-top'), 10)
}

const scrollEventThrottle = (fn) => {
  let ticking = false
  addEvent(window, 'scroll', 'scroll.stickyscroll', () => {
    if (!ticking) {
      requestAnimationFrame(function () {
        fn()
        ticking = false
      })
      ticking = true
    }
  })
}

const resizeEventThrottle = (fn) => {
  let ticking = false
  addEvent(window, 'resize', 'resize.stickyscroll', () => {
    if (!ticking) {
      requestAnimationFrame(function () {
        fn()
        ticking = false
      })
      ticking = true
    }
  })
}

const lerp = (a, b, t) => {
  return a + (b - a) * t
}

const updateInstance = (instance) => {
  let t =
    (window.scrollY - instance.scrollStart) /
    (instance.scrollEnd - instance.scrollStart)
  t = Math.max(0, Math.min(1, t))
  const targetY = lerp(instance.translateStart, instance.translateEnd, t)
  instance.currentY = lerp(instance.currentY, targetY, smoothFactor)
  instance.el.style.top = `${instance.currentY}px`
}

const updateInstances = () => {
  for (const instance of instances) {
    updateInstance(instance)
  }
}

const init = () => {
  const stickyScrollElements = document.querySelectorAll('[data-sticky-scroll]')
  if (stickyScrollElements) {
    setValues()
    stickyScrollElements.forEach((el) => {
      const parent = el.parentElement
      const rect = el.getBoundingClientRect()
      const end = window.innerHeight - (scrollPadding + el.offsetHeight)
      if (end > 0) {
        el.removeAttribute('style')
        return
      }
      const instance = {
        el,
        currentY: rect.top - scrollPadding - padding,
        scrollStart: parent.offsetTop + parent.scrollTop,
        scrollEnd: parent.offsetTop + parent.offsetHeight + parent.scrollTop,
        translateStart: scrollPadding,
        translateEnd: end + padding * 2
      }
      instances.push(instance)
    })
    resizeEventThrottle(() => {
      setValues()
    })
    scrollEventThrottle(() => {
      updateInstances()
    })
    updateInstances()
  }
}

setTimeout(() => {
  init()
}, 500)

swup.hooks.on('content:replace', () => {
  instances.length = 0
  setTimeout(() => {
    init()
  }, timeout)
})
