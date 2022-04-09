import preset from 'https://luisarmando-testcoder.github.io/canvas-preset/index.js'

const {
  size,
  clear,
  draw,
  render,
  c
} = preset()

const heights = []
const smoothRandomGenerator = getLevelingRandomGenerator([-32, 40])

for (let index = 0; index < 100; index++) {
  heights.push(
    smoothRandomGenerator.next().value
  )
}

size()

draw(() => {
  clear()

  render({
    x: 0,
    y: c.height / 2,
    thickness: 2,
    color: '#444',
    group: heights.map((height, index) => ({
      x: index / (heights.length - 1) * c.width,
      y: height
    }))
  }).lines()
})

function* getLevelingRandomGenerator(seed) {
  const newSeed = [...seed] // Now, interpolate results with smoothsteps -> between each random place an X amount of smoothsteps to the next random. This, as last parameter

  while (seed) {
    const newMember = (
      newSeed[newSeed.length - 1] + newSeed[newSeed.length - 2]
    ) / 2 + Math.abs(
      newSeed[newSeed.length - 1] - (newSeed[Math.round(newSeed.length / 2)])
    ) * (
      (Math.random() - .5) * 2
    )

    newSeed.push(newMember)

    yield newSeed[newSeed.length - 1]
  }
}