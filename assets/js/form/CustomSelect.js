import './custom-select.css'
import { Logger } from '@/js/utilities.js'
import { gsap } from '@/js/gsap.js'
import Springer from '@/js/Springer'
import { addEvent } from '@/js/eventbus.js'

const logger = new Logger({
  force: false
})

const $doc = document

const defaults = {
  context: document,
  selector: 'div[data-custom-select]',
  iconHtml: `<i class="icon icon-[bi--chevron-down]"></i>`,
  label: true,
  ease: Springer()
}

let debounceTimeout
let searchTerm = ''

class CustomSelect {
  constructor(form, options) {
    logger.log('CustomSelect', 'constructor')

    this.form = form

    this.settings = { ...defaults, ...options }

    this.elements = new Map()
  }

  init = () => {
    logger.log('CustomSelect', 'init')

    const elements = this.form.querySelectorAll(this.settings.selector)
    if (!elements) return

    this.renderCustomSelects(elements)

    this.setSelected()

    this.bindEvents()
  }

  renderCustomSelects = (elements) => {
    logger.log('CustomSelect', 'renderCustomSelects')

    elements.forEach((element) => {
      const select = element.querySelector('select')
      if (!select) return
      const options = [...select.children].filter((option) => option.value)
      if (!options) return

      const label = element.querySelector('label')

      select.classList.add('sr-only')
      const customSelect = document.createElement('div')
      customSelect.classList.add('custom-select')
      const customSelectValueWrap = document.createElement('div')
      customSelectValueWrap.classList.add('custom-select-value-wrap')
      const customSelectValue = document.createElement('div')
      customSelectValue.classList.add('custom-select-value')
      if (this.settings.label) {
        // label.classList.add('sr-only')
        customSelectValue.innerHTML = label.textContent
      }
      customSelectValueWrap.appendChild(customSelectValue)
      if (this.settings.iconHtml) {
        const customSelectIcon = document.createElement('div')
        customSelectIcon.classList.add('custom-select-icon')
        customSelectIcon.innerHTML = this.settings.iconHtml
        customSelectValueWrap.appendChild(customSelectIcon)
      }
      customSelect.appendChild(customSelectValueWrap)
      const customSelectOptions = document.createElement('ul')
      customSelectOptions.classList.add('custom-select-options')
      customSelectOptions.setAttribute('hidden', true)
      options.forEach((option) => {
        const customSelectOption = document.createElement('li')
        customSelectOption.classList.add('custom-select-option')
        customSelectOption.dataset.value = option.value
        customSelectOption.innerHTML = option.innerHTML
        customSelectOptions.appendChild(customSelectOption)
      })
      customSelect.appendChild(customSelectOptions)
      element.appendChild(customSelect)
      this.elements.set(select.id, {
        label: label.textContent,
        select: select,
        wrapper: element,
        options: options,
        customSelect: customSelect
      })
    })
  }

  setSelected = () => {
    this.elements.forEach((element) => {
      const select = element.select
      const selected = select.options[select.selectedIndex]
        ? element.wrapper.querySelector(
            'li[data-value="' +
              select.options[select.selectedIndex].value +
              '"]'
          )
        : element.wrapper.querySelector('li')
      this.selectValue(selected)
    })
  }

  selectValue = ($target) => {
    if (!$target) return
    // const $wrap = $target.closest('.custom-select')
    const $wrap = $target.closest('[data-custom-select]')
    if (!$wrap) return
    const element = this.elements.get($wrap.querySelector('select').id)
    const $customSelect = element.customSelect
    var $selectedDiv = $customSelect.querySelector('.custom-select-value')
    var value = $target.dataset.value
    var $options = $target.closest('.custom-select-options')

    logger.log('CustomSelect', 'select value', value)

    $options.querySelector('.selected')?.classList.remove('selected')
    $target.classList.add('selected')
    element.select.value = value
    const selectedIndex = element.options.filter(
      (option) => option.value === value
    )[0].index
    element.select.selectedIndex = selectedIndex
    element.select.dispatchEvent(new Event('change'))
    $selectedDiv.innerHTML = value
      ? `${element.label}: ${$target.innerHTML}`
      : $target.innerHTML
    if (value) $selectedDiv.parentElement.classList.add('has-value')
    else $selectedDiv.parentElement.classList.remove('has-value')

    $doc.dispatchEvent(
      new CustomEvent('customSelect:selected', {
        bubbles: true,
        detail: {
          value: value,
          wrap: $customSelect,
          select: element.select
        }
      })
    )
  }

  setSelectValue = (event) => {
    event.stopPropagation()
    const $target = event.target.closest(this.settings.selector + ' li')
    if (!$target) return
    this.selectValue($target)
    this.closeSelect(event)
  }

