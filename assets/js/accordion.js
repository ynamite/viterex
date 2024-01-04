const Utils = await import(MASSIF.assets.js.utilities);

const logger = new Utils.Logger();

const $doc = document;
const $html = document.querySelector('html');
const $body = $html.querySelector('body');

const isMobile = $html.classList.contains('is-mobile');
const isTablet = $html.classList.contains('is-tablet');
const isIE = Utils.browserIsIE();
const isEdge = !Utils.browserIsIE() && !!window.StyleMedia;
const touchDevice = Utils.is_touch_device();

const defaults = {
    closeOthers: false,
};

class MASSIF_accordion {
    constructor(options) {
        logger.log('Accordion', 'constructor');
        this.settings = { ...defaults, ...options };
        this.init();
    }

    init = () => {
        logger.log('Accordion', 'init');

        this.bindEvents();
    };

    bindEvents = () => {
        logger.log('Accordion', 'bindEvents');

        const self = this;

        // const $accordions = document.querySelectorAll('.accordion');
        // if (!$accordions.length) return;
        // $accordions.forEach(($accordion) => {
        //     const $items = $accordion.querySelectorAll('.accordion-item');
        //     $items.forEach(($item) => {
        //         const $itemTrigger = $item.querySelector('[data-expand]');
        //         const $itemLabel = $itemTrigger.querySelector('span');
        //         const $itemIcon = $itemTrigger.querySelector('.icon');
        //         const $itemExp = $item.querySelector('[data-expand-id]');
        //         this.closeItem($itemTrigger, $itemLabel, $itemIcon, $itemExp);
        //     });
        // });

        // .querySelectorAll('.accordion-item.open');

        document.addEventListener('click', async (event) => {
            if (event.target.closest('[data-expand]')) {
                if (event.target.tagName === 'A') return;
                const $trigger = event.target.closest('[data-expand]');
                const $label = $trigger.querySelector('span');
                const $icon = $trigger.querySelector('.icon');
                const id = $trigger.dataset?.expand;
                if (!id) return;
                const $exp = document.querySelector(
                    '[data-expand-id="' + id + '"]'
                );
                if (!$exp) return;
                $trigger.blur();

                const state = $exp.getAttribute('hidden');

                if (state) {
                    if (this.settings.closeOthers) {
                        await this.closeOthers($trigger);
                    }

                    return this.openItem($trigger, $label, $icon, $exp);
                }
                return this.closeItem($trigger, $label, $icon, $exp);
            }
        });
    };

    openInitial = () => {
        logger.log('Accordion', 'openInitial');

        const $openItems = document.querySelectorAll('[data-expand-initial]');
        if ($openItems.length) {
            $openItems.forEach(async ($trigger) => {
                const id = $trigger.dataset?.expand;
                const $label = $trigger.querySelector('span');
                const $icon = $trigger.querySelector('.icon');
                if (!id) return;
                const $exp = document.querySelector(
                    '[data-expand-id="' + id + '"]'
                );
                if (!$exp) return;
                await this.openItem($trigger, $label, $icon, $exp);
            });
        }
    };

    closeOthers = async ($trigger) => {
        const $openItems = $trigger
            .closest('.accordion')
            .querySelectorAll('.accordion-item.open');
        if ($openItems.length) {
            $openItems.forEach(($item) => {
                const $itemTrigger = $item.querySelector('[data-expand]');
                const $itemLabel = $itemTrigger.querySelector('span');
                const $itemIcon = $itemTrigger.querySelector('.icon');
                const $itemExp = $item.querySelector('[data-expand-id]');
                this.closeItem($itemTrigger, $itemLabel, $itemIcon, $itemExp);
            });
        }
    };

    openItem = async ($trigger, $label, $icon, $exp) => {
        if ($icon) {
            gsap.to($icon, {
                rotation: -180,
                // y: 10,
                // opacity: 0,
                duration: 0.2,
                transformOrigin: 'center center',
                // onComplete: () => {
                //     gsap.fromTo(
                //         $icon,
                //         {
                //             rotation: 45,
                //             y: -10,
                //             opacity: 0,
                //         },
                //         { y: 0, opacity: 1, duration: 0.3 }
                //     );
                // },
            });
        }

        $exp.removeAttribute('hidden');
        $trigger.parentElement.classList.add('open');
        gsap.from($exp, {
            height: 0,
            opacity: 0,
            y: -10,
            duration: 0.2,
            clearProps: true,
            onComplete: () => {
                if (ScrollTrigger)
                    gsap.delayedCall(0.1, () => ScrollTrigger.refresh());
            },
        });
        if ($label) {
            $trigger.dataset.expandLabel = $label.innerHTML;
            if ($trigger.dataset?.expandToggledLabel)
                $label.innerHTML = $trigger.dataset.expandToggledLabel;
        }
        return false;
    };

    closeItem = async ($trigger, $label, $icon, $exp) => {
        if ($icon) {
            gsap.to($icon, {
                // y: -10,
                // opacity: 0,
                rotation: 0,
                duration: 0.2,
                transformOrigin: 'center center',
                clearProps: true,
                // onComplete: () => {
                //     gsap.fromTo(
                //         $icon,
                //         { rotation: 0, y: 10, opacity: 0 },
                //         {
                //             y: 0,
                //             opacity: 1,
                //             duration: 0.3,
                //         }
                //     );
                // },
            });
        }

        if ($label && $trigger.dataset?.expandLabel)
            $label.innerHTML = $trigger.dataset.expandLabel;
        $trigger.parentElement.classList.remove('open');
        await gsap.to($exp, {
            height: 0,
            opacity: 0,
            duration: 0.2,
            y: -10,
            clearProps: true,
            onComplete: () => {
                if (ScrollTrigger)
                    gsap.delayedCall(0.1, () => ScrollTrigger.refresh());
            },
        });
        $exp.setAttribute('hidden', true);
        return false;
    };
}

export { MASSIF_accordion, MASSIF_accordion as default };
