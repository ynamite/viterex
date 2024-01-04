const Utils = await import(MASSIF.assets.js.utilities);
const { MASSIF_menu } = await import(MASSIF.assets.js.menu);
const { MASSIF_form } = await import(MASSIF.assets.js.form);
const { MASSIF_accordion } = await import(MASSIF.assets.js.accordion);
// const A11yDialog = await import(
//     MASSIF.assets.js.path + 'vendor/a11y-dialog.min.js'
// );

// import gsap from './vendor/gsap-3.11.3/esm/index.js';
// import ScrollTrigger from './vendor/gsap-3.11.3/esm/ScrollTrigger.js';
// import CustomEase from './vendor/gsap-3.11.3/esm/CustomEase.js';
// import Circ from './vendor/gsap-3.11.3/esm/EasePack.js';

window.debugMode = false;

const logger = new Utils.Logger();
const jsPath = MASSIF.assets.js.path;
const jsVendorPath = jsPath + 'vendor/';
const $html = document.documentElement;
const $body = $html.querySelector('body');
const $header = $html.querySelector('.header');
const isMobile = $html.classList.contains('is-mobile');
const isTablet = $html.classList.contains('is-tablet');
const isIE = Utils.browserIsIE();
const isEdge = !Utils.browserIsIE() && !!window.StyleMedia;
const touchDevice = Utils.is_touch_device();
const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
const isSsafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1;
const scrollTriggers = [];

let massif_menu = null;
let massif_form = null;
let massif_accordion = null;

let scrollBarWidth = 0;
let keyvisualTimeline = null;

const init = async () => {
    logger.log('init');

    Utils.setVh();
    Utils.setVh('-initial');

    //Utils.retainScrollPosition();
    scrollBarWidth = Utils.getScrollBarWidth();
    document.documentElement.style.setProperty(
        '--scrollbarwidth',
        scrollBarWidth + 'px'
    );

    if (touchDevice) {
        $html.classList.add('touch-device');
    } else {
        $html.classList.remove('not-touch-device');
    }

    /*
     * setup gsap stuff
     */
    gsap.registerPlugin(ScrollTrigger);
    gsap.registerPlugin(CustomEase);
    gsap.registerPlugin(ScrollToPlugin);
    ScrollTrigger.config({ ignoreMobileResize: true });
    CustomEase.create(
        'custom-ease',
        'M0,0 C0,0 0.1331,0.00299 0.21367,0.0142 0.28084,0.02355 0.32414,0.03298 0.38773,0.05396 0.4465,0.07336 0.48593,0.09003 0.53837,0.12135 0.59106,0.15282 0.62566,0.17978 0.66983,0.22244 0.71086,0.26206 0.73557,0.29357 0.76689,0.34203 0.80392,0.39932 0.82341,0.43958 0.85139,0.50331 0.87878,0.56567 0.89148,0.60453 0.91138,0.67106 0.94944,0.79827 1,1 1,1 '
    );

    /*
     * launch common scripts
     */

    massif_menu = new MASSIF_menu('.main-menu', {
        clone: true,
    });

    massif_form = new MASSIF_form('.rex-yform', {
        //animateLabels: true,
        callbacks: { initForm: [formToggleFields] },
    });

    massif_accordion = new MASSIF_accordion();

    // massif_filter = new MASSIF_filter({
    //     selector: '.filter',
    //     itemsWrapper: '.row-team',
    //     itemsSelector: '.department',
    // });

    swup();

    commonInits();

    // headroom();

    // lightboxes();

    // dialogs();

    eventListeners();

    // Utils.resizeHandler();
};

