import { ScrollTrigger } from '@/js/gsap.js'
import swup from '@/js/swup.js'

let scrollTrigger = null
const Headroom = () => {
  const $html = document.documentElement
  const $body = $html.querySelector('body')
  $html.classList.remove('hr-not-top')
  $html.classList.remove('hr-bottom')
  $html.classList.remove('hr-pinned')
  setTimeout(() => {
    scrollTrigger = ScrollTrigger.create({
      trigger: $body,
      start: 'top -40',
      end: 'bottom bottom',
      onUpdate: async (self) => {

        self.progress === 0
          ? $html.classList.remove('hr-not-top')
          : $html.classList.add('hr-not-top')

        self.progress === 1
          ? $html.classList.add('hr-bottom')
          : $html.classList.remove('hr-bottom')

        self.direction === -1
          ? $html.classList.remove('hr-pinned')
          : $html.classList.add('hr-pinned')
      }
    })
  }, 250)
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
swup.hooks.on('content:replace', () => {
  Headroom()
})

export default Headroom
