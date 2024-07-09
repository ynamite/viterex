/*!
 * massif form
 * @author: Yves Torres, studio@massif.ch
 */
import './style.css'
import {
  Logger,
  setFormReadonly,
  removeAlerts,
  scrollElementIntoView,
  inputErrorMessage
} from '@/js/utilities.js'

const logger = new Logger()

const $doc = document
const $html = document.querySelector('html')

const animateLabelFields =
  'input[type="text"], input[type="password"], input[type="date"], input[type="email"], input[type="number"], textarea'
const animateLabelFieldsArray = animateLabelFields.split(', ')

const placeholderFields =
  'input[type="text"], input[type="password"], input[type="date"], input[type="email"], input[type="number"], textarea'
const placeholderFieldsArray = placeholderFields.split(', ')

const defaults = {
  handler: 'yform',
  usePlaceholders: false,
  animateLabels: true,
  customSelect: false,
  callbacks: {
    initForm: []
  }
}
const events = {
  ready: new Event('forms_ready')
}

class form {
  constructor(selector, options) {
    logger.log('MASSIF_form', 'constructor')

    this.formInputsModified = {}
    this.response = {}

    this.settings = { ...defaults, ...options }

    this.selector = selector

    // this.settings.state = 'hidden';
  }

  init = () => {
    logger.log('MASSIF_form', 'init')

    this.forms = document.querySelectorAll(this.selector)

    if (!this.forms) return

    this.forms.forEach((form) => {
      if (form.dataset?.state === 'ready') return
      this.initForm(form)
      if (this.settings.customSelect) {
        this.initCustomSelect(form)
      }
      form.dataset.state = 'ready'
    })
  }

  initForm = (form) => {
    const self = this
    if (self.settings.usePlaceholders) {
      self.usePlaceholders(form)
    }
    if (self.settings.animateLabels) {
      self.animateLabels(form)
    }
    if (self.settings.callbacks.initForm.length > 0) {
      self.settings.callbacks.initForm.forEach((callback) => {
        if (typeof callback === 'function') callback()
      })
    }
    form.setAttribute('enctype', 'application/x-www-form-urlencoded')
    form.enctype = 'application/x-www-form-urlencoded'
    form.addEventListener(
      'click',
      (event) => {
        const $target = event.target.closest('[data-confirm]')
        if ($target) {
          if (!confirm($target.dataset.confirm)) {
            event.stopPropagation()
            event.preventDefault()
            return false
          }
        }
      },
      true
    )
    form.addEventListener('submit', (event) => {
      event.preventDefault()
      form.classList.add('submitting')
      return self.submitForm(form)
    })
    form.addEventListener('change', (event) => {
      const element = event.target
      if (!element.matches('input')) return
      if (element.name != 'sub_status') return
      let url = window.location.pathname
      if (element.value == 0) {
        url += '?unsub=1'
      } /* else {
                url += 'unsub=0&sub_status=1';
            }*/
      // function scrollToNlForm() {
      //     scrollElementIntoView($('#form-sub-nl_wrap'));
      //     MASSIF.main.swup.off('contentReplaced', scrollToNlForm);
      // }
      // MASSIF.main.swup.on('contentReplaced', scrollToNlForm);
      window.swup.navigate(url, { animation: 'newsletter' })
    })

    'blur keyup'.split(' ').forEach(function (event) {
      form.addEventListener(
        event,
        (event) => {
          if (event.target.matches('input')) {
            let $input = event.target
            if ($input.value) {
              removeAlerts($input.closest('.form-group'))
            }
          }
        },
        true
      )
    })

    document.dispatchEvent(new CustomEvent('forms_ready', { detail: form }))
  }

  usePlaceholders = (form) => {
    logger.log('MASSIF_form', 'usePlaceholders')

    placeholderFieldsArray.forEach((selector) => {
      form.querySelectorAll(selector).forEach((field) => {
        const label = field.parentElement.querySelector('label')
        field.setAttribute('placeholder', label.textContent)
      })
    })
  }

