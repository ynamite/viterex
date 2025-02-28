import { addEvent, removeEvent } from '@/js/eventbus.js'
import { createSpring } from '@/js/CreateSpring'
import { gsap } from '@/js/gsap.js'
import { Flip } from '@gsap/business/Flip'

gsap.registerPlugin(Flip)

const spring = createSpring({
  stiffness: 80,
  damping: 20
})

let animating = false

const defaults = {
  id: null,
  filterWrap: null,
  filters: null,
  elementsToFilter: null,
  filterLabel: null,
  filterLabelSelector: '[data-filter-label]',
  element: null,
  filterValue: null,
  callbacks: {
    init: null,
    beforeFilter: null,
    afterFilter: null
  }
}

const setActive = (element, elementsToFilter) => {
  elementsToFilter.forEach((element) => {
    element.classList.remove('active')
  })
  element.classList.add('active')
}

const applyFilter = async (filterValue, elementsToFilter) => {
  const state = Flip.getState(elementsToFilter)
  const parent = elementsToFilter[0].parentNode
  gsap.set(parent, { minHeight: parent.offsetHeight })
  // const parentRectFrom = parent.getBoundingClientRect()

  for (const element of elementsToFilter) {
    element.originalDisplayStyle =
      element.originalDisplayStyle || window.getComputedStyle(element).display
    element.style.display = 'none'
  }

  await Flip.from(state, {
    absoluteOnLeave: true,
    onLeave: (elements) =>
      gsap.to(elements, { opacity: 0, scale: 0, duration: 0.4, ease: spring })
  })

  const finalState = Flip.getState(elementsToFilter)

  for (const element of elementsToFilter) {
    if (filterValue === 'all') {
      element.style.display = element.originalDisplayStyle
      continue
    }
    const itemValues = element.dataset?.filterValue?.split(' / ')
    console.log('itemValues', itemValues, filterValue)
    if (itemValues.includes(filterValue)) {
      element.style.display = element.originalDisplayStyle
      continue
    }
  }

  await Flip.from(finalState, {
    onEnter: (elements) =>
      gsap.fromTo(
        elements,
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.6, ease: spring }
      )
  })
  gsap.set(parent, { clearProps: 'minHeight' })
  animating = false
}

const init = async (filterWrap, options = {}) => {
  removeEvent('filter')

  const settings = { ...defaults, ...options }
  const callbacks = { ...defaults.callbacks, ...options.callbacks }

  settings.filterWrap = filterWrap
  if (!settings.filterWrap) {
    console.log('Filter wrap element not found')
    return
  }
  settings.id = filterWrap.dataset.filter
  if (!settings.id) {
    console.log('Filter wrap element must have an id')
    return
  }
  settings.filters = Array.from(
    filterWrap.querySelectorAll('[data-filter-value]')
  )
  if (!settings.filters) {
    console.log('Filters not found', `[data-filter-value]`)
    return
  }
  settings.elementsToFilter = document.querySelector(
    `[data-filter-elements="${settings.id}"]`
  ).children
  if (!settings.elementsToFilter) {
    console.log(
      'Filter elements not found',
      `[data-filter-elements="${settings.id}"]`
    )
    return
  }

  const handleCallback = async (type, settings = {}) => {
    if (typeof callbacks[type] === 'function') await callbacks[type](settings)
  }

  settings.filterLabel = filterWrap.querySelector(settings.filterLabelSelector)

  await handleCallback('init', settings)
  settings.filters.forEach((element) => {
    // const element = event.target
    addEvent(element, 'click', 'filter', async (event) => {
      event.preventDefault()

      settings.filterValue = element.dataset.filterValue
      settings.element = element

      await handleCallback('beforeFilter', settings)
      setActive(settings.element, settings.filters)
      await applyFilter(settings.filterValue, settings.elementsToFilter)
      await handleCallback('afterFilter', settings)
    })
  })
}

export { init, setActive, applyFilter }
