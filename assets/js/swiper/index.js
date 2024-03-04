/*!
 * massif swiper
 * @author: Yves Torres, studio@massif.ch
 */
import Swiper from 'swiper'
import {
  Navigation,
  Pagination,
  EffectFade,
  Autoplay,
  Keyboard
} from 'swiper/modules'

import { gsap } from '@/js/gsap.js'
// import Swiper styles
import './style.css'

const swipers = []
const randomScale = gsap.utils.random(7000, 9000, true)

let videoUnsubscribe = null

const handleVideo = (swiper, event) => {
  swiper.autoplay.stop()

  const numSlides = swiper.slides.length
  const index = swiper.activeIndex
  const activeSlide = swiper.slides[index]
  const player = activeSlide.querySelector('media-player')
  if (player) {
    if (videoUnsubscribe) videoUnsubscribe()
    if (event === 'change') {
      player.play()
    }
    videoUnsubscribe = player.subscribe(({ ended }) => {
      if (ended) {
        if (numSlides > 1) {
          swiper.slideNext()
          swiper.autoplay.start()
        } else {
          try {
            player.play()
          } catch (error) {
            console.error(error)
          }
        }
        videoUnsubscribe()
      }
    })
    if (swiper?.previousIndex) {
      const prevPlayer =
        swiper.slides[swiper.previousIndex].querySelector('media-player')
      if (prevPlayer) {
        prevPlayer.pause()
      }
    }
    return
  } else swiper.autoplay.start()
}

const defaultConfig = {
  // slidesPerView: 1,
  modules: [Autoplay, Navigation, Pagination, EffectFade, Keyboard],
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
    enabled: true
  },
  pagination: {
    selector: '.swiper-pagination',
    el: null,
    clickable: true // swiper js 11.0.3 bug, clicks not working properly
  },
  on: {
    init: (swiper) => {
      gsap.delayedCall(1.5, () => {
        swiper.el.parentElement.classList.add('loaded')
      })

      handleVideo(swiper, 'init')
    }
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
      swiper.on('transitionEnd', (swiper) => handleVideo(swiper, 'change'))
    }
    swipers.push(swiper)
  })
}

const getSwipers = () => {
  return swipers
}
export { init, getSwipers }
