let walls = []
let car

let center

let startPos
let startHeading

function setup() {
  createCanvas(800, 600)

  center = createVector(width / 2, height / 2)

  let circuitSelection = createSelect();
  circuitSelection.option('Circuit Mario', 2);
  circuitSelection.option('Plaine Donut', 1);
  circuitSelection.option('test', 0);
  circuitSelection.changed(e => changeCircuit(e.srcElement.value));

  changeCircuit(2)

  startHeading = -PI / 2
  tf.setBackend('cpu')

  car = new Car(startPos)
  car.heading = startHeading

}

function draw() {
  background(0)
  stroke(255)
  fill(255)
  strokeWeight(2)

  for (let w of walls) {
    line(w.start.x, w.start.y, w.end.x, w.end.y)
  }

  // stroke(0, 255, 0)
  // let winVec = p5.Vector.fromAngle(0.95 * TWO_PI - PI)
  // winVec.setMag(400)
  // winVec.add(center)
  // line(center.x, center.y, winVec.x, winVec.y)

  car.update()
  car.draw()
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