const logger = true;
const outputApiResponses = false;
const jsPath = '/theme/public/assets/js/';
const jsVendorPath = jsPath + 'vendor/';

const showLoadingSpinner = async (loadingSpinner) => {
    await gsap.to(loadingSpinner, {
        autoAlpha: 1,
    });
};

const hideLoadingSpinner = async (loadingSpinner) => {
    await gsap.to(loadingSpinner, {
        autoAlpha: 0,
    });
};

const throttle = (callback, delay = 1000) => {
    let shouldWait = false;
    return (...args) => {
        if (shouldWait) return;
        callback(...args);
        shouldWait = true;
        setTimeout(() => {
            shouldWait = false;
        }, delay);
    };
};

const debounce = (func, timeout = 300) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), timeout);
    };
};

// blends two colors
function blendColors(c0, c1, p) {
    var f = parseInt(c0.slice(1), 16),
        t = parseInt(c1.slice(1), 16),
        R1 = f >> 16,
        G1 = (f >> 8) & 0x00ff,
        B1 = f & 0x0000ff,
        R2 = t >> 16,
        G2 = (t >> 8) & 0x00ff,
        B2 = t & 0x0000ff;
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
    );
}

// Avoid `console` errors in browsers that lack a console.
(function () {
    var method;
    var noop = function () {};
    var methods = [
        'assert',
        'clear',
        'count',
        'debug',
        'dir',
        'dirxml',
        'error',
        'exception',
        'group',
        'groupCollapsed',
        'groupEnd',
        'info',
        'log',
        'markTimeline',
        'profile',
        'profileEnd',
        'table',
        'time',
        'timeEnd',
        'timeline',
        'timelineEnd',
        'timeStamp',
        'trace',
        'warn',
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
})();

/*
 * set & get Cookies
 */

function setCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        var expires = '; expires=' + date.toGMTString();
    } else var expires = '';
    document.cookie = name + '=' + value + expires + '; path=/';
}

function getCookie(name) {
    var name_eq = name + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(name_eq) == 0)
            return c.substring(name_eq.length, c.length);
    }
    return null;
}

// check if element is in viewport

const inview = (el) => {
    var element = el.get(0),
        bounds = element.getBoundingClientRect(),
        viewport = {};

    viewport.bottom =
        window.innerHeight || document.documentElement.clientHeight;
    viewport.right = window.innerWidth || document.documentElement.clientWidth;
    viewport.top = 0;
    viewport.left = 0;

    return (
        bounds.right >= viewport.left &&
        bounds.bottom >= viewport.top &&
        bounds.left <= viewport.right &&
        bounds.top <= viewport.bottom
    );
};

// check whether UA has touch support
function is_touch_device() {
    var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
    var mq = function (query) {
        return window.matchMedia(query).matches;
    };

    if (
        'ontouchstart' in window ||
        (window.DocumentTouch && document instanceof DocumentTouch)
    ) {
        return true;
    }

    // include the 'heartz' as a way to have a non matching MQ to help terminate the join
    // https://git.io/vznFH
    var query = ['(', prefixes.join('touch-enabled),('), 'massif', ')'].join(
        ''
    );
    return mq(query);
}

// debounced resize handler
function resizeHandler() {
    var updating = false,
        execute = function () {
            MASSIF.main.setVh();
        },
        update = function () {
            execute();
            updating = false;
        },
        handler = function () {
            if (!updating) {
                updating = true;
                update();
            }
        };

    $(window)
        .off('resize.resizehandler')
        .on('resize.resizehandler', function () {
            requestAnimationFrame(handler);
        })
        .trigger('resize.resizehandler');
}

