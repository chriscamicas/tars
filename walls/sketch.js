let myCar
const myWalls = []

function setup() {
  createCanvas(800, 600)
  myCar = new Car(createVector(width / 2, height / 2))

  for (let i = 0; i < 10; i++) {
    myWalls.push(new Wall(createVector(random(width), random(height)), createVector(random(width), random(height))))
  }
}

function draw() {
  background(0)
  myCar.update()
  myCar.draw()

  strokeWeight(2)
  stroke(240)

  for (let w of myWalls) {
    w.draw()
  }
}

class Car {
  constructor(pos) {
    this.pos = pos
    this.vel = createVector()
    this.acc = createVector()
    this.heading = 0
  }
  draw() {
    stroke(0, 148, 255) // I'm blue
    strokeWeight(8)
    point(this.pos.x, this.pos.y)

    strokeWeight(4)
    let vDir = p5.Vector.fromAngle(this.heading)
    vDir.setMag(10)
    vDir.add(this.pos)
    line(this.pos.x, this.pos.y, vDir.x, vDir.y)
  }

  update() {

    let friction = this.vel.copy()
    friction.mult(-0.1)

    this.acc = createVector(0, 0)
    this.acc.add(friction)

    if (keyIsPressed) {
      if (key == 'ArrowUp') {
        this.accelerate()
      }
      else if (key == 'ArrowDown') {
        this.decelerate()
      }
      else if (key == 'ArrowRight') {
        this.rotateRight()
      }
      else if (key == 'ArrowLeft') {
        this.rotateLeft()
      }

    }
    this.vel.add(this.acc)
    this.pos.add(this.vel)
  }

  accelerate() {
    this.acc = p5.Vector.fromAngle(this.heading)
    this.acc.mult(0.1)
  }
  decelerate() {
    this.acc = p5.Vector.fromAngle(this.heading)
    this.acc.mult(-0.1)
  }
  rotateLeft() {
    this.rotate(-0.1)
  }
  rotateRight() {
    this.rotate(0.1)
  }
  rotate(offset) {
    this.heading += offset
    this.acc.rotate(offset)
    this.vel.rotate(offset)

  }
}

class Wall {
  constructor(start, end) {
    this.start = start
    this.end = end
  }
  draw() {
    line(this.start.x, this.start.y, this.end.x, this.end.y)
  }
}