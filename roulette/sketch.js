let cars
const POPULATION_SIZE = 5
let totalScore
let rotation = 0
let rotate
let picked = null
let pickedAnimation = 0

function setup() {
  createCanvas(800, 600)
  rotate = createCheckbox('rotate')
  createButton('pick').mousePressed(pick)

  generatePopulation()
}

function draw() {
  background(0)

  fill(255)
  stroke(255)
  strokeWeight(1)
  textFont('Consolas')
  textSize(24)
  text(`Car  |  Score`, 20, 20)
  for (let i = 0; i < POPULATION_SIZE; i++) {
    text(`${String.fromCharCode(i + 65)}    |      ${cars[i]}`, 20, 45 + i * 25)
  }

  text(`Total      ${totalScore}`, 20, 60 + POPULATION_SIZE * 25)
  if (picked) {
    stroke(0,200,120)
    fill(0,200,120)
    text(`Picked     ${picked}`, 20, 85 + POPULATION_SIZE * 25)
  }
  translate(width / 2, height / 2)

  if (picked) {
    if (pickedAnimation < picked) {
      pickedAnimation += 0.08
    } else {

    }
    strokeWeight(4)
    let start = p5.Vector.fromAngle(pickedAnimation / totalScore * TWO_PI).mult(150)
    let end = p5.Vector.mult(start, 1.5)
    line(start.x, start.y, end.x, end.y)
  }

  fill(255)
  stroke(255)
  strokeWeight(1)

  let angle = rotation
  for (let i = 0; i < POPULATION_SIZE; i++) {
    let carScore = cars[i]
    angle += carScore * TWO_PI / totalScore
    let v = p5.Vector.fromAngle(angle).mult(150)
    line(0, 0, v.x, v.y)
    v.mult(1.2)
    text(String.fromCharCode(i + 65), v.x, v.y)
  }

  strokeWeight(2)
  ellipseMode(CENTER)
  noFill()
  circle(0, 0, 300)

  if (rotate.checked())
    rotation += 0.1

}

function generatePopulation() {
  // generate random population with score per car
  totalScore = 0
  cars = []
  for (let i = 0; i < POPULATION_SIZE; i++) {
    let score = Math.floor(random(10))
    cars.push(score)
    totalScore += score
  }
  cars = cars.sort((a, b) => b - a)
}

function pick() {
  pickedAnimation = 0
  picked = Math.floor(random(totalScore))
}