// debounced scroll handler
function scrollHandler() {
    var options = {
        rootMargin: '100px',
        threshold: 0.15,
    };

    var callback = function (els, observer) {
        $.each(els, function () {
            var target = this.target;
            var customScrollEvent = target.dataset.scrollEvent;
            if (customScrollEvent) {
                switch (customScrollEvent) {
                    case 'mister-burns':
                        var $el = $(target).find('.img-cell');
                        if (
                            this.isIntersecting &&
                            this.intersectionRatio >= 0.5
                        ) {
                            MASSIF.misterBurns('play', $el);
                        } else {
                            MASSIF.misterBurns('stop', $el);
                        }
                        break;
                }
            } else {
                gsap.set(target, { opacity: 0, y: '2rem' });
                if (this.isIntersecting && this.intersectionRatio >= 0.5) {
                    var to = setTimeout(function () {
                        gsap.fromTo(
                            target,
                            { opacity: 0, y: '2rem' },
                            { opacity: 1, y: '0rem', duration: 0.3 }
                        );
                    }, 250);
                    $(this.target).data('to', to);
                } else {
                    clearTimeout($(target).data('to'));
                    gsap.to(target, { opacity: 0, y: '2rem', duration: 0.3 });
                }
            }
        });
    };
    if (observer) {
        observer.disconnect();
    }

    observer = new IntersectionObserver(callback, options);

    //var $els = $body.find('.content h1, .content .h1,.content h2, .content .h2:not(.icon-wrap),.content .num-block-num');
    var $els = $body.find('.check-inview');
    //gsap.set($els, { opacity: 0, y: "2rem" });
    $els.each(function () {
        observer.observe(this);
    });
}

// checks if UA is IE11
function browserIsIE() {
    return /*@cc_on!@*/ false || !!document.documentMode;
}

// saves scroll position on reload
function retainScrollPosition() {
    var localStorageSupport = supportsLocalStorage();

    if (!localStorageSupport || browserIsIE()) return;

    var date = localStorage.getItem('scroll-pos-date');
    localStorage.setItem('scroll-pos-date', new Date());

    window.addEventListener('beforeunload', function () {
        localStorage.setItem('scroll-pos', window.pageYOffset);
    });

    if (!date) return;

    var diff = Math.abs(new Date() - new Date(date));
    var timePassed = diff / 1000 / 60;

    if (timePassed >= 5) return;
    var top = localStorage.getItem('scroll-pos');
    if (top !== null) {
        window.scroll(0, parseInt(top, 10));
    }
}

// checks for local storage support
function supportsLocalStorage() {
    try {
        localStorage.setItem('_', '_');
        localStorage.removeItem('_');
        return true;
    } catch (e) {
        return false;
    }
}

// gets scrollbar width
function getScrollBarWidth() {
    var inner = document.createElement('p');
    inner.style.width = '100%';
    inner.style.height = '200px';

    var outer = document.createElement('div');
    outer.style.position = 'absolute';
    outer.style.top = '0px';
    outer.style.left = '0px';
    outer.style.visibility = 'hidden';
    outer.style.width = '200px';
    outer.style.height = '150px';
    outer.style.overflow = 'hidden';
    outer.appendChild(inner);

    document.body.appendChild(outer);
    var w1 = inner.offsetWidth;
    outer.style.overflow = 'scroll';
    var w2 = inner.offsetWidth;
    if (w1 == w2) w2 = outer.clientWidth;

    document.body.removeChild(outer);

    return w1 - w2;
}

// scroll to element using swup.scrollTo
function scrollElementIntoView($el, block = 'start') {
    if (!$el) return;
    // if (typeof $el.scrollIntoView === 'function') {
    //     $el.scrollIntoView();
    //     return;
    // }
    document.documentElement.classList.add('disable-smooth-scroll');
    let style = window.getComputedStyle(document.documentElement);
    let scrollPadding = parseFloat(
        style.getPropertyValue('scroll-padding-top'),
        10
    );
    gsap.to(window, {
        scrollTo: {
            y: $el,
            offsetY: scrollPadding,
            autoKill: false,
            autoKillThreshold: 1,
        },
        duration: 0.3,
        onComplete: () => {
            document.documentElement.classList.remove('disable-smooth-scroll');
        },
    });
}

// gets a positive or negative sign randomly
function randomSign() {
    return Math.random() < 0.5 ? 1 : -1;
}