  toggleSelect = (event) => {
    //selects + ' .control-label, ' + selects + ' .custom-select-value-wrap';
    const $target = event.target.closest(
      this.settings.selector + ' .custom-select-value-wrap'
    )
    if (!$target) {
      this.closeAllSelects()
      return
    }
    logger.log('CustomSelect', 'toggleSelect', $target)
    const $wrap = $target.closest('.custom-select')

    if ($wrap.classList.contains('show')) {
      this.closeSelect(event)
    } else {
      this.openSelect(event)
    }
  }

  openSelect = async (event) => {
    const $target = event.target.closest(
      this.settings.selector + ' .custom-select'
    )
    if (!$target) return
    if ($target.classList.contains('show')) return
    logger.log('CustomSelect', 'openSelect', event.target, $target)
    const $options = $target.querySelector('.custom-select-options')
    const $icon = $target.querySelector('.custom-select-icon')
    $options.removeAttribute('hidden')
    $target.classList.add('show')
    gsap.to($icon, { rotation: 180, duration: 0.5, ease: this.settings.ease })
    await gsap.from($options, {
      height: 0,
      clearProps: true,
      duration: 0.5,
      ease: this.settings.ease
    })
  }

  closeSelect = async (event) => {
    const $target = event.target.closest(
      this.settings.selector + ' .custom-select'
    )
    if (!$target) return
    if (!$target.classList.contains('show')) return
    logger.log('CustomSelect', 'closeSelect', event.target, $target)
    const $options = $target.querySelector('.custom-select-options')
    const $icon = $target.querySelector('.custom-select-icon')
    gsap.to($icon, {
      rotation: 0,
      duration: 0.5,
      ease: this.settings.ease,
      clearProps: true
    })

    await gsap.to($options, {
      height: 0,
      clearProps: true,
      duration: 0.5,
      ease: this.settings.ease
    })
    $options.setAttribute('hidden', true)
    $target.classList.remove('show')
  }

  closeAllSelects = () => {
    this.elements.forEach((element) => {
      this.closeSelect({ target: element.customSelect })
    })
  }

  handleKeyboard = (event) => {
    const $target = event.target.closest(
      this.settings.selector + ' .custom-select'
    )
    if (!$target) return
    logger.log('CustomSelect', 'handleKeyboard', $target)

    var $wrap = $target
    var $options = $wrap.querySelector('.custom-select-options')
    var $select = $wrap.parentElement.querySelector('select')

    switch (event.code) {
      case 'Space':
        $wrap.classList.contains('show')
          ? $wrap.classList.remove('show')
          : $wrap.classList.add('show')
        break
      case 'ArrowUp': {
        var prevOption = $options.querySelector(
          'li[data-value="' +
            $select.options[$select.selectedIndex - 1].value +
            '"]'
        )
        if (prevOption) {
          this.selectValue(prevOption)
          return false
        }
        break
      }
      case 'ArrowDown': {
        var nextOption = $options.querySelector(
          'li[data-value="' +
            $select.options[$select.selectedIndex + 1].value +
            '"]'
        )
        if (nextOption) {
          this.selectValue(nextOption)
          return false
        }
        break
      }
      case 'Enter':
      case 'Escape':
        $wrap.classList.remove('show')
        break
      default: {
        clearTimeout(debounceTimeout)
        searchTerm += event.key
        debounceTimeout = setTimeout(function () {
          searchTerm = ''
        }, 500)

        var $searchedOption = [...$options.querySelectorAll('li')].filter(
          (element) =>
            element.innerHTML.toLowerCase().startsWith(searchTerm)
              ? element
              : null
        )
        if ($searchedOption[0]) {
          this.selectValue($searchedOption[0])
        }
      }
    }
  }

  bindEvents = () => {
    logger.log('customselect', 'bindEvents')

    const self = this

    // this.form.removeEventListener('click', this.setSelectValue);
    this.form.addEventListener('click', this.setSelectValue)

    // this.form.removeEventListener('click', this.toggleSelect);
    this.form.addEventListener('click', this.toggleSelect)

    // this.form.removeEventListener('blur', this.closeSelect);
    this.form.addEventListener('blur', this.closeSelect, true)

    // this.form.removeEventListener(
    //     'keydown',
    //     this.handleKeyboard
    // );
    this.form.addEventListener('keydown', this.handleKeyboard)

    addEvent(document, 'click', 'customSelect-closeSelect', (event) => {
      if (!event.target.closest(this.settings.selector)) {
        self.closeAllSelects()
      }
    })
  }
}

export default CustomSelect