const commonInits = async () => {
    logger.log('commonInits');

    Utils.decryptEmailaddresses();

    massif_menu.init();
    massif_form.init();
    massif_accordion.openInitial();

    formToggleFields();

    // lightboxes();

    setupPlyr();

    downloads();

    sisyphus();

    let $firstContent = document.querySelector('.content-main > :first-child');
    if ($firstContent) {
        $firstContent.classList.add('first-row');
    }
    let $lastContent = document.querySelector('.content-main > :last-child');
    if ($lastContent != $firstContent) {
        $lastContent.classList.add('last-row');
    }

    if (keyvisualTimeline) keyvisualTimeline.kill();
    keyvisualTimeline = null;
    const keyVisual = document.querySelector('#key-visual svg');
    if (keyVisual) {
        let animate = keyVisual?.querySelector('animate');
        let animateProp = animate?.getAttribute('attributeName');
        let animateDur = animate?.getAttribute('dur');
        let animatevalues = animate?.getAttribute('values').split(';');
        let duration = (parseFloat(animateDur) * 1) / animatevalues.length;
        let path = animate.closest('g').querySelector('path');
        let start = (duration * (animatevalues.length / 1)) / 0.5;
        animate.remove();

        keyvisualTimeline = gsap.timeline({
            paused: true,
            repeat: -1,
            repeatDelay: duration,
            yoyo: true,
            defaults: {
                ease: `steps(5000)`,
                // ease: 'Power1.in',
            },
        });
        animatevalues.forEach((value, idx) => {
            keyvisualTimeline.to(path, {
                [animateProp]: `${value * 1}`,
                duration: duration,
            });
        });
        keyvisualTimeline.play(start);
    }

    const images = await initImages();
    // const swipers = await initSwipers();

    setupScrollTriggers();
};

const swupRefresh = () => {
    logger.log('swup refresh');

    // main.forms();

    // gsap.delayedCall(0.5, () => {
    commonInits();

    // });
    Utils.setBodyScrollLock('on', $html);

    const backBtns = document.querySelectorAll('.back-btn');
    if (backBtns) {
        backBtns.forEach((btn) => {
            btn.href = 'javascript:void(0);';
            btn.addEventListener('click', (event) => {
                event.preventDefault();
                window.history.back();
            });
        });
    }

    /* logo click always goes to language homepage top */
    let departmentHomeUrl =
        document.getElementById('content').dataset?.logoHref;
    $header
        .querySelector('.site-logo a')
        .setAttribute('href', departmentHomeUrl);

    ScrollTrigger.refresh();
};

const eventListeners = () => {
    ['modal_ready', 'forms_ready'].forEach(function (e) {
        document.addEventListener(
            e,
            (event) => {
                document
                    .querySelectorAll('[data-count-chars]')
                    .forEach(($el) => $el.dispatchEvent('keyup'));

                if (e === 'modal_ready') {
                    massif_form.init();
                }
            },
            false
        );
    });
};

const dialogs = () => {
    let showCounter = 0;
    // Get the dialog container HTML element (with the accessor method you want)
    const element = document.getElementById('overlay-27');
    if (!element) return;

    // Instantiate a new A11yDialog module
    const dialog = new A11yDialog.default(element);
    dialog
        .on('show', async () => {
            gsap.set(element, {
                display: 'flex',
            });
            Utils.setBodyScrollLock('off', element);
            await gsap.from(element, {
                opacity: 0,
                y: 10,
                delay: showCounter === 0 ? 0.5 : 0,
            });
            showCounter++;
            $html.classList.add('main-menu-opened');
        })
        .on('hide', async () => {
            await gsap.to(element, {
                display: 'none',
                opacity: 0,
                y: 10,
                clearProps: 'all',
            });
            Utils.setBodyScrollLock('on', element);
            $html.classList.remove('main-menu-opened');
        });
    dialog.show();
};

const downloads = function () {
    let $anchors = document.querySelectorAll('a[href$=".pdf"]');
    $anchors.forEach(($anchor, idx) => {
        let $list = $anchor.closest('ul');
        if ($list) $list.classList.add('download-list');
        let $li = $anchor.closest('li');
        $li.classList.add('download-item');
        $anchor.classList.add('download');
        let content = $anchor.innerHTML;
        $anchor.innerHTML =
            '<i class="icon fal fa-file-pdf"></i><span class="label">' +
            content +
            '</span>';
    });
};

const formToggleFields = () => {
    document.querySelectorAll('[data-toggle-field]').forEach(($trigger) => {
        const $radios = $trigger.querySelectorAll('input[type="radio"]');
        const toggleValues = $trigger.dataset.toggleValue.split(',');
        const toggleFieldId = $trigger.dataset.toggleField;
        const $toggleField = document.querySelector('#' + toggleFieldId);
        for (const $radio of $radios) {
            let doBreak = false;
            $radio.addEventListener('change', (event) => {
                if (
                    event.target.checked &&
                    toggleValues.includes(event.target.value)
                ) {
                    $toggleField.removeAttribute('hidden');
                    doBreak = true;
                    return;
                }
                $toggleField.setAttribute('hidden', true);
                const isInitial = event.detail?.initial || false;
                if (!isInitial) {
                    $toggleField.querySelectorAll('input').forEach(($input) => {
                        $input.value = '';
                    });
                }
            });
            $radio.dispatchEvent(
                new CustomEvent('change', { detail: { initial: true } })
            );
            if (doBreak) break;
        }
    });
};

