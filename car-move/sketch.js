
let myCar

function setup() {
  createCanvas(800, 600)
  myCar = new Car(createVector(random(width), random(height)))
  myCar.heading = random(PI)
}

function draw() {
  background(0)
  myCar.draw()
  myCar.update()
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
    let h = p5.Vector.fromAngle(this.heading)
    h.setMag(10)
    h.add(this.pos)
    line(this.pos.x, this.pos.y, h.x, h.y)
  }

  update() {

    this.acc = p5.Vector.fromAngle(this.heading)
    this.acc.mult(0.1)
    this.vel.add(this.acc)
    this.pos.add(this.vel)
  }
}