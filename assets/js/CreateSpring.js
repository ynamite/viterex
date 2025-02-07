export function createSpring({
  mass = 1,
  stiffness = 100,
  damping = 10,
  velocity = 0
} = {}) {
  const w0 = Math.sqrt(stiffness / mass)
  const zeta = damping / (2 * Math.sqrt(stiffness * mass))
  const wd = zeta < 1 ? w0 * Math.sqrt(1 - zeta * zeta) : 0
  const b = zeta < 1 ? (zeta * w0 + -velocity) / wd : -velocity + w0

  function solver(t) {
    if (zeta < 1) {
      t =
        Math.exp(-t * zeta * w0) * (1 * Math.cos(wd * t) + b * Math.sin(wd * t))
    } else {
      t = (1 + b * t) * Math.exp(-t * w0)
    }

    return 1 - t
  }

  const duration = (() => {
    const step = 1 / 6
    let time = 0

    while (true) {
      if (Math.abs(1 - solver(time)) < 0.001) {
        const restStart = time
        let restSteps = 1
        while (true) {
          time += step
          if (Math.abs(1 - solver(time)) >= 0.001) break
          restSteps++
          if (restSteps === 16) return restStart
        }
      }
      time += step
    }
  })()

  //return [duration * 1000, (t) => solver(duration * t)]
  return (t) => solver(duration * t)
}
