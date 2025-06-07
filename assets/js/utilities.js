/*!
 * massif utilities
 * @author: Yves Torres, studio@massif.ch
 */
import { gsap, ScrollToPlugin } from '@/js/gsap.js'

gsap.registerPlugin(ScrollToPlugin)

const rexApiCall = async (endpoint, action, body, params = {}) => {
  let defaults = {
    mode: 'same-origin',
    credentials: 'same-origin',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }
  const response = await fetch(`?rex-api-call=${endpoint}&action=${action}`, {
    ...defaults,
    ...params
  })
  const json = await response.json()
  if (json.succeeded) {
    return json.message
  }
  throw new Error(json.message)
}

// blends two colors
function blendColors(c0, c1, p) {
  var f = parseInt(c0.slice(1), 16),
    t = parseInt(c1.slice(1), 16),
    R1 = f >> 16,
    G1 = (f >> 8) & 0x00ff,
    B1 = f & 0x0000ff,
    R2 = t >> 16,
    G2 = (t >> 8) & 0x00ff,
    B2 = t & 0x0000ff
  return (
    '#' +
    (
      0x1000000 +
      (Math.round((R2 - R1) * p) + R1) * 0x10000 +
      (Math.round((G2 - G1) * p) + G1) * 0x100 +
      (Math.round((B2 - B1) * p) + B1)
    )
      .toString(16)
      .slice(1)
  )
}

/*
 * set & get Cookies
 */

function setCookie(name, value, days) {
  if (days) {
    var date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    var expires = '; expires=' + date.toGMTString()
  } else var expires = ''
  document.cookie = name + '=' + value + expires + '; path=/'
}

function getCookie(name) {
  var name_eq = name + '='
  var ca = document.cookie.split(';')
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i]
    while (c.charAt(0) == ' ') c = c.substring(1, c.length)
    if (c.indexOf(name_eq) == 0) return c.substring(name_eq.length, c.length)
  }
  return null
}

// check whether UA has touch support
function isTouchDevice() {
  var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ')
  var mq = function (query) {
    return window.matchMedia(query).matches
  }

  if (
    'ontouchstart' in window ||
    (window.DocumentTouch && document instanceof DocumentTouch)
  ) {
    return true
  }

  // include the 'heartz' as a way to have a non matching MQ to help terminate the join
  // https://git.io/vznFH
  var query = ['(', prefixes.join('touch-enabled),('), 'massif', ')'].join('')
  return mq(query)
}

// checks if UA is IE11
function browserIsIE() {
  return /*@cc_on!@*/ false || !!document.documentMode
}

// saves scroll position on reload
function retainScrollPosition() {
  var localStorageSupport = supportsLocalStorage()

  if (!localStorageSupport || browserIsIE()) return

  var date = localStorage.getItem('scroll-pos-date')
  localStorage.setItem('scroll-pos-date', new Date())

  window.addEventListener('beforeunload', function () {
    localStorage.setItem('scroll-pos', window.pageYOffset)
  })

  if (!date) return

  var diff = Math.abs(new Date() - new Date(date))
  var timePassed = diff / 1000 / 60

  if (timePassed >= 5) return
  var top = localStorage.getItem('scroll-pos')
  if (top !== null) {
    window.scroll(0, parseInt(top, 10))
  }
}

// checks for local storage support
function supportsLocalStorage() {
  try {
    localStorage.setItem('_', '_')
    localStorage.removeItem('_')
    return true
  } catch (e) {
    return false
  }
}

// gets scrollbar width
function getScrollBarWidth() {
  var inner = document.createElement('p')
  inner.style.width = '100%'
  inner.style.height = '200px'

  var outer = document.createElement('div')
  outer.style.position = 'absolute'
  outer.style.top = '0px'
  outer.style.left = '0px'
  outer.style.visibility = 'hidden'
  outer.style.width = '200px'
  outer.style.height = '150px'
  outer.style.overflow = 'hidden'
  outer.appendChild(inner)

  document.body.appendChild(outer)
  var w1 = inner.offsetWidth
  outer.style.overflow = 'scroll'
  var w2 = inner.offsetWidth
  if (w1 == w2) w2 = outer.clientWidth

  document.body.removeChild(outer)

  return w1 - w2
}

