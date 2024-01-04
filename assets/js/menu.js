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

const defDuration = 0.4;

gsap.registerPlugin(CustomEase);
CustomEase.create(
    'menueasing',
    'M0,0 C0,0 0.1331,0.00299 0.21367,0.0142 0.28084,0.02355 0.32414,0.03298 0.38773,0.05396 0.4465,0.07336 0.48593,0.09003 0.53837,0.12135 0.59106,0.15282 0.62566,0.17978 0.66983,0.22244 0.71086,0.26206 0.73557,0.29357 0.76689,0.34203 0.80392,0.39932 0.82341,0.43958 0.85139,0.50331 0.87878,0.56567 0.89148,0.60453 0.91138,0.67106 0.94944,0.79827 1,1 1,1 '
);

const defaults = {
    clone: true,
    injectToBody: false,
    appendArticleNav: false,
    appendAddress: false,
    eventNamePrefix: 'MASSIF_menu',
    hamburgerHtml:
        '<div class="icon"><i class="b b-t"></i><i class="b b-c"></i><i class="b b-b"></i></div>',
    hamburgerHtmlDesktop:
        '<div class="icon"><i class="b b-t"></i><i class="b b-c"></i><i class="b b-b"></i></div>',
    listItemsSelector:
        '.rex-navi1 >li,.rex-navi2 >li, .article-nav a, .lang-nav a',
    dropdownSelector: '.has-dropdown',
    strings: {
        trigger: 'Hauptnavigations-Menü    öffnen',
    },
    animation: {
        defDuration: defDuration,
        menu: {
            from:
                isMobile || isTablet ? { yPercent: -100 } : { yPercent: -100 },
            to:
                isMobile || isTablet
                    ? {
                          yPercent: 0,
                          ease: 'menueasing',
                          overwrite: true,
                          duration: defDuration,
                      }
                    : {
                          yPercent: 0,
                          ease: 'menueasing',
                          overwrite: true,
                          duration: defDuration,
                      },
        },
        listItem: {
            from:
                isMobile || isTablet
                    ? { y: 10, autoAlpha: 0 }
                    : { y: 10, autoAlpha: 0 },
            to:
                isMobile || isTablet
                    ? {
                          y: 0,
                          autoAlpha: 1,
                          overwrite: true,
                          duration: 0.2,
                          clearProps: true,
                      }
                    : {
                          y: 0,
                          autoAlpha: 1,
                          overwrite: true,
                          duration: 0.2,
                          clearProps: true,
                      },
        },
    },
    reInit: true,
    closeOnClick: false,
    closeOnClickEmptySpace: false,
};

class MASSIF_menu {
    constructor(selector, options) {
        logger.log('Menu', 'constructor');

        this.initialized = false;
        this.selector = selector;

        this.settings = { ...defaults, ...options };
        this.settings.selector = selector;
        this.settings.state = 'hidden';
    }

