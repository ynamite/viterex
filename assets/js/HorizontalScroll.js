import swup from '@/js/swup.js'
import { gsap } from '@/js/gsap.js'

let scrollTrigger = []

const HorizontalScroll = () => {
  const containers = document.querySelectorAll('[data-scroll-horizontally]')

  containers.forEach((container) => {
    const section = container.closest('section')

    // insert container after section
    section.insertAdjacentElement('afterend', container)

    // wrap container in a div
    const wrapper = document.createElement('div')
    container.parentNode.insertBefore(wrapper, container)
    wrapper.appendChild(container)

    // append the wrappers all following siblings to the wrapper
    // if (wrapper.nextElementSibling)
    //   wrapper.appendChild(wrapper.nextElementSibling)
    // if (wrapper.nextElementSibling)
    //   wrapper.appendChild(wrapper.nextElementSibling)

    let next = wrapper.nextElementSibling
    while (next) {
      wrapper.appendChild(next)
      next = wrapper.nextElementSibling
    }

    const scrollWrapper = container.querySelector('[data-scroll-wrapper]')

    gsap.to(scrollWrapper, {
      x: () => window.innerWidth - scrollWrapper.scrollWidth,
      ease: 'none',
      scrollTrigger: {
        trigger: () =>
          window.innerWidth > window.innerHeight ? container : scrollWrapper,
        start: 'bottom bottom',
        end: '+=' + scrollWrapper.scrollWidth / 2,
        // end: '+=' + cards.length * 50 + '%',
        scrub: 0.5,
        pin: wrapper,
        anticipatePin: 1,
        invalidateOnRefresh: true
        // markers: true
      }
    })
  })
}

swup.hooks.on(
  'content:replace',
  () => {
    if (scrollTrigger.length) {
      scrollTrigger.forEach((ST) => {
        ST.kill()
      })
    }
  },
  { before: true }
)
swup.hooks.on('content:replace', () => {
  HorizontalScroll()
})

export default HorizontalScroll