const sisyphus = () => {
    gsap.delayedCall(0.1, () => {
        const triangleD = document.querySelector('#sis-triangle-d');
        const circleD = document.querySelector('#sis-circle-d');
        const triangleM = document.querySelector('#sis-triangle-m');
        const circleM = document.querySelector('#sis-circle-m');
        const mediaQuery = window.matchMedia('(min-width: 1024px)');
        const offsetTop = 300;

        const positionD = {
            x: -320,
            y: 320,
            shift: 37,
        };
        const positionM = {
            x: -95.5,
            y: 64,
        };

        window.addEventListener('scroll', () => {
            if (mediaQuery.matches) {
                const offsetTop = 300;

                // Desktop version
                const triangleRectD = triangleD.getBoundingClientRect();
                const ratioD =
                    (triangleRectD.top - offsetTop) /
                    (window.innerHeight - offsetTop);

                // Slide onto the tip of the triangle
                let ratioD2 = 1;
                if (ratioD > 0 && ratioD <= 0.05) {
                    ratioD2 = Math.pow(ratioD / 0.05, 0.5);
                }

                // General movement
                if (ratioD >= 1) {
                    circleD.style.transform = `translate(${positionD.x}px, ${positionD.y}px)`;
                } else if (ratioD > 0 && ratioD <= 1) {
                    circleD.style.transform = `translate(${
                        positionD.x * ratioD - positionD.shift * ratioD2
                    }px, ${positionD.y * ratioD}px)`;
                } else {
                    circleD.style.transform = `translate(0,0)`;
                }
            } else {
                const offsetTop = 200;

                // Mobile version
                const triangleRectM = triangleM.getBoundingClientRect();
                const ratioM =
                    (triangleRectM.top - offsetTop) /
                    (window.innerHeight - offsetTop);

                // General movement
                if (ratioM >= 1.5) {
                    circleM.style.transform = `translate(${
                        positionM.x * 1.5
                    }%, ${positionM.y * 1.5}%)`;
                } else if (ratioM > -0.5 && ratioM <= 1.5) {
                    circleM.style.transform = `translate(${
                        positionM.x * ratioM
                    }%, ${positionM.y * ratioM}%)`;
                } else {
                    circleM.style.transform = `translate(${
                        positionM.x * -0.5
                    }%, ${positionM.y * -0.5}%)`;
                }
            }
        });
    });
};