// scroll to element using swup.scrollTo
function scrollElementIntoView($el, offset = 0) {
  if (!$el) return
  // if (typeof $el.scrollIntoView === 'function') {
  //     $el.scrollIntoView();
  //     return;
  // }
  document.documentElement.classList.add('disable-smooth-scroll')
  let style = getComputedStyle(document.documentElement)
  let scrollPadding =
    parseFloat(style.getPropertyValue('scroll-padding-top'), 10) +
    parseInt(offset, 10)
  gsap.to(window, {
    scrollTo: {
      y: $el,
      offsetY: scrollPadding,
      autoKill: false,
      autoKillThreshold: 1
    },
    duration: 0.3,
    onComplete: () => {
      document.documentElement.classList.remove('disable-smooth-scroll')
    }
  })
}

// gets a positive or negative sign randomly
function randomSign() {
  return Math.random() < 0.5 ? 1 : -1
}

// logs messages if debug = true or if the global var debugging = true
class Logger {
  constructor(options) {
    var opts = options || {}
    this.options = {}
    this.options.debug =
      typeof opts['debug'] !== 'undefined' ? opts['debug'] : true
    // if (logger !== true) {
    //     this.options.debug = false;
    // }
  }
  setOption = function (option, value) {
    if (option && value !== '') {
      this.options[option] = value
    }
    return true
  }

  log = function (...args) {
    this.output('log', ...args)
  }

  warn = function (...args) {
    this.output('warn', ...args)
  }

  error = function (...args) {
    this.output('error', ...args)
  }

  time = function (...args) {
    this.output('time', ...args)
  }

  timeEnd = function (...args) {
    this.output('timeEnd', ...args)
  }

  clear = function () {
    this.output('clear', ...args)
  }

  output = function (type = 'log', ...args) {
    const globalDebugMode = window.hasOwnProperty('debugMode')
      ? window.debugMode
      : true
    if (
      globalDebugMode === true &&
      this.options.debug &&
      typeof console[type] === 'function'
    ) {
      console[type](...args)
    }
  }
}

// counts and limits number charactes in input field
function countChars() {
  const logger = new Logger({ debug: false })

  logger.log('forms count chars')

  var countChars = function ($obj, maxChars = 150) {
    var maxLength = $obj.attr('maxlength') ? $obj.attr('maxlength') : maxChars
    var strLength = $obj.val().length
    var $charCount = $obj.siblings('.show-chars')

    if (strLength > maxLength) {
      $charCount.html(
        '<span style="color: red">' +
          strLength +
          '</span> / ' +
          maxLength +
          ' Zeichen'
      )
    } else {
      $charCount.html(strLength + ' / ' + maxLength + ' Zeichen')
    }
  }

  var fields = ':input[data-count-chars]'

  $('body').on('keyup.countChars', fields, function (e) {
    countChars($(this))
  })
}

// returns an error message for input fields
function inputErrorMessage(msg) {
  const element = document.createElement('div')
  element.classList.add('alert-danger')
  element.innerHTML = msg
  return element
}

// displays multiple input error messages
function showFormInputErrors(obj, form) {
  if (typeof obj === 'object') {
    obj.forEach((error) => {
      // var $input = $form.find('[name="' + name + '"]');
      // if ($input.length == 0) {
      //     $input = $form.find('[name="' + name + '[]"]');
      // }
      // if ($input.length) {
      //     var $group = $input.closest('.form-group');
      //     $.each(val, function (i, v) {
      //         if ($group.hasClass('file-upload')) {
      //             $group.append($(inputErrorMessage(v)));
      //         } else {
      //             $input.after($(inputErrorMessage(v)));
      //         }
      //     });
      //     $group.addClass('has-error');
      // }
    })
    let $firstError = form.querySelector('.has-error')
    if ($firstError) {
      scrollElementIntoView($firstError, 'center')
    }
  }
}

// returns a success message
function successMessage(msg) {
  return '<div class="alert-success">' + msg + '</div>'
}

// appends/prepends a success message to an element
function showSuccessMessage(msg, id, keyword) {
  keyword = keyword || 'before'
  $el = $('#' + id)
  $el[keyword](successMessage(msg))
}

