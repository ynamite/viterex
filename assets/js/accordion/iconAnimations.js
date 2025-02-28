import { gsap } from '@/js/gsap.js'
import { createSpring } from '@/js/CreateSpring'

const spring = createSpring({
  stiffness: 80,
  damping: 20
})

const animateIn = async ($icon) => {
  if ($icon) {
    await gsap.to($icon, {
      yPercent: 50,
      opacity: 0,
      duration: 0.2,
      ease: spring
    })
    gsap.set($icon, { clearProps: true })
    gsap.set($icon, { scaleY: -1 })
    gsap.from($icon, { yPercent: 50, opacity: 0, duration: 0.2, ease: spring })
  }
}

const animateOut = async ($icon) => {
  if ($icon) {
    await gsap.to($icon, {
      yPercent: -50,
      opacity: 0,
      duration: 0.2,
      ease: spring
    })
    gsap.set($icon, { clearProps: true })
    gsap.set($icon, { scaleY: 1 })
    gsap.from($icon, { yPercent: -50, opacity: 0, duration: 0.2, ease: spring })
  }
}

export { animateIn, animateOut }