    init = () => {
        logger.log('Menu', 'init');
        // Utils.setBodyScrollLock('clear');
        $html.classList.remove(this.settings.ns + '-opened');
        $html.classList.remove(this.settings.ns + '-open');
        // if (this.initialized) {
        //     logger.log('Menu', 'init close');
        //     this.closeMenu.call(this);
        // }

        if (this.initialized === false || this.settings?.reInit === true) {
            this.$menu = document.querySelector(
                this.selector + ':not([data-js-menu-id])'
            );

            if (!this.$menu) {
                return;
            }

            if (!this.initialized) {
                let date = new Date();
                this.settings.ns =
                    this.$menu.dataset.menuId || 'menu-' + date.getTime();
            }

            logger.log('Menu', 'initializing', this.settings.ns);

            const $oldMenuTrigger = document.querySelector(
                '[data-js-menu-trigger="' + this.settings.ns + '"]'
            );
            if ($oldMenuTrigger) $oldMenuTrigger.remove();
            const $oldMenu = document.querySelector(
                '[data-js-menu-id="' + this.settings.ns + '"]'
            );
            if ($oldMenu) $oldMenu.remove();

            this.$trigger = document.createElement('a');
            this.$trigger.classList.add('menu-trigger');
            this.$trigger.dataset.jsMenuTrigger = this.settings.ns;
            this.$trigger.setAttribute('title', this.settings.strings.trigger);
            let $triggerLabel = document.createElement('span');
            $triggerLabel.setAttribute('hidden', true);
            $triggerLabel.innerHTML = this.settings.strings.trigger;
            this.$trigger.append($triggerLabel);
            $triggerLabel.insertAdjacentHTML(
                'afterend',
                this.settings.hamburgerHtml
            );

            document.querySelector('#menus').append(this.$trigger);

            this.hamburgers = this.$trigger.querySelectorAll(
                '.' + this.settings.ns + '-hamburger-html'
            );

            this.$mobileMenu = this.settings.clone
                ? this.$menu.cloneNode(true)
                : this.$menu;

            delete this.$mobileMenu.dataset.menuDesktop;
            this.$mobileMenu.dataset.jsMenuId = this.settings.ns;
            this.$mobileMenu.dataset.menuMobile = true;
            Utils.wrapInner(this.$mobileMenu, 'div', 'class', 'row-o');

            const $langNav = this.$mobileMenu.querySelector('#lang-nav');
            if ($langNav) $langNav.setAttribute('id', 'lang-nav-mobile');

            const $articleNav = document.querySelector('.article-nav');
            if ($articleNav && this.settings.appendArticleNav) {
                const $articleNavClone = $articleNav.cloneNode(true);
                $articleNavClone.classList.remove(
                    'hidden-below-tablet-landscape'
                );
                this.$mobileMenu
                    .querySelector('.row-o')
                    .append($articleNavClone);
            }
            if (this.settings.appendAddress) {
                const $address = document.querySelector('.footer .address');
                if ($address) {
                    this.$mobileMenu.querySelector('.row-o').append($address);
                }
            }

            if (this.settings.injectToBody || this.settings.clone)
                document.querySelector('#menus').append(this.$mobileMenu);

            this.$listItems = this.$mobileMenu.querySelectorAll(
                this.settings.listItemsSelector
            );

            this.$dropdownTriggers = this.$mobileMenu.querySelectorAll(
                this.settings.dropdownSelector
            );
            this.$dropdowns = this.$mobileMenu.querySelectorAll(
                this.settings.dropdownSelector + '    >    ul'
            );
            this.hasDropdowns = this.$dropdowns.length ? true : false;

            this.bindEvents();

            this.initialized = true;
        }
        // Utils.setBodyScrollLock('on', self.$mobileMenu);
    };

    bindEvents = () => {
        logger.log('Menu', 'bindEvents');

        const self = this;

        // remove events
        $doc.removeEventListener('click', self.openMenu);
        $doc.removeEventListener('click', self.closeOnClickEmptySpace);
        $doc.removeEventListener('keydown', self.closeOnEscapePress);
        self.$mobileMenu.removeEventListener('click', self.handleDropdowns);

        // add events
        $doc.addEventListener('click', self.openMenu);

        if (self.hasDropdowns) {
            self.$dropdownTriggers.forEach(function (element) {
                const $dd = element.querySelector('ul');
                // $dd.setAttribute('hidden', true);
                // const $icon = document.createElement('i');
                // $icon.classList.add('icon fal fa-chevron-down');
                // element.querySelector('a').after($icon);
                if (!element.classList.contains('rex-active')) {
                    $dd.setAttribute('hidden', true);
                } else {
                    element.classList.add('dd-active');
                }
                //     element.dispatchEvent(new Event('click'));
                // }
            });
        } else {
            let $anchors = [...self.$mobileMenu.querySelectorAll('a')];
            $anchors.forEach(function (element) {
                logger.log(
                    'Menu',
                    'bindEvents',
                    'add element closeMenu event',
                    element
                );

                element.addEventListener('click', self.closeMenu);
            });
        }

        // this.$trigger.addEventListener(
        //     'mouseenter',
        //     () => {
        //         if (this.$trigger.classList.contains('active')) return;
        //         gsap.to(this.$trigger, {
        //             ease: 'elastic.out(0.9, 0.3)',
        //             duration: 0.6,
        //             overwrite: true,
        //             rotation: -12,
        //         });
        //     },
        //     false
        // );
        // this.$trigger.addEventListener(
        //     'mouseleave',
        //     () => {
        //         gsap.to(this.$trigger, {
        //             ease: 'elastic.out(0.9, 0.3)',
        //             duration: 0.6,
        //             overwrite: true,
        //             rotation: 0,
        //             clearProps: true,
        //         });
        //     },
        //     false
        // );

        // menu item animation
        // const mainNavAnchors = this.$mobileMenu
        //     .querySelector('.main-nav')
        //     .querySelectorAll('a');
        // mainNavAnchors.forEach(function (element) {
        //     if (
        //         element.classList.contains('rex-active') ||
        //         element.classList.contains('rex-current')
        //     )
        //         return;
        //     // element.addEventListener('click', self.closeMenu);
        //     const chars = element.querySelectorAll('span');
        //     // gsap.set(chars, { perspective: 1000 });
        //     element.addEventListener('mouseenter', function () {
        //         gsap.to(chars, {
        //             duration: 0.2,
        //             color: '#fff',
        //             // rotationX: 360,
        //             overwrite: true,
        //             stagger: 0.025,
        //         });
        //     });
        //     element.addEventListener('mouseleave', function () {
        //         gsap.to(chars, {
        //             duration: 0.2,
        //             color: '#000',
        //             overwrite: true,
        //             stagger: 0.025,
        //             clearProps: true,
        //         });
        //     });
        // });
    };

