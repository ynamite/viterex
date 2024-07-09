/*!
 * massif gsap
 * @author: Yves Torres, studio@massif.ch
 */
import { gsap } from 'gsap'

import { CustomEase } from 'gsap/CustomEase'
import { Flip } from 'gsap/Flip'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(CustomEase)

export { gsap, CustomEase, ScrollTrigger, ScrollToPlugin, Flip }
export default gsap