const setupScrollTriggers = () => {
    // reset scroll triggers
    if (scrollTriggers.length) scrollTriggers.forEach((ST) => ST.kill(true));

    // header headroom style
    let ST = ScrollTrigger.create({
        trigger: $body,
        start: 'top -50',
        end: 9999999,
        onUpdate: (self) => {
            self.progress === 0
                ? $body.classList.remove('not-top')
                : $body.classList.add('not-top');

            self.direction === -1
                ? $body.classList.remove('unpinned')
                : $body.classList.add('unpinned');
        },
    });
    scrollTriggers.push(ST);

    // let mm = gsap.matchMedia();
    // // add a media query. When it matches, the associated function will run
    // mm.add('(min-width: 1024px)', () => {
    //     const keyVisual = document.querySelector('#key-visual');
    //     if (keyVisual) {
    //         const speed = 0.25;
    //         let anim = gsap.to(keyVisual, {
    //             y: (i, el) =>
    //                 (1 - parseFloat(speed)) * ScrollTrigger.maxScroll(window),
    //             ease: 'none',
    //             scrollTrigger: {
    //                 start: 0,
    //                 end: (st) => st.end * 2,
    //                 // end: 'max',
    //                 // markers: true,
    //                 invalidateOnRefresh: true,
    //                 scrub: 1.5,
    //             },
    //         });
    //     }
    // });
    const keyVisual = document.querySelector('#key-visual');
    if (keyVisual) {
        const keyVisualParent = keyVisual.closest('.key-visual');
        let anim = gsap.to(keyVisual.querySelector('svg'), {
            opacity: 0.0001,
            ease: 'none',
            scrollTrigger: {
                trigger: keyVisualParent,
                start: 'top top',
                end: 'bottom top',
                // end: 'max',
                // markers: true,
                invalidateOnRefresh: true,
                scrub: 1.5,
            },
        });
        scrollTriggers.push(anim.scrollTrigger);
        let anim2 = gsap.to(keyVisual, {
            background: 'transparent',
            ease: 'none',
            scrollTrigger: {
                trigger: keyVisualParent,
                start: 'bottom top',
                end: () => keyVisual.offsetHeight + 1,
                // end: 'max',
                // markers: true,
                invalidateOnRefresh: true,
                scrub: 1.5,
            },
        });
        scrollTriggers.push(anim2.scrollTrigger);
    }

    // back to top button fade in after scroll
    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
        gsap.set(backToTopButton, { autoAlpha: 0 });
        let anim = gsap.to(backToTopButton, {
            autoAlpha: 1,
            duration: 0.3,
            scrollTrigger: {
                trigger: $body,
                start: `top+=${window.innerHeight}px top`,
                end: 999999,
                toggleActions: 'play none none reverse',
                // markers: true,
            },
        });
        scrollTriggers.push(anim.scrollTrigger);
    }

    // play video on scroll
    const $videos = document.querySelectorAll('.plyr--video video');
    if ($videos.length) {
        $videos.forEach(($video) => {
            $video.pause();
            const ST = ScrollTrigger.create({
                trigger: $video,
                start: 'center bottom',
                end: 'bottom top',
                onEnter: () => {
                    $video.plyr.play();
                },
                onLeaveBack: () => {
                    $video.plyr.pause();
                },
            });
            scrollTriggers.push(ST);
        });
    }

    // animate images on scroll
    const $images = [...document.querySelectorAll('.img-cell')];
    gsap.delayedCall(0.1, () => {
        if ($images) {
            $images.forEach(($img) => {
                let theImg = $img.querySelector('img');
                gsap.set(theImg, { scale: 1.1, opacity: 0.001 });

                let anim = gsap.to(theImg, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.6,
                    overwrite: true,
                    onComplete: () => {
                        // Utils.debounce(ScrollTrigger.refresh());
                    },
                    scrollTrigger: {
                        trigger: $img,
                        start: 'top 80%',
                        end: 'bottom top',
                        toggleActions: 'play reverse play reverse',
                        overwrite: true,
                        invalidateOnRefresh: true,
                    },
                });
                scrollTriggers.push(anim.scrollTrigger);
            });

            // $images.forEach(($img) => {
            //     let anim = gsap.to($img, {
            //         opacity: 1,
            //         scale: 1,
            //         duration: 0.6,
            //         onComplete: () => {
            //             ScrollTrigger.refresh();
            //         },
            //         scrollTrigger: {
            //             trigger: $img,
            //             start: 'top 80%',
            //             end: 'bottom top',
            //             toggleActions: 'play reverse play reverse',
            //         },
            //     });
            //     scrollTriggers.push(anim.scrollTrigger);
            // });
        }
        ScrollTrigger.refresh();
    });
};