    toggleMenu = () => {
        logger.log('Menu', 'toggleMenu');

        if (this.settings.state == 'hidden') {
            this.openMenu.call(this);
        }
        if (this.settings.state == 'visible') {
            this.closeMenu.call(this);
        }
    };

    openMenu = (event) => {
        if (
            !event.target.closest(
                '[data-js-menu-trigger="' + this.settings.ns + '"]'
            )
        )
            return;

        if (this.settings.state != 'hidden') {
            this.closeMenu.call(this);
            return;
        }
        logger.log('Menu', 'openMenu', this.settings.ns);

        let self = this;
        this.settings.currentScrollPosition = window.scrollY;
        $html.classList.add(self.settings.ns + '-open');

        this.$trigger.dispatchEvent(new Event('blur'));
        this.$trigger.classList.add('active');
        this.$mobileMenu.classList.add('open');

        gsap.set(this.$mobileMenu, { display: 'flex' });
        gsap.set(this.$mobileMenu, this.settings.animation.menu.from);
        gsap.set(this.$listItems, this.settings.animation.listItem.from);

        let to = { ...this.settings.animation.menu.to };

        to.onComplete = function () {
            gsap.delayedCall(0.01, function () {
                $html.classList.add(self.settings.ns + '-opened');
            });
            // Utils.setBodyScrollLock('off', self.$mobileMenu);
            // $html.classList.add('disable-smooth-scroll');
            self.toggleListItems(self.$listItems);
            $doc.addEventListener('click', self.closeOnClickEmptySpace);
            $doc.addEventListener('keydown', self.closeOnEscapePress);
            self.settings.state = 'visible';

            if (self.hasDropdowns) {
                self.$mobileMenu.addEventListener(
                    'click',
                    self.handleDropdowns
                );
            }
        };

        gsap.fromTo(this.$mobileMenu, this.settings.animation.menu.from, to);
    };

    toggleListItems = async ($items, toggle = 'on') => {
        const timeOut = function ($li, to, delay) {
            return new Promise(function (resolve, reject) {
                setTimeout(async function () {
                    await gsap.to($li, to);
                    resolve();
                }, delay);
            });
        };
        const promises = [];
        let self = this;
        let to = { ...self.settings.animation.listItem.to };
        let delayFactor = 50;
        if (toggle == 'off') {
            delayFactor = 25;
            to.autoAlpha = 0;
            delete to.clearProps;
            $items = [...$items].reverse();
        }
        $items.forEach(function ($item, i) {
            let delay = i == 0 ? delayFactor : delayFactor * (i + 0.5);
            promises.push(timeOut($item, to, delay));
        });
        return Promise.all(promises);
    };

