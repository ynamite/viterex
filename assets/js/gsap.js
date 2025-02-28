/*!
 * massif gsap
 * @author: Yves Torres, studio@massif.ch
 */
import { gsap } from '@gsap/business'
import { CustomEase } from '@gsap/business/CustomEase'
import { ScrollTrigger } from '@gsap/business/ScrollTrigger'
import { ScrollToPlugin } from '@gsap/business/ScrollToPlugin'

gsap.registerPlugin(CustomEase)

export { gsap, CustomEase, ScrollTrigger, ScrollToPlugin }
export default gsap
