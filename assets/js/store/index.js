/*!
 * Simple Store Implementation
 * Provides a React hook-like pattern for Vanilla JS
 * @author: Massif Store Module
 */

/**
 * Store class that manages state with reactive updates
 */
class Store {
  constructor() {
    this.state = new Map()
    this.subscribers = new Map()
    this.history = new Map()
    this.maxHistorySize = 10
    this.proxyRefs = new WeakMap() // Track original objects for proxy unwrapping
  }

  /**
   * Create a reactive proxy for objects and arrays
   * @param {Object|Array} target - The object or array to make reactive
   * @param {string} key - The store key this proxy belongs to
   * @param {string} path - The current path within the object (for nested reactivity)
   * @returns {Proxy} Reactive proxy
   * @private
   */
  createReactiveProxy(target, key, path = '') {
    // Don't proxy primitives, functions, or already proxied objects
    if (
      target === null ||
      typeof target !== 'object' ||
      this.proxyRefs.has(target)
    ) {
      return target
    }

    const store = this

    const proxy = new Proxy(target, {
      get(obj, prop) {
        const value = obj[prop]

        // Return reactive proxies for nested objects/arrays
        if (
          value !== null &&
          typeof value === 'object' &&
          !store.proxyRefs.has(value)
        ) {
          return store.createReactiveProxy(
            value,
            key,
            path ? `${path}.${prop}` : prop
          )
        }

        return value
      },

      set(obj, prop, value) {
        const oldValue = obj[prop]
        const fullPath = path ? `${path}.${prop}` : prop

        // Unwrap any proxy values before setting
        const unwrappedValue = store.unwrapProxy(value)
        obj[prop] = unwrappedValue

        // Notify subscribers of the change
        store.notifySubscribers(key, store.get(key), store.get(key), {
          path: fullPath,
          property: prop,
          oldValue,
          newValue: value
        })

        return true
      },

      deleteProperty(obj, prop) {
        const oldValue = obj[prop]
        const fullPath = path ? `${path}.${prop}` : prop

        delete obj[prop]

        // Notify subscribers of the deletion
        store.notifySubscribers(key, store.get(key), store.get(key), {
          path: fullPath,
          property: prop,
          oldValue,
          newValue: undefined,
          operation: 'delete'
        })

        return true
      }
    })

    // Track the relationship between proxy and original
    this.proxyRefs.set(proxy, target)

    return proxy
  }

  /**
   * Unwrap proxy objects to get the original object
   * @param {any} value - The value to unwrap
   * @returns {any} The unwrapped value
   * @private
   */
  unwrapProxy(value) {
    return this.proxyRefs.get(value) || value
  }

  /**
   * Check if a value should be made reactive
   * @param {any} value - The value to check
   * @returns {boolean}
   * @private
   */
  shouldMakeReactive(value) {
    return (
      value !== null &&
      typeof value === 'object' &&
      (Array.isArray(value) || value.constructor === Object)
    )
  }
  /**
   * Set a value in the store (always static/non-reactive)
   * @param {string} key - The key to store the value under
   * @param {any} value - The value to store (string, number, object, array, etc.)
   * @param {boolean} trackHistory - Whether to track history for this key
   */
  set(key, value, trackHistory = false) {
    const oldValue = this.state.get(key)

    // Track history if enabled
    if (trackHistory) {
      this.addToHistory(key, oldValue)
    }

    // Always store as static/non-reactive for set() method
    // Unwrap any existing proxy to ensure static storage
    const finalValue = this.unwrapProxy(value)

    this.state.set(key, finalValue)
    this.notifySubscribers(key, finalValue, oldValue)

    return finalValue
  }

