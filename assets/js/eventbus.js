/*!
 * massif event bus
 * @author: Yves Torres, studio@massif.ch
 */

import swup from '@/js/swup.js'

const controllers = {}
const observers = {}

const addEvent = (element, type, label, fn) => {
  if (!element) return
  const [name, namespace] = label.split('.')
  const controller = new AbortController()
  const signal = controller.signal
  if (namespace) {
    if (!controllers[namespace]) controllers[namespace] = {}
    controllers[namespace][name] = controller
  } else controllers[name] = controller
  element.addEventListener(type, fn, { signal })
}

const removeEvent = (label) => {
  const [name, namespace] = label.split('.')
  if (namespace) {
    if (!controllers[namespace] || !controllers[namespace][name]) return
    if (controllers[namespace][name].signal.aborted) return
    controllers[namespace][name].abort()
    if (Object.keys(controllers[namespace]).length === 0)
      delete controllers[namespace]
  } else {
    if (!controllers[name]) return
    if (controllers[name].signal.aborted) return
    controllers[name].abort()
    delete controllers[name]
  }
}

const removeAllEvents = (namespace = null) => {
  if (namespace) {
    if (!controllers[namespace]) return
    for (const name in controllers[namespace]) {
      removeEvent(`${name}.${namespace}`)
    }
  } else {
    for (const label in controllers) {
      if (
        typeof controllers[label] === 'object' &&
        typeof controllers[label]?.abort !== 'function'
      ) {
        const namespace = label
        for (const name in controllers[namespace]) {
          removeEvent(`${name}.${namespace}`)
        }
      } else removeEvent(label)
    }
  }
}

const connectObserver = (element, type, label, fn) => {
  if (!element) return
  const [name, namespace] = label.split('.')
  let observer
  switch (type) {
    case 'resize':
      observer = new ResizeObserver(() => {
        fn()
      })
      break
    case 'scroll':
      observer = new IntersectionObserver(() => {
        fn()
      })
      break
  }
  observer.observe(element)
  if (namespace) {
    if (!observers[namespace]) observers[namespace] = {}
    observers[namespace][name] = observer
  } else observers[name] = observer
}

const disconnectObserver = (label) => {
  const [name, namespace] = label.split('.')
  if (namespace) {
    if (!observers[namespace] || !observers[namespace][name]) return
    observers[namespace][name].disconnect()
    delete observers[namespace][name]
    if (Object.keys(observers[namespace]).length === 0)
      delete observers[namespace]
  } else {
    if (!observers[name]) return
    observers[name].disconnect()
    delete observers[name]
  }
}

const disconnectAllObservers = (namespace = null) => {
  if (namespace) {
    if (!observers[namespace]) return
    for (const name in observers[namespace]) {
      disconnectObserver(`${name}.${namespace}`)
    }
  } else {
    for (const label in observers) {
      if (
        typeof observers[label] === 'object' &&
        typeof observers[label]?.disconnect !== 'function'
      ) {
        const namespace = label
        for (const name in observers[namespace]) {
          disconnectObserver(`${name}.${namespace}`)
        }
      } else disconnectObserver(label)
    }
  }
}

swup.hooks.on(
  'content:replace',
  () => {
    removeAllEvents()
    disconnectAllObservers()
  },
  { before: true }
)

export {
  addEvent,
  removeEvent,
  removeAllEvents,
  connectObserver,
  disconnectObserver,
  disconnectAllObservers
}
