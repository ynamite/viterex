import * as Utils from './utilities.js?v=0.0.18';

const logger = new Utils.Logger();

const $doc = document;

const defaults = {
    context: document,
    selector: 'div[data-custom-select]',
};

let debounceTimeout;
let searchTerm = '';

class MASSIF_customSelect {
    constructor(form, options) {
        logger.log('MASSIF_customSelect', 'constructor');

        this.form = form;

        this.settings = { ...defaults, ...options };

        this.bindEvents();
    }

    init = () => {
        logger.log('MASSIF_customSelect', 'init');

        const self = this;
        const $customSelects = this.settings.context.querySelectorAll(
            this.settings.selector
        );
        if (!$customSelects) return;

        $customSelects.forEach(($customSelect) => {
            const select = $customSelect.querySelector('select');
            const selected = select.options[select.selectedIndex]
                ? $customSelect.querySelector(
                      'li[data-value="' +
                          select.options[select.selectedIndex].value +
                          '"]'
                  )
                : $customSelect.querySelector('li');
            self.selectValue(selected);
        });
    };

    selectValue = ($target) => {
        const $wrap = $target.closest('.custom-select');
        var $selectedDiv = $wrap.querySelector('.custom-select-value');
        var value = $target.dataset.value;
        var $options = $target.closest('.custom-select-options');
        var $select = $wrap.parentElement.querySelector('select');

        logger.log('MASSIF_customSelect', 'select value', value);

        $options.querySelector('.selected')?.classList.remove('selected');
        $target.classList.add('selected');
        $select.value = value;
        $selectedDiv.innerHTML = $target.innerHTML;
        if (value) $selectedDiv.parentElement.classList.add('has-value');
        else $selectedDiv.parentElement.classList.remove('has-value');

        $doc.dispatchEvent(
            new CustomEvent('customSelect:selected', {
                bubbles: true,
                detail: {
                    value: value,
                    wrap: $wrap,
                    select: $select,
                },
            })
        );
    };

    setSelectValue = (event) => {
        const $target = event.target.closest(this.settings.selector + ' li');
        if (!$target) return;
        this.selectValue($target);
        $target.closest('.custom-select').classList.remove('show');
    };

    toggleSelect = (event) => {
        //selects + ' .control-label, ' + selects + ' .custom-select-value-wrap';
        const $target = event.target.closest(
            this.settings.selector + ' .custom-select-value-wrap'
        );
        logger.log('MASSIF_customSelect', 'toggleSelect', $target);
        if (!$target) return;
        const $wrap = $target.closest('.custom-select');
        $wrap.classList.contains('show')
            ? $wrap.classList.remove('show')
            : $wrap.classList.add('show');
    };

    closeSelect = (event) => {
        const $target = event.target.closest(
            this.settings.selector + ' .custom-select'
        );
        if (!$target) return;
        logger.log('MASSIF_customSelect', 'closeSelect', event.target, $target);
        $target.closest('.custom-select').classList.remove('show');
    };

    handleKeyboard = (event) => {
        const $target = event.target.closest(
            this.settings.selector + ' .custom-select'
        );
        if (!$target) return;
        logger.log('MASSIF_customSelect', 'handleKeyboard', $target);

        var $wrap = $target;
        var $options = $wrap.querySelector('.custom-select-options');
        var $select = $wrap.parentElement.querySelector('select');

        switch (event.code) {
            case 'Space':
                $wrap.classList.contains('show')
                    ? $wrap.classList.remove('show')
                    : $wrap.classList.add('show');
                break;
            case 'ArrowUp': {
                var prevOption = $options.querySelector(
                    'li[data-value="' +
                        $select.options[$select.selectedIndex - 1].value +
                        '"]'
                );
                if (prevOption) {
                    this.selectValue(prevOption);
                    return false;
                }
                break;
            }
            case 'ArrowDown': {
                var nextOption = $options.querySelector(
                    'li[data-value="' +
                        $select.options[$select.selectedIndex + 1].value +
                        '"]'
                );
                if (nextOption) {
                    this.selectValue(nextOption);
                    return false;
                }
                break;
            }
            case 'Enter':
            case 'Escape':
                $wrap.classList.remove('show');
                break;
            default: {
                clearTimeout(debounceTimeout);
                searchTerm += event.key;
                debounceTimeout = setTimeout(function () {
                    searchTerm = '';
                }, 500);

                var $searchedOption = [
                    ...$options.querySelectorAll('li'),
                ].filter((element) =>
                    element.innerHTML.toLowerCase().startsWith(searchTerm)
                        ? element
                        : null
                );
                if ($searchedOption[0]) {
                    this.selectValue($searchedOption[0]);
                }
            }
        }
    };

    bindEvents = () => {
        logger.log('customselect', 'bindEvents');

        const self = this;

        // this.form.removeEventListener('click', this.setSelectValue);
        this.form.addEventListener('click', this.setSelectValue);

        // this.form.removeEventListener('click', this.toggleSelect);
        this.form.addEventListener('click', this.toggleSelect);

        // this.form.removeEventListener('blur', this.closeSelect);
        this.form.addEventListener('blur', this.closeSelect, true);

        // this.form.removeEventListener(
        //     'keydown',
        //     this.handleKeyboard
        // );
        this.form.addEventListener('keydown', this.handleKeyboard);
    };
}

export { MASSIF_customSelect, MASSIF_customSelect as default };
