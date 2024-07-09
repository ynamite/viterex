import { addEvent } from '@/js/eventbus.js'
import { gsap, Flip } from '@/js/gsap.js'

gsap.registerPlugin(Flip)

let animating = false

const defaults = {
  callbacks: {
    init: null,
    beforeFilter: null,
    afterFilter: null
  }
}

const setActive = (element, items) => {
  items.forEach((item) => {
    item.classList.remove('active')
  })
  element.classList.add('active')
}

const applyFilter = async (value, items) => {
  const state = Flip.getState(items)
  const parent = items[0].parentNode
  // parent.originalHeight = parent.originalHeight || parent.offsetHeight
  const parentRectFrom = parent.getBoundingClientRect()

  for (const item of items) {
    item.originalDisplayStyle =
      item.originalDisplayStyle || window.getComputedStyle(item).display
    if (value === 'all') {
      item.style.display = item.originalDisplayStyle
      continue
    }
    const itemValues = item.dataset?.filter?.split(' ')
    if (itemValues.includes(value)) {
      item.style.display = item.originalDisplayStyle
      continue
    }
    item.style.display = 'none'
  }
  if (animating) return
  animating = true

  const parentRectTo = await parent.getBoundingClientRect()
  if (parentRectFrom.height > parentRectTo.height) {
    gsap.fromTo(
      parent,
      {
        height: parentRectFrom.height
      },
      {
        height: parentRectTo.height,
        duration: 0.3
      }
    )
  }

  await Flip.from(state, {
    absoluteOnLeave: true,
    ease: 'power1.inOut',
    onEnter: (elements) =>
      gsap.fromTo(
        elements,
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.3 }
      ),
    onLeave: (elements) =>
      gsap.to(elements, { opacity: 0, scale: 0, duration: 0.3 })
  })
  await gsap.to(parent, {
    height: 'auto',
    duration: 0.3,
    clearProps: 'height'
  })
  animating = false
}

const init = async (element, items, options = {}) => {
  if (!element) return
  if (!items) return
  const settings = { ...defaults, ...options }
  settings.callbacks = { ...defaults.callbacks, ...options.callbacks }
  const handleCallback = async (
    type,
    item = null,
    element = null,
    items = null,
    filterItems = null
  ) => {
    if (typeof settings.callbacks[type] === 'function')
      await settings.callbacks[type](item, element, items, filterItems)
  }
  const filterItems = element.querySelectorAll('.filter-item')
  await handleCallback('init', element, items, filterItems)
  filterItems.forEach((item) => {
    addEvent(item, 'click', 'filter', async (event) => {
      event.preventDefault()
      const item = event.target
      const value = item.dataset.filter
      await handleCallback('beforeFilter', item, element, items, filterItems)
      setActive(item, filterItems)
      await applyFilter(value, items)
      await handleCallback('afterFilter', item, element, items, filterItems)
    })
  })
}

export { init, setActive, applyFilter }