const initSwipers = async () => {
    const module = await import(jsVendorPath + 'swiper-bundle.11.0.3.min.js');

    const randomScale = gsap.utils.random(7000, 9000, true);
    const defaultConfig = {
        // slidesPerView: 1,
        on: {
            init: function () {
                gsap.delayedCall(0.5, () => {
                    ScrollTrigger.refresh();
                });
            },
        },
        speed: 2000,
        loop: true,
        loopPreventsSliding: false,
        keyboard: true,
        effect: 'fade',
        fadeEffect: {
            crossFade: true,
        },
        // autoplay: false,
        autoplay: {
            // pauseOnMouseEnter: true,
            delay: 6000,
        },
        navigation: {
            nextSelector: '.swiper-button-next',
            nextEl: null,
            prevSelector: '.swiper-button-prev',
            prevEl: null,
            enabled: false,
        },
        pagination: {
            selector: '.swiper-pagination',
            el: null,
            clickable: false, // swiper js 11.0.3 bug, clicks not working properly
        },
        on: {
            transitionStart: function (swiper) {
                // if (!swiper.pagination?.el) return;
                // var $slide = swiper.slides[swiper.activeIndex];
                // if ($slide.querySelector('.swiper-ol')) {
                //     swiper.pagination.el.classList.add('dark');
                // } else {
                //     swiper.pagination.el.classList.remove('dark');
                // }
            },
            // transitionEnd: function () {
            //     gsap.delayedCall(0.5, function () {
            //         lazySizes.init();
            //     });
            // },
        },
    };

    const setSliderControls = function ($el, swiper) {
        $el.querySelectorAll('.swiper-slide').forEach(($slide, idx) => {
            $slide.addEventListener('click', function () {
                swiper.slideTo(idx);
            });
        });
    };

    const swipers = [];
    document.querySelectorAll('.swiper-container').forEach(($container) => {
        let swiper = null;
        let slides = $container.querySelectorAll('.swiper-slide');
        let numSlides = slides.length;
        let autoplayTimeout = randomScale();
        slides[0].setAttribute('data-swiper-autoplay', autoplayTimeout);
        if (numSlides > 1) {
            var config = { ...defaultConfig };
            if ($container.closest('.row-image-swiper')) {
                config.loop = true;
                config.slidesPerView = 'auto';
                config.slidesPerGroup = 1;
                config.spaceBetween = 17;
                config.breakpoints = {
                    768: {
                        slidesPerView: 'auto',
                        slidesPerGroup: 1,
                        spaceBetween: 38,
                        centeredSlides: true,
                    },
                    1280: {
                        slidesPerView: 'auto',
                        slidesPerGroup: 1,
                        spaceBetween: 60,
                        centeredSlides: true,
                    },
                };
                config.speed = 600;
                config.effect = 'slide';
                config.autoplay = {
                    pauseOnMouseEnter: true,
                    delay: 6000,
                };
            }
            if ($container.closest('.row-city-leads-swiper')) {
                config.loop = false;
                config.slidesPerView = 'auto';
                config.slidesPerGroup = 1;
                config.spaceBetween = 36;

                config.breakpoints = {
                    768: {
                        slidesPerView: 'auto',
                        slidesPerGroup: 1,
                        spaceBetween: 60,
                        // centeredSlides: true,
                    },
                    1280: {
                        slidesPerView: 'auto',
                        slidesPerGroup: 1,
                        spaceBetween: 148,
                        // centeredSlides: true,
                    },
                };
                config.autoplay = false;
                config.speed = 600;
                config.effect = 'slide';
            } else if (
                $container.closest('.row-quotes-swiper') ||
                $container.closest('.row-gallery-swiper')
            ) {
                config.slidesPerView = 2;
                config.slidesPerGroup = 2;
                config.spaceBetween = 15;
                config.breakpoints = {
                    768: {
                        slidesPerView: 3,
                        slidesPerGroup: 3,
                        spaceBetween: 30,
                        navigation: {
                            enabled: true,
                        },
                        // centeredSlides: true,
                    } /*,
                    1280: {
                        slidesPerView: 'auto',
                        slidesPerGroup: 1,
                        spaceBetween: 60,
                        centeredSlides: true,
                    },*/,
                };
                config.speed = 700;
                config.effect = 'slide';
                config.autoplay = {
                    pauseOnMouseEnter: true,
                    delay: autoplayTimeout,
                };
                config.pagination.renderBullet = function (index, className) {
                    const blob = new blobshape([], {
                        growth: 6,
                        edges: 5,
                    });
                    const element = document.createElement('div');
                    element.append(blob.svg);
                    return `<span class="${className}">${element.innerHTML}</span>`;
                };
            }

            config.navigation.nextEl = $container.parentElement.querySelector(
                defaultConfig.navigation.nextSelector
            );
            config.navigation.prevEl = $container.parentElement.querySelector(
                defaultConfig.navigation.prevSelector
            );
            config.pagination.el = $container.parentElement.querySelector(
                defaultConfig.pagination.selector
            );

            swiper = new module.Swiper($container, config);
        }
        swipers.push(swiper);
    });

    return swipers;
};