// remove all alerts
function removeAlerts(element) {
  element.classList.remove('has-error')
  element
    .querySelectorAll('.has-error')
    .forEach((el) => el.classList.remove('has-error'))
  element.querySelectorAll('.alert-danger').forEach((el) => el.remove())
  element.parentElement
    .querySelectorAll('.alert-success')
    .forEach((el) => el.remove())
}

// set readonly state on or off
function setFormReadonly(form, state) {
  if (!form) return
  var elements = form.elements
  for (var i = 0, len = elements.length; i < len; ++i) {
    elements[i].readOnly = state
  }
  if (state) {
    form.classList.add('submitting')
    form
      .querySelectorAll('button[type=submit]')
      .forEach((el) => el.setAttribute('disabled', 'disabled'))
  } else {
    form.classList.remove('submitting')
    form
      .querySelectorAll('button[type=submit]')
      .forEach((el) => el.setAttribute('disabled', false))
  }
}

function trimText(str, maxlength = 20) {
  if (!str) return ''
  var regex = /[!-\/:-@\[-`{-~]$/
  if (str.length > maxlength) {
    str = $.trim(str).substring(0, maxlength).split(' ').slice(0, -1).join(' ')
    // remove special chars from text end
    str = str.replace(regex, '')
    return str + '&hellip;'
  }
  return ''
}

function getTemplate(id) {
  const logger = new Logger({ debug: false })
  var template = document.getElementById('template-' + id)
  if (template) {
    return template.content.cloneNode(true)
  }
  logger.log('posts: template not found')
  return false
}

function limitNumberWithinRange(num, min, max) {
  const MIN = min || 1
  const MAX = max || 20
  const parsed = parseInt(num)
  return Math.min(Math.max(parsed, MIN), MAX)
}

const setVh = (suffix = '') => {
  var vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh' + suffix, vh + 'px')
}

const wrapInner = (parent, wrapper, attribute, attributevalue) => {
  if (typeof wrapper === 'string') {
    wrapper = document.createElement(wrapper)
  }
  var div = parent.appendChild(wrapper).setAttribute(attribute, attributevalue)

  while (parent.firstChild !== wrapper) {
    wrapper.appendChild(parent.firstChild)
  }
}

function horizontalLoop(items, config) {
  items = gsap.utils.toArray(items)
  config = config || {}
  let tl = gsap.timeline({
      repeat: config.repeat,
      paused: config.paused,
      defaults: { ease: 'none' },
      onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100)
    }),
    length = items.length,
    startX = items[0].offsetLeft,
    times = [],
    widths = [],
    xPercents = [],
    curIndex = 0,
    pixelsPerSecond = (config.speed || 1) * 100,
    snap = config.snap === false ? (v) => v : gsap.utils.snap(config.snap || 1), // some browsers shift by a pixel to accommodate flex layouts, so for example if width is 20% the first element's width might be 242px, and the next 243px, alternating back and forth. So we snap to 5 percentage points to make things look more natural
    totalWidth,
    curX,
    distanceToStart,
    distanceToLoop,
    item,
    i
  gsap.set(items, {
    // convert "x" to "xPercent" to make things responsive, and populate the widths/xPercents Arrays to make lookups faster.
    xPercent: (i, el) => {
      let w = (widths[i] = parseFloat(gsap.getProperty(el, 'width', 'px')))
      xPercents[i] = snap(
        (parseFloat(gsap.getProperty(el, 'x', 'px')) / w) * 100 +
          gsap.getProperty(el, 'xPercent')
      )
      return xPercents[i]
    }
  })
  gsap.set(items, { x: 0 })
  totalWidth =
    items[length - 1].offsetLeft +
    (xPercents[length - 1] / 100) * widths[length - 1] -
    startX +
    items[length - 1].offsetWidth *
      gsap.getProperty(items[length - 1], 'scaleX') +
    (parseFloat(config.paddingRight) || 0)
  for (i = 0; i < length; i++) {
    item = items[i]
    curX = (xPercents[i] / 100) * widths[i]
    distanceToStart = item.offsetLeft + curX - startX
    distanceToLoop =
      distanceToStart + widths[i] * gsap.getProperty(item, 'scaleX')
    tl.to(
      item,
      {
        xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
        duration: distanceToLoop / pixelsPerSecond
      },
      0
    )
      .fromTo(
        item,
        {
          xPercent: snap(
            ((curX - distanceToLoop + totalWidth) / widths[i]) * 100
          )
        },
        {
          xPercent: xPercents[i],
          duration:
            (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
          immediateRender: false
        },
        distanceToLoop / pixelsPerSecond
      )
      .add('label' + i, distanceToStart / pixelsPerSecond)
    times[i] = distanceToStart / pixelsPerSecond
  }
  function toIndex(index, vars) {
    vars = vars || {}
    Math.abs(index - curIndex) > length / 2 &&
      (index += index > curIndex ? -length : length) // always go in the shortest direction
    let newIndex = gsap.utils.wrap(0, length, index),
      time = times[newIndex]
    if (time > tl.time() !== index > curIndex) {
      // if we're wrapping the timeline's playhead, make the proper adjustments
      vars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) }
      time += tl.duration() * (index > curIndex ? 1 : -1)
    }
    curIndex = newIndex
    vars.overwrite = true
    return tl.tweenTo(time, vars)
  }
  tl.next = (vars) => toIndex(curIndex + 1, vars)
  tl.previous = (vars) => toIndex(curIndex - 1, vars)
  tl.current = () => curIndex
  tl.toIndex = (index, vars) => toIndex(index, vars)
  tl.times = times
  tl.progress(1, true).progress(0, true) // pre-render for performance
  if (config.reversed) {
    tl.vars.onReverseComplete()
    tl.reverse()
  }
  return tl
}

function decryptEmailaddresses() {
  // Ersetze E-Mailadressen
  document.querySelectorAll('span.unicorn').forEach(function (element) {
    element.insertAdjacentText('afterend', '@')
    element.remove()
  })

  // Ersetze mailto-Links
  document
    .querySelectorAll('a[href^="javascript:decryptUnicorn"]')
    .forEach(function (element) {
      // Selektiere Einhorn-Werte
      var emails = element.getAttribute('href').match(/\((.*)\)/)[1]

      emails = emails
        // ROT13-Transformation
        .replace(/[a-z]/gi, function (s) {
          return String.fromCharCode(
            s.charCodeAt(0) + (s.toLowerCase() < 'n' ? 13 : -13)
          )
        })
        // Ersetze # durch @
        .replace(/\|/g, '@')

      // Ersetze Einhörner
      element.setAttribute('href', 'mailto:' + emails)
    })
}

const elementIsVisibleInViewport = (el, partiallyVisible = true) => {
  const { top, left, bottom, right } = el.getBoundingClientRect()
  const { innerHeight, innerWidth } = window
  const viewPortTop = 0
  const viewPortBottom = innerHeight
  // console.log(
  //     el,
  //     'top: ' + top,
  //     'viewPortTop: ' + viewPortTop,
  //     'bottom: ' + bottom,
  //     'viewPortBottom ' + viewPortBottom
  // );
  //  top: 2470.10009765625 viewPortTop: 1952 bottom: 3213.6334228515625 viewPortBottom: 2946
  return partiallyVisible
    ? ((top <= viewPortTop &&
        bottom <= viewPortBottom &&
        bottom > viewPortTop) || // bottom is visible and in viewport
        (top >= viewPortTop && bottom <= viewPortBottom) || // is in viewport
        (top >= viewPortTop &&
          bottom >= viewPortBottom &&
          top < viewPortBottom) || // top is visible and in viewport
        (top <= viewPortBottom && bottom >= viewPortBottom)) && // is in viewport, but extends beyond top and bottom
        ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth))
    : top >= 0 && left >= 0 && bottom <= viewPortBottom && right <= innerWidth
}

const calcDistance = (a, b) => {
  const diffX = b.x - a.x,
    diffY = b.y - a.y

  return Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2))
}

export {
  Logger,
  rexApiCall,
  blendColors,
  isTouchDevice,
  browserIsIE,
  retainScrollPosition,
  getScrollBarWidth,
  setVh,
  scrollElementIntoView,
  wrapInner,
  setFormReadonly,
  removeAlerts,
  inputErrorMessage,
  showFormInputErrors,
  horizontalLoop,
  decryptEmailaddresses,
  elementIsVisibleInViewport
}
