/*!
 * massif gsap
 * @author: Yves Torres, studio@massif.ch
 */
import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(CustomEase)

export { gsap, CustomEase, ScrollTrigger, ScrollToPlugin }
export default gsap