    closeMenu = () => {
        logger.log('Menu', 'closeMenu', this.settings.ns);
        let self = this;

        if (self.settings.state == 'hidden') return;
        self.settings.state = 'hidden';

        let callback = function () {
            if (!$html.classList.contains(self.settings.ns + '-open')) return;

            // Utils.setBodyScrollLock('on', self.$mobileMenu);
            gsap.delayedCall(0.01, function () {
                $html.classList.remove(self.settings.ns + '-opened');
                $html.classList.remove(self.settings.ns + '-open');
                window.scrollY = self.settings.currentScrollPosition;
            });
            let to = { ...self.settings.animation.menu.from };
            to.overwrite = true;
            to.duration = self.settings.animation.menu.to.duration / 2;
            to.clearProps = true;
            to.onComplete = function () {
                self.$mobileMenu.classList.remove('open');
                // if (window.location.hash) {
                //     let el = document.querySelector(window.location.hash);
                //     Utils.scrollElementIntoView(el);
                // }
            };

            gsap.to(self.$mobileMenu, to);

            $doc.removeEventListener('click', self.closeOnClickEmptySpace);
            $doc.removeEventListener('keydown', self.closeOnEscapePress);
            self.$mobileMenu.removeEventListener('click', self.handleDropdowns);
        };

        self.toggleListItems(self.$listItems, 'off').then(function () {
            self.$trigger.classList.remove('active');
            callback();
        });

        // gsap.delayedCall(1, function () {
        //     if ($html.classList.contains(self.settings.ns + '-open')) {
        //         callback();
        //     }
        // });

        // callback();
    };

    closeOnClickEmptySpace = (event) => {
        if (
            !this.settings.closeOnClickEmptySpace ||
            event.target.closest(this.selector)
            // !(
            //     this.settings.closeOnClickEmptySpace &&
            //     event.target.closest(this.selector)
            // ) &&
            // !(this.settings.closeOnClick && event.target.closest('a'))
        ) {
            return;
        }
        logger.log(
            'Menu',
            `click.${this.settings.eventNamePrefix}-close`,
            this.settings.closeOnClick
        );
        this.closeMenu();
    };

    closeOnEscapePress = (event) => {
        var isEscape = false;
        if ('keyCode' in event) {
            isEscape = event.key === 'Escape' || event.key === 'Esc';
        } else {
            isEscape = event.keyCode === 27;
        }
        if (isEscape && this.settings.state == 'visible') {
            logger.log(
                'Menu',
                `keydown.${this.settings.eventNamePrefix}-close`
            );
            this.closeMenu();
        }
    };

    handleDropdowns = async (event) => {
        event.stopPropagation();
        const self = this;

        let $target = event.target;
        let dropdownClass = this.settings.dropdownSelector.substring(
            1,
            this.settings.dropdownSelector.length
        );
        if (
            !$target.classList.contains(dropdownClass) &&
            !$target.classList.contains('icon')
        )
            return;
        event.preventDefault();
        if ($target.classList.contains('icon')) {
            $target = $target.closest('li');
        }
        const $dd = $target.querySelector('ul');
        let $activeDds = [...self.$dropdownTriggers].filter((item) =>
            item.classList.contains('.dd-active')
        );
        $activeDds = $activeDds.filter(($dd) => $dd !== $target);

        if ($target.classList.contains('dd-active')) {
            $dd.parentElement.classList.remove('dd-active');
            await gsap.to($dd, {
                height: 0,
                opacity: 0,
                y: -10,
                clearProps: true,
            });
            $dd.setAttribute('hidden', true);
        } else {
            $activeDds.forEach(($activeDd) => {
                $activeDd.classList.remove('dd-active');
                $activeDd.querySelector('ul').setAttribute('hidden', true);
            });
            $dd.removeAttribute('hidden');
            $dd.parentElement.classList.add('dd-active');
            gsap.from($dd, {
                height: 0,
                opacity: 0,
                y: -10,
                clearProps: true,
            });
        }
    };
}

export { MASSIF_menu, MASSIF_menu as default };
