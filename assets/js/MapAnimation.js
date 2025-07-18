import { gsap, ScrollTrigger } from '@/js/gsap.js'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { createSpring } from '@/js/CreateSpring'
import swup from '@/js/swup.js'

gsap.registerPlugin(DrawSVGPlugin, ScrollTrigger)

const spring = createSpring()

let scrollTrigger = null

const MapAnimation = () => {
  const map = document.querySelector('[data-name="map-contact"]')
  if (!map) return
  const streets = map.querySelectorAll('[data-name="streets"] path')
  const arrows = map
    .querySelector('[data-name="arrows"]')
    .querySelectorAll(':scope > *')
  const labels = map
    .querySelector('[data-name="labels"]')
    .querySelectorAll(':scope > *')
  const railwayMask = map.querySelectorAll('#railway-mask path')
  const labelsRailway = map.querySelector('[data-name="labels-railway"]')

  const circleLarge = map.querySelector('[data-name="circle-large"]')
  const circleLocation = map.querySelector('[data-name="circle-location"]')
  const circleLocationPulse = map.querySelector(
    '[data-name="circle-location-pulse"]'
  )
  const logo = map.querySelector('[data-name="logo"]')
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.inOut' } })
  const tlLocation = gsap.timeline({
    // repeat: -1,
    // repeatDelay: 1,
    defaults: { ease: spring },
    transformOrigin: '50% 50%'
  })

  // gsap.set(logo, { scale: 0.75, transformOrigin: '50% 50%' });

  tl.addLabel('start')
    .to(map, { opacity: 1, duration: 1 })
    .from(streets, { drawSVG: 0, duration: 1, stagger: 0.1 }, 'start')
    .from(labels, { opacity: 0, duration: 0.3, stagger: 0.15 }, 'start')
    .from(arrows, { opacity: 0, y: 10, duration: 0.5, stagger: 0.3 }, '-=0.3')
    .from(circleLarge, {
      duration: 0.6,
      autoAlpha: 0,
      scale: 0.1,
      transformOrigin: '50% 50%'
    })
    .from(logo, {
      duration: 0.3,
      autoAlpha: 0
    })

    .from(railwayMask, { drawSVG: 0, duration: 2 })
    .from(labelsRailway, { opacity: 0, y: -5, x: -10, duration: 0.5 }, '-=1.25')
    .from(circleLocation, {
      autoAlpha: 0,
      scale: 0.1,
      duration: 0.3,
      transformOrigin: '50% 50%',
      onComplete: () => {
        tlLocation.fromTo(
          circleLocationPulse,
          { scale: 1, autoAlpha: 1 },
          {
            scale: 1.75,
            autoAlpha: 0,
            duration: 1,
            transformOrigin: '50% 50%',
            ease: 'power2.In'
          }
        )
      }
    })

  scrollTrigger = ScrollTrigger.create({
    trigger: map,
    start: '75% bottom',
    once: true,
    // start: 'top -40',
    // end: 'bottom bottom',
    onEnter: () => tl.play()
  })

  map.addEventListener('mouseenter', () => {
    tlLocation.repeat(-1)
    tlLocation.restart()
  })
  map.addEventListener('mouseleave', () => {
    tlLocation.repeat(1)
  })
}

swup.hooks.on(
  'content:replace',
  () => {
    if (scrollTrigger) {
      scrollTrigger.kill()
    }
  },
  { before: true }
)

export default MapAnimation