  animateLabels = (form) => {
    logger.log('MASSIF_form', 'animatedLabels')

    //const $fields = Array.from($body.querySelectorAll(fields));

    const setFocus = (event) => {
      animateLabelFieldsArray.forEach((field) => {
        const $target = event.target.closest(field)
        if ($target) {
          $target.closest('.form-group')?.classList.add('focused')
        }
      })
    }

    const handleField = ($field, event) => {
      const inputValue = $field.value.trim()
      const isDateField = $field?.type === 'date'
      const $parent = $field.closest('.form-group')
      if ($parent) {
        if (inputValue == '' && !isDateField) {
          $parent.classList.remove('filled')
          $parent.classList.remove('focused')
        } else if (inputValue != '' || isDateField) {
          $parent.classList.add('filled')
          if (event.type == 'focusout') {
            $parent.classList.remove('has-error')
          }
        }
        if (
          inputValue == '' &&
          $field.placeholder != '' &&
          $field.hasAttribute('placeholder')
        ) {
          $parent.classList.add('focused')
        }
      }
    }

    const checkFocus = (event) => {
      animateLabelFieldsArray.forEach((field) => {
        const $target = event.target.closest(field)
        if ($target) {
          handleField($target, event)
        }
      })
    }

    form.addEventListener('focus', setFocus, true)

    'blur change keyup'.split(' ').forEach(function (event) {
      form.addEventListener(event, checkFocus, true)
    })

    animateLabelFieldsArray.forEach((selector) => {
      form.querySelectorAll(selector).forEach((field) => {
        field.dispatchEvent(new Event('blur'))
        if (document.activeElement === field) {
          handleField(field, new Event('focus'))
        }
      })
    })
  }

  submitForm = (form) => {
    logger.log('MASSIF_form', 'handle form ID: ' + form.id)

    const self = this

    self
      .processFormData(form)
      .then(async function (response) {
        self.response[form.id] = response
        setFormReadonly(form, false)
        self.formInputsModified[form.id] = false
        self.handleForm(form, self.settings.handler)
        return response
      })
      .catch(function (error) {
        setFormReadonly(form, false)
        self.formInputsModified[form.id] = false
        console.error(error)
      })
    return false
  }

  processFormData = async (form) => {
    logger.log('MASSIF_form', 'processFormData form: ' + form.id)
    const data = new FormData(form)
    const endpoint = form.querySelector('input[name="rex-api-call"]')?.value

    removeAlerts(form)

    const url = endpoint ? 'index.php?rex-api-call=' + endpoint : form.action

    logger.log('MASSIF_form', 'processFormData', 'processing form', data)

    const response = await fetch(url, {
      method: 'POST',
      mode: 'same-origin',
      credentials: 'same-origin',
      body: data
    })

    if (response.error && response.message) {
      logger.log('MASSIF_form', 'form has errors: ' + form.id)

      showFormInputErrors(response.message, form)
      return response
    }

    const json = await response.text()
    const parser = new DOMParser()
    const html = parser.parseFromString(json, 'text/html')
    //result['actionPerformed'] = data.get('action');

    return html
  }

  handleForm = (form, handler) => {
    logger.log('MASSIF_form', 'form sent successfully - formCallback')
    try {
      this[handler + 'Handler'](form)
    } catch (error) {
      console.error(error)
    }
  }

  yformHandler = (form) => {
    logger.log('MASSIF_form', 'yformHandler', this.response[form.id])
    const $responseForm = this.response[form.id].querySelector('#' + form.id)
    if (!$responseForm) {
      const $successMessage = this.response[form.id].querySelector('.alert')
      if ($successMessage) {
        $successMessage.classList.add('success')
        form.replaceWith($successMessage)
      }
      scrollElementIntoView($successMessage)

      return
    }
    let $alert = $responseForm.querySelector('.alert')
    form.replaceWith($responseForm)
    form = $responseForm
    if ($alert) {
      let $alertEntries = $alert.querySelectorAll('li')

      $alertEntries = form.querySelectorAll('.alert-danger li')

      $alertEntries.forEach(function (entry, idx) {
        const $alertElement = inputErrorMessage(entry.innerHTML)
        const $input = form.querySelector(
          '#yform-' + form.id + '-' + entry.dataset.id
        )
        if (!$input) return
        $input.append($alertElement)
        if (idx == 0) {
          $input.querySelector('input').focus()
          setTimeout(() => {
            scrollElementIntoView($input, 100)
          }, 100)
        }
      })

      form.querySelector('div.alert').remove()
    }

    form.classList.remove('submitting')
    this.initForm(form)

    $html.classList.remove('headroom--unpinned')
  }

  initCustomSelect = async (form) => {
    // const module = await import('/assets/theme/js/custom-select.js?v=0.0.1')
    // this.customSelect = new module.MASSIF_customSelect(form)
    // this.customSelect.init()
  }
}

export default form
