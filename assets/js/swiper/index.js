/*!
 * massif swiper
 * @author: Yves Torres, studio@massif.ch
 */
import Swiper from 'swiper'
import { Navigation, Pagination, EffectFade, Autoplay } from 'swiper/modules'

import { gsap } from '@/js/gsap.js'
// import Swiper styles
import './style.css'

const swipers = []
const randomScale = gsap.utils.random(7000, 9000, true)
const defaultConfig = {
  // slidesPerView: 1,
  modules: [Autoplay, Navigation, Pagination, EffectFade],
  on: {
    init: function () {
      gsap.delayedCall(0.5, () => {
        ScrollTrigger.refresh()
      })
    }
  },
  speed: 2000,
  loop: true,
  loopPreventsSliding: false,
  keyboard: true,
  effect: 'fade',
  fadeEffect: {
    crossFade: true
  },
  // autoplay: false,
  autoplay: {
    // pauseOnMouseEnter: true,
    delay: 6000
  },
  navigation: {
    nextSelector: '.swiper-button-next',
    nextEl: null,
    prevSelector: '.swiper-button-prev',
    prevEl: null,
    enabled: false
  },
  pagination: {
    selector: '.swiper-pagination',
    el: null,
    clickable: true // swiper js 11.0.3 bug, clicks not working properly
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
    }
    // transitionEnd: function () {
    //     gsap.delayedCall(0.5, function () {
    //         lazySizes.init();
    //     });
    // },
  }
}

const setSliderControls = function ($el, swiper) {
  $el.querySelectorAll('.swiper-slide').forEach(($slide, idx) => {
    $slide.addEventListener('click', function () {
      swiper.slideTo(idx)
    })
  })
}

const init = () => {
  document.querySelectorAll('.swiper-container').forEach(($container) => {
    let swiper = null
    let slides = $container.querySelectorAll('.swiper-slide')
    let numSlides = slides.length
    let autoplayTimeout = randomScale()
    slides[0].setAttribute('data-swiper-autoplay', autoplayTimeout)
    if (numSlides > 1) {
      var config = { ...defaultConfig }
      if ($container.closest('.row-image-swiper')) {
        config.loop = true
        config.slidesPerView = 'auto'
        config.slidesPerGroup = 1
        config.spaceBetween = 17
        config.breakpoints = {
          768: {
            slidesPerView: 'auto',
            slidesPerGroup: 1,
            spaceBetween: 38,
            centeredSlides: true
          },
          1280: {
            slidesPerView: 'auto',
            slidesPerGroup: 1,
            spaceBetween: 60,
            centeredSlides: true
          }
        }
        config.speed = 600
        config.effect = 'slide'
        config.autoplay = {
          pauseOnMouseEnter: true,
          delay: 6000
        }
      }
      if ($container.closest('.row-city-leads-swiper')) {
        config.loop = false
        config.slidesPerView = 'auto'
        config.slidesPerGroup = 1
        config.spaceBetween = 36

        config.breakpoints = {
          768: {
            slidesPerView: 'auto',
            slidesPerGroup: 1,
            spaceBetween: 60
            // centeredSlides: true,
          },
          1280: {
            slidesPerView: 'auto',
            slidesPerGroup: 1,
            spaceBetween: 148
            // centeredSlides: true,
          }
        }
        config.autoplay = false
        config.speed = 600
        config.effect = 'slide'
      } else if (
        $container.closest('.row-quotes-swiper') ||
        $container.closest('.row-gallery-swiper')
      ) {
        config.slidesPerView = 2
        config.slidesPerGroup = 2
        config.spaceBetween = 15
        config.breakpoints = {
          768: {
            slidesPerView: 3,
            slidesPerGroup: 3,
            spaceBetween: 30,
            navigation: {
              enabled: true
            }
            // centeredSlides: true,
          } /*,
                    1280: {
                        slidesPerView: 'auto',
                        slidesPerGroup: 1,
                        spaceBetween: 60,
                        centeredSlides: true,
                    },*/
        }
        config.speed = 700
        config.effect = 'slide'
        config.autoplay = {
          pauseOnMouseEnter: true,
          delay: autoplayTimeout
        }
        config.pagination.renderBullet = function (index, className) {
          const blob = new blobshape([], {
            growth: 6,
            edges: 5
          })
          const element = document.createElement('div')
          element.append(blob.svg)
          return `<span class="${className}">${element.innerHTML}</span>`
        }
      }

      config.navigation.nextEl = $container.parentElement.querySelector(
        defaultConfig.navigation.nextSelector
      )
      config.navigation.prevEl = $container.parentElement.querySelector(
        defaultConfig.navigation.prevSelector
      )
      config.pagination.el = $container.parentElement.querySelector(
        defaultConfig.pagination.selector
      )

      swiper = new Swiper($container, config)
    }
    swipers.push(swiper)
  })
}

const getSwipers = () => {
  return swipers
}
export { init, getSwipers }
