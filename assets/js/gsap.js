/*!
 * massif gsap
 * @author: Yves Torres, studio@massif.ch
 */
import { gsap } from 'gsap'

// import { Flip } from 'gsap/Flip'
import { CustomEase } from 'gsap/CustomEase'
// import { ScrollTrigger } from 'gsap/ScrollTrigger'
// import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(/*ScrollTrigger, ScrollToPlugin,*/ CustomEase)

export { CustomEase, gsap }
export default gsap