  /**
   * Deep clone an object or array
   * @param {any} obj - The object to clone
   * @returns {any} The cloned object
   * @private
   */
  deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
      return obj
    }

    if (obj instanceof Date) {
      return new Date(obj.getTime())
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.deepClone(item))
    }

    if (typeof obj === 'object') {
      const cloned = {}
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          cloned[key] = this.deepClone(obj[key])
        }
      }
      return cloned
    }

    return obj
  }

  /**
   * Get a value from the store
   * @param {string} key - The key to retrieve
   * @param {any} defaultValue - Default value if key doesn't exist
   * @returns {any} The stored value or default value
   */
  get(key, defaultValue = undefined) {
    return this.state.has(key) ? this.state.get(key) : defaultValue
  }

  /**
   * Check if a key exists in the store
   * @param {string} key - The key to check
   * @returns {boolean}
   */
  has(key) {
    return this.state.has(key)
  }

  /**
   * Delete a key from the store
   * @param {string} key - The key to delete
   * @returns {boolean} True if key was deleted, false if it didn't exist
   */
  delete(key) {
    const existed = this.state.has(key)
    const oldValue = this.state.get(key)

    if (existed) {
      this.state.delete(key)
      this.notifySubscribers(key, undefined, oldValue)
      this.clearHistory(key)
    }

    return existed
  }

  /**
   * Clear all data from the store
   */
  clear() {
    const keys = Array.from(this.state.keys())
    this.state.clear()
    this.history.clear()

    // Notify all subscribers of their key deletions
    keys.forEach((key) => {
      this.notifySubscribers(key, undefined, undefined)
    })
  }

  /**
   * Get all keys in the store
   * @returns {string[]}
   */
  keys() {
    return Array.from(this.state.keys())
  }

  /**
   * Get all values in the store
   * @returns {any[]}
   */
  values() {
    return Array.from(this.state.values())
  }

  /**
   * Get all entries as [key, value] pairs
   * @returns {Array<[string, any]>}
   */
  entries() {
    return Array.from(this.state.entries())
  }

  /**
   * Subscribe to changes for a specific key
   * @param {string} key - The key to watch
   * @param {Function} callback - Function to call when value changes
   * @returns {Function} Unsubscribe function
   */
  subscribe(key, callback) {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set())
    }

    this.subscribers.get(key).add(callback)

    // Return unsubscribe function
    return () => {
      const keySubscribers = this.subscribers.get(key)
      if (keySubscribers) {
        keySubscribers.delete(callback)
        if (keySubscribers.size === 0) {
          this.subscribers.delete(key)
        }
      }
    }
  }

  /**
   * Notify all subscribers of a key change
   * @param {string} key - The key that changed
   * @param {any} newValue - The new value
   * @param {any} oldValue - The old value
   * @param {Object} changeInfo - Additional information about the change
   * @private
   */
  notifySubscribers(key, newValue, oldValue, changeInfo = null) {
    const keySubscribers = this.subscribers.get(key)
    if (keySubscribers) {
      keySubscribers.forEach((callback) => {
        try {
          callback(newValue, oldValue, key, changeInfo)
        } catch (error) {
          console.error(`Error in store subscriber for key "${key}":`, error)
        }
      })
    }
  }

  /**
   * Add value to history
   * @private
   */
  addToHistory(key, value) {
    if (!this.history.has(key)) {
      this.history.set(key, [])
    }

    const keyHistory = this.history.get(key)
    keyHistory.push({
      value,
      timestamp: Date.now()
    })

    // Limit history size
    if (keyHistory.length > this.maxHistorySize) {
      keyHistory.shift()
    }
  }

  /**
   * Get history for a key
   * @param {string} key - The key to get history for
   * @returns {Array} History array
   */
  getHistory(key) {
    return this.history.get(key) || []
  }

  /**
   * Clear history for a key
   * @private
   */
  clearHistory(key) {
    this.history.delete(key)
  }

  /**
   * Update a value using a function (always static)
   * @param {string} key - The key to update
   * @param {Function} updater - Function that receives current value and returns new value
   * @param {any} defaultValue - Default value if key doesn't exist
   * @param {boolean} trackHistory - Whether to track history
   */
  update(key, updater, defaultValue = undefined, trackHistory = false) {
    const currentValue = this.get(key, defaultValue)
    const newValue = updater(currentValue)
    return this.set(key, newValue, trackHistory)
  }

  /**
   * Set a reactive value (creates reactive proxy for objects/arrays)
   * @param {string} key - The key to store the value under
   * @param {any} value - The value to store
   * @param {boolean} trackHistory - Whether to track history for this key
   */
  setReactive(key, value, trackHistory = false) {
    const oldValue = this.state.get(key)

    // Track history if enabled
    if (trackHistory) {
      this.addToHistory(key, oldValue)
    }

    // Always create reactive proxy for objects/arrays
    let finalValue = value
    if (this.shouldMakeReactive(value)) {
      // Deep clone the value to avoid modifying the original
      const clonedValue = this.deepClone(value)
      finalValue = this.createReactiveProxy(clonedValue, key)
    }

    this.state.set(key, finalValue)
    this.notifySubscribers(key, finalValue, oldValue)

    return finalValue
  }

  /**
   * Set a non-reactive value (same as set, kept for consistency)
   * @param {string} key - The key to store the value under
   * @param {any} value - The value to store
   * @param {boolean} trackHistory - Whether to track history for this key
   */
  setStatic(key, value, trackHistory = false) {
    return this.set(key, value, trackHistory)
  }

  /**
   * Increment a numeric value
   * @param {string} key - The key to increment
   * @param {number} amount - Amount to increment by (default: 1)
   * @param {number} defaultValue - Default value if key doesn't exist (default: 0)
   */
  increment(key, amount = 1, defaultValue = 0) {
    const currentValue = this.get(key, defaultValue)
    return this.set(key, currentValue + amount)
  }

  /**
   * Decrement a numeric value
   * @param {string} key - The key to decrement
   * @param {number} amount - Amount to decrement by (default: 1)
   * @param {number} defaultValue - Default value if key doesn't exist (default: 0)
   */
  decrement(key, amount = 1, defaultValue = 0) {
    return this.increment(key, -amount, defaultValue)
  }

  /**
   * Toggle a boolean value
   * @param {string} key - The key to toggle
   * @param {boolean} defaultValue - Default value if key doesn't exist (default: false)
   */
  toggle(key, defaultValue = false) {
    const currentValue = this.get(key, defaultValue)
    return this.set(key, !currentValue)
  }
}

