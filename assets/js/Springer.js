const msPerFrame = 1000 / 60
const sampleDuration = 10000
const sampleMsPerFrame = msPerFrame / sampleDuration

let reusedTuple = [0, 0]

/*
  noWobble: { stiffness: 170, damping: 26 }, // the default, if nothing provided
  gentle: { stiffness: 120, damping: 14 },
  wobbly: { stiffness: 180, damping: 12 },
  stiff: { stiffness: 210, damping: 20 },
*/

export default function Springer(stiffness = 170, damping = 26) {
  const steps = []

  let progress = 0
  let velocity = 0

  while (progress !== sampleDuration || velocity !== 0) {
    ;[progress, velocity] = stepper(
      progress,
      sampleDuration,
      velocity,
      stiffness,
      damping
    )
    steps.push(progress / sampleDuration)
  }

  return (i) => {
    return steps[Math.ceil(i * (steps.length - 1))]
  }
}

// Inspired by https://github.com/chenglou/react-motion/blob/master/src/stepper.js
function stepper(value, destination, velocity, stiffness, damping) {
  const spring = -stiffness * (value - destination)
  const damper = -damping * velocity
  const a = spring + damper
  const newVelocity = velocity + a * sampleMsPerFrame
  const newValue = value + newVelocity * sampleMsPerFrame

  if (Math.abs(newVelocity) < 0.1 && Math.abs(newValue - destination) < 0.1) {
    reusedTuple[0] = destination
    reusedTuple[1] = 0
    return reusedTuple
  }

  reusedTuple[0] = newValue
  reusedTuple[1] = newVelocity

  return reusedTuple
}
