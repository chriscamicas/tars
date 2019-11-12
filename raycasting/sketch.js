let myCar
const myWalls = []
let showDistances

function setup() {
  createCanvas(800, 600)
  showDistances = createCheckbox('Distances', false)

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
    this.lidar = []
    for (let angle = 0; angle < TWO_PI; angle += TWO_PI / 8) {
      this.lidar.push(new Ray(angle))
    }
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

    // update ray orientation, and cast/draw them !
    push()
    stroke(255, 120, 120)
    fill(255, 120, 120)
    strokeWeight(1)
    for (let r of this.lidar) {
      r.update(this.pos, this.heading)
      r.cast()
    }
    pop()
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

class Ray {
  constructor(angle) {
    this.angle = angle
  }
  update(start, relativeAngle) {
    let end = p5.Vector.fromAngle(relativeAngle + this.angle)
    end.setMag(50)
    end.add(start)
    this.start = start
    this.end = end
  }
  draw() {
    line(this.start.x, this.start.y, this.end.x, this.end.y)
  }

  cast() {
    const r = p5.Vector.sub(this.end, this.start)
    let closest = width
    for (let w of myWalls) {
      // a + t*r = c + u*s

      // a*r = c*r+u*s*r
      // u = (a - c)*r /s*r

      // a*s + t*r*s = c*s
      // t = c-a * s / r*s
      const s = p5.Vector.sub(w.end, w.start)
      const t = cross2d(p5.Vector.sub(w.start, this.start), s) / cross2d(r, s)
      const u = cross2d(p5.Vector.sub(this.start, w.start), r) / cross2d(s, r)
      if (t >= 0 && u >= 0 && u < 1 && t < closest) {
        closest = t
      }
    }

    r.mult(closest)
    const end = p5.Vector.add(this.start, r)
    if (showDistances.checked()) {
      stroke(255 - r.mag(), r.mag(), r.mag())
    }
    line(this.start.x, this.start.y, end.x, end.y)
    if (showDistances.checked()) {
      fill(255 - r.mag(), r.mag(), r.mag())
      text(Math.floor(r.mag()), end.x, end.y)
    }
  }
}

function cross2d(v1, v2) {
  return v1.x * v2.y - v2.x * v1.y
}