// logs messages if debug = true or if the global var debugging = true
class Logger {
    constructor(options) {
        var opts = options || {};
        this.options = {};
        this.options.debug =
            typeof opts['debug'] !== 'undefined' ? opts['debug'] : true;
        // if (logger !== true) {
        //     this.options.debug = false;
        // }
    }
    setOption = function (option, value) {
        if (option && value !== '') {
            this.options[option] = value;
        }
        return true;
    };

    log = function (...args) {
        this.output('log', ...args);
    };

    warn = function (...args) {
        this.output('warn', ...args);
    };

    error = function (...args) {
        this.output('error', ...args);
    };

    time = function (...args) {
        this.output('time', ...args);
    };

    timeEnd = function (...args) {
        this.output('timeEnd', ...args);
    };

    clear = function () {
        this.output('clear', ...args);
    };

    output = function (type = 'log', ...args) {
        const globalDebugMode = window.hasOwnProperty('debugMode')
            ? window.debugMode
            : true;
        if (
            globalDebugMode === true &&
            this.options.debug &&
            typeof console[type] === 'function'
        ) {
            console[type](...args);
        }
    };
}

// merges two arrays and removes duplicates
function mergeUnique(arr1, arr2) {
    return arr1.concat(
        arr2.filter(function (item) {
            return arr1.indexOf(item) === -1;
        })
    );
}

function outputApiResponse(response) {
    if (!outputApiResponses || !response || !response.responseJSON) return;
    try {
        if (response.responseJSON.error === false) {
            return;
        }
        if (response.responseText) {
            response.responseText = JSON.parse(response.responseText);
        }
        $('#api-response').remove();
        $('body').append(
            '<div id="api-response" class="text-smaller"><a href="javascript:;" class="api-response-close"><i class="icon icon-close_m"></i></a><div class="api-response-wrap"></div></div>'
        );
        $('#api-response')
            .find('.api-response-wrap')
            .text(JSON.stringify(response, null, 2));
        $('#api-response')
            .find('.api-response-close')
            .on('click', function () {
                $('#api-response').remove();
            });
    } catch (error) {
        console.warn(error);
    }
}

// an async XHR call
const apiCall = async (endpoint, data = {}, options = {}) => {
    const logger = new Logger({ debug: false });
    logger.log('api Call ' + endpoint);
    endpoint = endpoint || null;
    const defaults = {
        method: 'POST',
        mode: 'same-origin',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    };
    options = { ...defaults, ...options };

    const response = await fetch(
        '/index.php?rex-api-call=' + endpoint,
        options
    );
    return await response.json();
};

// counts and limits number charactes in input field
function countChars() {
    const logger = new Logger({ debug: false });

    logger.log('forms count chars');

    var countChars = function ($obj, maxChars = 150) {
        var maxLength = $obj.attr('maxlength')
            ? $obj.attr('maxlength')
            : maxChars;
        var strLength = $obj.val().length;
        var $charCount = $obj.siblings('.show-chars');

        if (strLength > maxLength) {
            $charCount.html(
                '<span style="color: red">' +
                    strLength +
                    '</span> / ' +
                    maxLength +
                    ' Zeichen'
            );
        } else {
            $charCount.html(strLength + ' / ' + maxLength + ' Zeichen');
        }
    };

    var fields = ':input[data-count-chars]';

    $('body').on('keyup.countChars', fields, function (e) {
        countChars($(this));
    });
}

// returns an error message for input fields
function inputErrorMessage(msg) {
    const element = document.createElement('div');
    element.classList.add('alert-danger', 'text-smaller');
    element.innerHTML = msg;
    return element;
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
        });
        let $firstError = form.querySelector('.has-error');
        if ($firstError) {
            scrollElementIntoView($firstError, 'center');
        }
    }
}

// returns a success message
function successMessage(msg) {
    return '<div class="alert-success">' + msg + '</div>';
}

// appends/prepends a success message to an element
function showSuccessMessage(msg, id, keyword) {
    keyword = keyword || 'before';
    $el = $('#' + id);
    $el[keyword](successMessage(msg));
}

