import { gsap } from '@/js/gsap.js'

const animateIn = async ($icon) => {
  if ($icon) {
    await gsap.to($icon, {
      yPercent: 50,
      opacity: 0,
      duration: 0.2
    })
    gsap.set($icon, { clearProps: true })
    gsap.set($icon, { scaleY: -1 })
    gsap.from($icon, { yPercent: 50, opacity: 0, duration: 0.2 })
  }
}

const animateOut = async ($icon) => {
  if ($icon) {
    await gsap.to($icon, {
      yPercent: -50,
      opacity: 0,
      duration: 0.2
    })
    gsap.set($icon, { clearProps: true })
    gsap.set($icon, { scaleY: 1 })
    gsap.from($icon, { yPercent: -50, opacity: 0, duration: 0.2 })
  }
}

export { animateIn, animateOut }
