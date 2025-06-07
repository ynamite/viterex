import { createSpring } from '@/js/CreateSpring'
import pageTransition from '@/js/pageTransition'
import { gsap, ScrollTrigger, ScrollToPlugin } from '@/js/gsap.js'
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const spring = createSpring()

const getTransitionParams = (items) => {
  return {
    duration: 1,
    opacity: 0,
    ease: spring,
    direction: 'from',
    stagger: {
      each: 0.15 / items.length
    }
  }
}

const transition = async (selector, itemSelector, params = {}) => {
  const container = document.querySelectorAll(selector)
  if (!container) return
  const promises = []
  for (let i = 0; i < container.length; i++) {
    const items = container[i].querySelectorAll(itemSelector)
    const promise = new Promise((resolve) => {
      params.onComplete = () => resolve
    })
    promises.push(promise)
    const transitionParams = { ...getTransitionParams(items), ...params }
    container[i].classList.add('ready')
    gsap[transitionParams.direction](items, {
      ...getTransitionParams(items),
      ...params
    })
  }
  await Promise.all(promises)
}

const transitionOut = async () => {
  // transition('.anim', '.item', { y: -50, direction: 'to' })
  // transition('#list', '.item', { y: -50, direction: 'to' })
  // transition('#portfolio-detail', '.item', { y: -50, direction: 'to' })
}
const transitionIn = async (delay = 0) => {
  // transition('.anim', '.item', { y: 50, clearProps: true, delay: delay })
  // transition('#list', '.item', { y: 50, clearProps: true, delay: delay })
  // transition('#portfolio-detail', '.item', {
  //   y: 50,
  //   clearProps: true,
  //   direction: 'from'
  // })
}

const routeTransitions = [
  // {
  //   from: '(.*)',
  //   to: 'filter',
  //   out: async (done) => {
  //     await transitionOut()
  //     done()
  //   },
  //   in: async (done) => {
  //     ScrollTrigger.update()
  //     transitionIn()
  //     done()
  //   }
  // },
  {
    from: '(.*)',
    to: '(.*)',
    out: async (done) => {
      await pageTransition('out')
      done()
    },
    in: async (done) => {
      ScrollTrigger.update()
      transitionIn()
      await pageTransition('in')
      done()
    }
  }
]

const fragmentOptions = {
  rules: [
    {
      name: 'filter',
      from: '/(projekte|team)/:filter?',
      to: '/(projekte|team)/:filter?',
      containers: ['#filter-projects'],
      scroll: false
    }
  ],
  debug: false
}

// transitionIn(0.2)

export { transitionOut, transitionIn, fragmentOptions }
export default routeTransitions