const setupPlyr = async () => {
    if (document.querySelector('.rex-plyr')) {
        try {
            await import('/assets/addons/plyr/vendor/plyr/dist/plyr.min.js');
            const players = Plyr.setup('.rex-plyr', {
                youtube: {
                    noCookie: true,
                },
                vimeo: {
                    dnt: true,
                },
                iconUrl: '/assets/addons/plyr/vendor/plyr/dist/plyr.svg',
                blankVideo: '/assets/addons/plyr/vendor/plyr/dist/blank.mp4',
            });

            if (!document.querySelector('.rex-plyr')) return;

            players.forEach(function (player) {
                player.on('play', function () {
                    var others = players.filter((other) => other != player);
                    others.forEach(function (other) {
                        other.pause();
                    });
                });
                $html.classList.add('has-player plyr-paused');
                player.on('play', function (event) {
                    //   const instance = event.detail.plyr;
                    $html.classList.remove('plyr-paused');
                });
                player.on('pause ended', function (event) {
                    $html.classList.add('plyr-paused');
                });
                player.on('ended', function (event) {
                    event.detail.plyr.currentTime = 0;
                    event.detail.plyr.stop();
                    setTimeout(function () {
                        $html.classList.add('plyr-paused');
                    }, 50);
                });
            });
        } catch (error) {
            logger.error(error);
        }
    }
};

const lightboxes = async () => {
    logger.log('lightboxes');
    const glb = await import(jsVendorPath + 'glightbox.js');

    glb.glightbox({
        moreText: MASSIF.sprog.weiterlesen,
        preload: false,
    });
};

const swup = async () => {
    logger.log('swup');

    if (isIE) return;

    const elementIsVisibleInViewport = (el, partiallyVisible = true) => {
        const { top, left, bottom, right } = el.getBoundingClientRect();
        const { innerHeight, innerWidth } = window;
        const viewPortTop = 0;
        const viewPortBottom = innerHeight;
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
                  ((left > 0 && left < innerWidth) ||
                      (right > 0 && right < innerWidth))
            : top >= 0 &&
                  left >= 0 &&
                  bottom <= viewPortBottom &&
                  right <= innerWidth;
    };

    const $transitionHelper = document.createElement('div');
    $transitionHelper.classList.add('transition-duration-helper');
    $body.append($transitionHelper);

    const $transitionFx = document.createElement('div');
    $transitionFx.classList.add('transition-fx');
    $body.append($transitionFx);

    let scrollPlugin;
    var animations = [
        {
            from: '(.*)',
            to: '(.*)',
            out: async (done) => {
                const container = document.querySelector('#content');
                container.style.opacity = 1;

                if (keyvisualTimeline) keyvisualTimeline.pause();
                // const keyVisual = document.querySelector(
                //     '#key-visual svg animate'
                // );
                // if (keyVisual) {
                //     keyVisual.setAttribute('dur', 0);
                //     keyVisual.setAttribute('dur', 0);
                //     await gsap.to(keyVisual, {
                //         opacity: 0,
                //         duration: 1,
                //     });
                // }

                const sections = await Array.from(
                    container.querySelectorAll('section')
                )
                    .filter((el) => elementIsVisibleInViewport(el, true))
                    .reverse();

                await gsap.to(sections, {
                    y: -20,
                    opacity: 0,
                    stagger: 0.3,
                    duration: 0.6,
                    ease: 'linear',
                });
                gsap.to(container, {
                    opacity: 0,
                    duration: 0.5,
                    onComplete: done,
                });
            },
            in: async (done) => {
                // const keyVisual = document.querySelector(
                //     '#key-visual svg animate'
                // );
                // let dur = 0;
                // if (keyVisual) {
                //     dur = keyVisual.getAttribute('dur');
                //     keyVisual.setAttribute('dur', 0);
                // }

                const container = document.querySelector('#content');
                const sections = await Array.from(
                    container.querySelectorAll('section')
                ).filter((el) => elementIsVisibleInViewport(el, true));

                await gsap.from(sections, {
                    y: -20,
                    opacity: 0,
                    stagger: 0.3,
                    duration: 0.6,
                    ease: 'power2.out',
                    clearProps: true,
                });

                // if (keyVisual) {
                //     keyVisual.setAttribute('dur', dur);
                // }

                // gsap.from(container, {
                //     opacity: 1,
                //     duration: 0.5,
                //     onComplete: done,
                // });
                done();
                // done();
            },
        },
    ];

    window.swup = new Swup({
        linkSelector: 'a[href]',
        ignoreVisit: (url, { el } = {}) =>
            el?.closest('[data-no-swup]') ||
            el?.closest('[data-modal]') ||
            el?.closest('.glightbox'),
        skipPopStateHandling: function (event) {
            Utils.setBodyScrollLock('on', document.querySelector('dialog'));
            if (
                event?.state &&
                event?.state.source == 'swup' &&
                event?.state.url.indexOf('shop') === -1
            ) {
                return false;
            } else if (
                event?.state &&
                event?.state?.url.indexOf('shop') !== -1
            ) {
                location.reload();
            }
            return true;
        },
        containers: ['#content'],
        plugins: [
            new SwupPreloadPlugin(),
            new SwupBodyClassPlugin(),
            new SwupHeadPlugin({
                persistAssets: true,
            }),
            // new SwupScrollPlugin({
            //     shouldResetScrollPosition: (link) => !link.matches('.back-btn'),
            //     animateScroll: {
            //         betweenPages: false,
            //         samePageWithHash: false,
            //         samePage: false,
            //     },
            // }),
            // new SwupParallelPlugin(),
            new SwupJsPlugin(animations),
            new SwupA11yPlugin(),
            new SwupMorphPlugin({
                containers: ['#menus', '#footer'],
            }),
            new SwupRouteNamePlugin(),
            new SwupProgressPlugin(),
        ],
    });
    scrollPlugin = window.swup.findPlugin('ScrollPlugin');

    //window.swup.cache.empty();

    // make to-top button smooth scroll, even though smooth scroll is deactivated for swup
    /*
     * swup events
     */
    /*
    if (scrollPlugin) {
        var scrollValues = {};
        var scrollToSavedPosition = null;
        window.swup.on('clickLink', function (event) {
            scrollValues[window.location.pathname] = window.pageYOffset;
        });
        window.swup.on('popState', function (event) {
            scrollToSavedPosition = true;
            scrollPlugin.options.animateScroll = true;
        });
        window.swup.on('animationInStart', function (event) {
            if (scrollToSavedPosition) {
                window.swup.scrollTo(
                    scrollValues[window.location.pathname] - 9
                );
                //window.scrollTo(0, scrollValues[window.location.href]);
            }

            scrollToSavedPosition = false;
        });
    }
    */

    window.swup.hooks.on('content:replace', (event) => {
        // reapply JS
        swupRefresh();
    });
};

