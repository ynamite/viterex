const dropdowns = async (menu, event) => {
  event.stopPropagation()

  let $target = event.target
  let dropdownClass = this.settings.dropdownSelector.substring(
    1,
    this.settings.dropdownSelector.length
  )
  if (
    !$target.classList.contains(dropdownClass) &&
    !$target.classList.contains('icon')
  )
    return
  event.preventDefault()
  if ($target.classList.contains('icon')) {
    $target = $target.closest('li')
  }
  const $dd = $target.querySelector('ul')
  let $activeDds = [...menu.$dropdownTriggers].filter((item) =>
    item.classList.contains('.dd-active')
  )
  $activeDds = $activeDds.filter(($dd) => $dd !== $target)

  if ($target.classList.contains('dd-active')) {
    $dd.parentElement.classList.remove('dd-active')
    await gsap.to($dd, {
      height: 0,
      opacity: 0,
      y: -10,
      clearProps: true
    })
    $dd.setAttribute('hidden', true)
  } else {
    $activeDds.forEach(($activeDd) => {
      $activeDd.classList.remove('dd-active')
      $activeDd.querySelector('ul').setAttribute('hidden', true)
    })
    $dd.removeAttribute('hidden')
    $dd.parentElement.classList.add('dd-active')
    gsap.from($dd, {
      height: 0,
      opacity: 0,
      y: -10,
      clearProps: true
    })
  }
}

export default dropdowns