// remove all alerts
function removeAlerts(element) {
    element.classList.remove('has-error');
    element
        .querySelectorAll('.has-error')
        .forEach((el) => el.classList.remove('has-error'));
    element.querySelectorAll('.alert-danger').forEach((el) => el.remove());
    element.parentElement
        .querySelectorAll('.alert-success')
        .forEach((el) => el.remove());
}

// set readonly state on or off
function setFormReadonly(form, state) {
    if (!form) return;
    var elements = form.elements;
    for (var i = 0, len = elements.length; i < len; ++i) {
        elements[i].readOnly = state;
    }
    if (state) {
        form.classList.add('submitting');
        form.querySelectorAll('button[type=submit]').forEach((el) =>
            el.setAttribute('disabled', 'disabled')
        );
    } else {
        form.classList.remove('submitting');
        form.querySelectorAll('button[type=submit]').forEach((el) =>
            el.setAttribute('disabled', false)
        );
    }
}

function trimText(str, maxlength = 20) {
    if (!str) return '';
    var regex = /[!-\/:-@\[-`{-~]$/;
    if (str.length > maxlength) {
        str = $.trim(str)
            .substring(0, maxlength)
            .split(' ')
            .slice(0, -1)
            .join(' ');
        // remove special chars from text end
        str = str.replace(regex, '');
        return str + '&hellip;';
    }
    return '';
}

function getTemplate(id) {
    const logger = new Logger({ debug: false });
    var template = document.getElementById('template-' + id);
    if (template) {
        return template.content.cloneNode(true);
    }
    logger.log('posts: template not found');
    return false;
}

function limitNumberWithinRange(num, min, max) {
    const MIN = min || 1;
    const MAX = max || 20;
    const parsed = parseInt(num);
    return Math.min(Math.max(parsed, MIN), MAX);
}

const setBodyScrollLock = async (action, element) => {
    const bodyScrollLock = await import(jsVendorPath + 'bodyScrollLock.js');
    switch (action) {
        case 'on':
            bodyScrollLock.enableBodyScroll(element);
            break;
        case 'off':
            bodyScrollLock.disableBodyScroll(element);
            break;
        case 'clear':
            bodyScrollLock.clearAllBodyScrollLocks();
            break;
    }
};

const setVh = (suffix = '') => {
    var vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh' + suffix, vh + 'px');
};

const wrapInner = (parent, wrapper, attribute, attributevalue) => {
    if (typeof wrapper === 'string') {
        wrapper = document.createElement(wrapper);
    }
    var div = parent
        .appendChild(wrapper)
        .setAttribute(attribute, attributevalue);

    while (parent.firstChild !== wrapper) {
        wrapper.appendChild(parent.firstChild);
    }
};

function horizontalLoop(items, config) {
    items = gsap.utils.toArray(items);
    config = config || {};
    let tl = gsap.timeline({
            repeat: config.repeat,
            paused: config.paused,
            defaults: { ease: 'none' },
            onReverseComplete: () =>
                tl.totalTime(tl.rawTime() + tl.duration() * 100),
        }),
        length = items.length,
        startX = items[0].offsetLeft,
        times = [],
        widths = [],
        xPercents = [],
        curIndex = 0,
        pixelsPerSecond = (config.speed || 1) * 100,
        snap =
            config.snap === false
                ? (v) => v
                : gsap.utils.snap(config.snap || 1), // some browsers shift by a pixel to accommodate flex layouts, so for example if width is 20% the first element's width might be 242px, and the next 243px, alternating back and forth. So we snap to 5 percentage points to make things look more natural
        totalWidth,
        curX,
        distanceToStart,
        distanceToLoop,
        item,
        i;
    gsap.set(items, {
        // convert "x" to "xPercent" to make things responsive, and populate the widths/xPercents Arrays to make lookups faster.
        xPercent: (i, el) => {
            let w = (widths[i] = parseFloat(
                gsap.getProperty(el, 'width', 'px')
            ));
            xPercents[i] = snap(
                (parseFloat(gsap.getProperty(el, 'x', 'px')) / w) * 100 +
                    gsap.getProperty(el, 'xPercent')
            );
            return xPercents[i];
        },
    });
    gsap.set(items, { x: 0 });
    totalWidth =
        items[length - 1].offsetLeft +
        (xPercents[length - 1] / 100) * widths[length - 1] -
        startX +
        items[length - 1].offsetWidth *
            gsap.getProperty(items[length - 1], 'scaleX') +
        (parseFloat(config.paddingRight) || 0);
    for (i = 0; i < length; i++) {
        item = items[i];
        curX = (xPercents[i] / 100) * widths[i];
        distanceToStart = item.offsetLeft + curX - startX;
        distanceToLoop =
            distanceToStart + widths[i] * gsap.getProperty(item, 'scaleX');
        tl.to(
            item,
            {
                xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
                duration: distanceToLoop / pixelsPerSecond,
            },
            0
        )
            .fromTo(
                item,
                {
                    xPercent: snap(
                        ((curX - distanceToLoop + totalWidth) / widths[i]) * 100
                    ),
                },
                {
                    xPercent: xPercents[i],
                    duration:
                        (curX - distanceToLoop + totalWidth - curX) /
                        pixelsPerSecond,
                    immediateRender: false,
                },
                distanceToLoop / pixelsPerSecond
            )
            .add('label' + i, distanceToStart / pixelsPerSecond);
        times[i] = distanceToStart / pixelsPerSecond;
    }
    function toIndex(index, vars) {
        vars = vars || {};
        Math.abs(index - curIndex) > length / 2 &&
            (index += index > curIndex ? -length : length); // always go in the shortest direction
        let newIndex = gsap.utils.wrap(0, length, index),
            time = times[newIndex];
        if (time > tl.time() !== index > curIndex) {
            // if we're wrapping the timeline's playhead, make the proper adjustments
            vars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) };
            time += tl.duration() * (index > curIndex ? 1 : -1);
        }
        curIndex = newIndex;
        vars.overwrite = true;
        return tl.tweenTo(time, vars);
    }
    tl.next = (vars) => toIndex(curIndex + 1, vars);
    tl.previous = (vars) => toIndex(curIndex - 1, vars);
    tl.current = () => curIndex;
    tl.toIndex = (index, vars) => toIndex(index, vars);
    tl.times = times;
    tl.progress(1, true).progress(0, true); // pre-render for performance
    if (config.reversed) {
        tl.vars.onReverseComplete();
        tl.reverse();
    }
    return tl;
}

function decryptEmailaddresses() {
    // Ersetze E-Mailadressen
    document.querySelectorAll('span.unicorn').forEach(function (element) {
        element.insertAdjacentText('afterend', '@');
        element.remove();
    });

    // Ersetze mailto-Links
    document
        .querySelectorAll('a[href^="javascript:decryptUnicorn"]')
        .forEach(function (element) {
            // Selektiere Einhorn-Werte
            var emails = element.getAttribute('href').match(/\((.*)\)/)[1];

            emails = emails
                // ROT13-Transformation
                .replace(/[a-z]/gi, function (s) {
                    return String.fromCharCode(
                        s.charCodeAt(0) + (s.toLowerCase() < 'n' ? 13 : -13)
                    );
                })
                // Ersetze # durch @
                .replace(/\|/g, '@');

            // Ersetze Einhörner
            element.setAttribute('href', 'mailto:' + emails);
        });
}

export {
    Logger,
    is_touch_device,
    browserIsIE,
    retainScrollPosition,
    getScrollBarWidth,
    setBodyScrollLock,
    setVh,
    resizeHandler,
    scrollElementIntoView,
    wrapInner,
    setFormReadonly,
    removeAlerts,
    inputErrorMessage,
    showFormInputErrors,
    apiCall,
    throttle,
    debounce,
    showLoadingSpinner,
    hideLoadingSpinner,
    horizontalLoop,
    decryptEmailaddresses,
};