// Create global store instance
const store = new Store()

/**
 * React hook-like pattern for using store values (always reactive)
 * @param {string} key - The key to watch
 * @param {any} defaultValue - Default value if key doesn't exist
 * @returns {[Function, Function]} Returns [getValue, setValue] tuple where getValue() always returns current value
 */
export function useState(key, defaultValue = undefined) {
  // If the key doesn't exist and we have a default, set it as reactive
  if (!store.has(key) && defaultValue !== undefined) {
    store.setReactive(key, defaultValue)
  }

  // Return a getter function that always returns the current value
  const getValue = () => store.get(key, defaultValue)

  const setValue = (newValue) => {
    if (typeof newValue === 'function') {
      // Support updater function pattern like React
      const currentValue = store.get(key, defaultValue)
      const updatedValue = newValue(currentValue)
      return store.setReactive(key, updatedValue)
    } else {
      return store.setReactive(key, newValue)
    }
  }

  return [getValue, setValue]
}

/**
 * Hook for subscribing to store changes with detailed change information
 * @param {string} key - The key to watch
 * @param {Function} callback - Callback function (newValue, oldValue, key, changeInfo)
 * @param {Object} options - Options object
 * @returns {Function} Unsubscribe function
 */
export function useStoreEffect(key, callback, options = {}) {
  const { immediate = false } = options

  if (immediate) {
    const currentValue = store.get(key)
    callback(currentValue, undefined, key, null)
  }

  return store.subscribe(key, callback)
}

/**
 * Hook specifically for reactive objects/arrays (same as useState now)
 * @param {string} key - The key to watch
 * @param {any} defaultValue - Default value if key doesn't exist
 * @returns {[Function, Function]} Returns [getValue, setValue] tuple with reactive proxy
 */
export function useReactiveState(key, defaultValue = undefined) {
  return useState(key, defaultValue)
}

/**
 * Hook for non-reactive (static) values
 * @param {string} key - The key to watch
 * @param {any} defaultValue - Default value if key doesn't exist
 * @returns {[Function, Function]} Returns [getValue, setValue] tuple without reactive proxy
 */
export function useStaticState(key, defaultValue = undefined) {
  // If the key doesn't exist and we have a default, set it as static
  if (!store.has(key) && defaultValue !== undefined) {
    store.set(key, defaultValue)
  }

  // Return a getter function that always returns the current value
  const getValue = () => store.get(key, defaultValue)

  const setValue = (newValue) => {
    if (typeof newValue === 'function') {
      // Support updater function pattern
      const currentValue = store.get(key, defaultValue)
      const updatedValue = newValue(currentValue)
      return store.set(key, updatedValue)
    } else {
      return store.set(key, newValue)
    }
  }

  return [getValue, setValue]
}

/**
 * Hook for getting a computed value based on multiple store keys
 * @param {string[]} keys - Array of keys to watch
 * @param {Function} compute - Function to compute the value
 * @returns {any} Computed value
 */
export function useComputed(keys, compute) {
  const values = keys.map((key) => store.get(key))
  return compute(...values)
}

// Export individual store methods for direct usage
export const get = (...args) => store.get(...args)
export const set = (...args) => store.set(...args)
export const has = (...args) => store.has(...args)
export const remove = (...args) => store.delete(...args)
export const clear = (...args) => store.clear(...args)
export const keys = (...args) => store.keys(...args)
export const values = (...args) => store.values(...args)
export const entries = (...args) => store.entries(...args)
export const subscribe = (...args) => store.subscribe(...args)
export const update = (...args) => store.update(...args)
export const increment = (...args) => store.increment(...args)
export const decrement = (...args) => store.decrement(...args)
export const toggle = (...args) => store.toggle(...args)
export const getHistory = (...args) => store.getHistory(...args)
export const setReactive = (...args) => store.setReactive(...args)
export const setStatic = (...args) => store.setStatic(...args)

// Export the store instance for advanced usage
export { store }

// Export default for convenience
export default {
  useState,
  useReactiveState,
  useStaticState,
  useStoreEffect,
  useComputed,
  get,
  set,
  has,
  remove,
  clear,
  keys,
  values,
  entries,
  subscribe,
  update,
  increment,
  decrement,
  toggle,
  getHistory,
  setReactive,
  setStatic,
  store
}
