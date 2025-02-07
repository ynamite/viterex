import { gsap } from '@/js/gsap.js'
import { createSpring } from '@/js/CreateSpring'

const duration = 1
const numCols = 7
const numRows = 1
const numBlocks = numCols * numRows
const spring = createSpring()

const tl = gsap.timeline({
  paused: true,
  defaults: {
    duration: duration,
    ease: spring
  }
})

const stagger = {
  grid: [numRows, numCols],
  each: 0.1,
  from: [1, 0]
}
const params = {
  yPercent: 100,
  transformOrigin: '50% 0% ',
  stagger: stagger
}

const blocks = []

const containerHtml = `<div id="page-transition" style="--cols: ${numCols}; --rows: ${numRows};" class="fixed inset-0 z-10 pointer-events-none grid grid-cols-[repeat(var(--cols),_minmax(0,_1fr))] grid-rows-[repeat(var(--rows),_minmax(0,_1fr))] border-white border-[length:var(--padding)] max-md:border-0 overflow-clip"></div>`

const build = () => {
  const $body = document.querySelector('body')
  $body.insertAdjacentHTML('beforeend', containerHtml)
  const container = document.querySelector('#page-transition')

  for (let i = 0; i < numBlocks; i++) {
    const blockHtml = `<div class="overflow-clip"><div class="bg-secondary w-full h-full"/></div>`
    container.insertAdjacentHTML('beforeend', blockHtml)
    const block = container.lastElementChild.querySelector('div')
    blocks.push(block)
  }
  tl.addLabel('startIn')
  tl.to(blocks, params)
  tl.addLabel('startOut')
  params.duration = duration * 0.334
  params.yPercent = 0
  params.stagger.from = [1, 0]
  tl.to(blocks, params)
  tl.addLabel('end')
}

const pageTransition = async (type = 'in') => {
  return new Promise((resolve) => {
    gsap.delayedCall(0.4, resolve)
  })
  return
  if (type === 'in') {
    await tl.tweenFromTo('startIn', 'startOut')
  } else {
    await tl.play('startOut')
  }
}

// build()
// pageTransition('in')

export default pageTransition
