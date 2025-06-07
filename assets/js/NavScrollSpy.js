import { ScrollTrigger } from '@/js/gsap.js'
import swup from '@/js/swup.js'

let scrollTriggers = []

const NavScrollSpy = () => {
  const sections = document.querySelectorAll('[data-section]')
  const style = getComputedStyle(document.documentElement)

  if (scrollTriggers.length > 0) {
    scrollTriggers.forEach((trigger) => {
      trigger.kill(true)
    })
    scrollTriggers = []
  }
  if (sections.length === 0) {
    return
  }

  sections.forEach((section) => {
    let scrollTrigger = ScrollTrigger.create({
      trigger: section,
      endTrigger: section,
      start: () => {
        const scrollPadding =
          parseFloat(style.getPropertyValue('scroll-padding-top'), 10) + 5
        return 'top ' + scrollPadding + 'px'
      },
      end: () => {
        const scrollPadding =
          parseFloat(style.getPropertyValue('scroll-padding-top'), 10) - 0
        return 'bottom ' + scrollPadding + 'px'
      },
      onUpdate: function () {
        const menuItems = document.querySelectorAll(
          `.main-nav [data-menu-item]`
        )
        const targetNavItems = document.querySelectorAll(
          `.main-nav [data-menu-item="${section.id}"]`
        )

        menuItems.forEach((item) => {
          item.closest('li').classList.remove('active')
          item.closest('li').classList.remove('rex-current')
        })
        targetNavItems.forEach((item) => {
          item.closest('li').classList.add('active')
          item.closest('li').classList.add('rex-current')
        })
      }
    })
    scrollTriggers.push(scrollTrigger)
  })
}

NavScrollSpy()

swup.hooks.on(
  'content:replace',
  () => {
    NavScrollSpy()
  },
  { after: true }
)