const headroom = async () => {
    logger.log('headroom');
    const hr = await import(jsVendorPath + 'headroom.min.js');
    var headroom = new hr.Headroom($html, {
        offset: 60,
        tolerance: {
            up: 10,
            down: 0,
        },
    });
    headroom.init();
};

const initImages = async () => {
    logger.log('images');

    if (isIE) {
        document.querySelectorAll('.img-cell img').forEach(($img) => {
            const $container = $img.parentElement;
            bgPos =
                $img.dataset?.bgPost && $img.dataset?.bgPost != '%'
                    ? $img.dataset.bgPost
                    : '';
            let styleStr = $container.getAttribute('style');
            $container.setAttribute(
                'style',
                `background-position: ${bgPos};${styleStr}`
            );
        });
    }

    //window.lazySizesConfig.preloadAfterLoad = true;
    //window.lazySizesConfig.loadMode = 0;
    //lazySizesConfig.hFac = 1;
    // window.lazySizesConfig.nativeLoading = {
    //     setLoadingAttribute: false,
    // };

    // return lazySizes.init();

    /*
    document.addEventListener('lazyloaded', (e) => {
        if (e.type === 'lazyloaded') {
            e.target.parentElement.classList.add('loaded');
            // gsap.fromTo(
            //     e.target,
            //     { opacity: 0, x: -10 },
            //     { opacity: 1, x: 0, duration: 0.5, clearProps: true }
            // );
        }
    });
    */
};

const lotties = () => {
    document.querySelectorAll('.lottie').forEach((element) => {
        element.loadAnimation({
            container: this, // the dom element that will contain the animation
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: element.dataset.json, // the path to the animation json
        });
    });
};

init();
