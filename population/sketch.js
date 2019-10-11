let outerWalls = []
let innerWalls = []
let walls = []

let center
let cars = []
let gen = 0
let autoNewGenCheck
let speedSlider

let startPos
let startHeading

function setup() {
  createCanvas(800, 600)

  let button = createButton('start new generation')
  button.mousePressed(newGeneration)

  center = createVector(width / 2, height / 2)

  changeCircuit(2)

  startHeading = -PI / 2
  tf.setBackend('cpu')
}

const POPULATION_SIZE = 100

function newGeneration() {
  if (cars.length === 0) {
    cars = []
    for (let i = 0; i < POPULATION_SIZE; i++) {
      let car = new Car(startPos)
      car.heading = startHeading
      cars.push(car)
    }
  } else if (cars.length === 1) {
    let car = cars[0]
    for (let i = 1; i < POPULATION_SIZE; i++) {
      let brain = car.brain.copy()
      brain.mutate()
      let newCar = new Car(startPos, brain)
      newCar.heading = startHeading
      cars.push(newCar)
    }
  }
  else {
    let newGen = []
    let topNumber = Math.floor(cars.length * 0.1)
    const bestCars = cars.sort((a, b) => b.currentScore - a.currentScore).slice(0, topNumber)
    const totalFitness = bestCars.reduce((acc, car) => acc + car.currentScore, 0)

    function roulettePick(parents, pick) {
      let current = 0
      for (const parent of parents) {
        current += parent.currentScore
        if (current > pick) {
          return parent
        }
      }

    }


    const nbToKeep = 2
    // keep the 2 best cars
    for (let i = 0; i < nbToKeep; i++) {
      let car = bestCars[i]
      let brain = car.brain.copy()
      let newCar = new Car(startPos, brain)
      newCar.heading = startHeading
      newGen.push(newCar)
    }
    while (newGen.length < POPULATION_SIZE) {

      //Pick a pair
      let pickA = random(0, totalFitness)
      let pickB = random(0, totalFitness)
      let parentA = roulettePick(bestCars, pickA)
      let parentB = roulettePick(bestCars, pickB)
      newGen.push(parentA.giveBirth(parentB))
    }

    for (let c of cars)
      c.dispose()
    cars = newGen
  }
}

function draw() {
  background(0)
  stroke(255)
  fill(255)
  strokeWeight(1)

  for (let w of walls) {
    line(w.start.x, w.start.y, w.end.x, w.end.y)
  }

  stroke(0, 255, 0)

  for (let car of cars) {
    car.update()
    car.draw()
  }
}

function cross2d(v1, v2) {
  return v1.x * v2.y - v1.y * v2.x
}

function changeCircuit(circuitIndex) {
  const c = circuits[circuitIndex]

  walls = []
  for (let w of c.walls) {
    walls.push(new Wall(w.start.x, w.start.y, w.end.x, w.end.y))
  }
  walls.push(new Wall(0, height / 2, width / 2, height / 2))
  startPos = createVector(c.startPos.x, c.startPos.y)
}