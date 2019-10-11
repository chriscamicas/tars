let origin
let v1
let v2
let v3

function setup() {
  createCanvas(800, 600)
  origin = createVector(200, 500)

  const x1 = random(100, 150)
  const y1 = random(x1*2, 200)
  const x2 = random(100, 200)
  const y2 = random(20, x2-20)
  v1 = createVector(x1, -y1)
  v2 = createVector(x2, -y2)
  v3 = p5.Vector.add(v1, v2)
}

function draw() {
  background(0)
  translate(origin)
  stroke(255)
  strokeWeight(4)
  line(0, 0, 400, 0)
  line(0, 0, 0, -400)

  drawVector(v1, { label: 'a' })
  drawVector(v3, { label: 'a+b', color: {r: 0, g: 0, b: 255} })

  let movement = v1.copy()
  movement.setMag(movement.mag()*(0.5+Math.sin(frameCount/100)/2))

  drawVector(v2, {origin: movement, label: 'b', color: {r: 0, g: 255, b: 0} })
}

function drawVector(v, options) {
  if (options && options.origin) {
    translate(options.origin)
  }
  if (options && options.axis) {
    fill(255)
    strokeWeight(2)
    linedash(v.x, v.y, v.x, 0, [5, 5])
    linedash(v.x, v.y, 0, v.y, [5, 5])
    strokeWeight(1)
    textSize(18)
    text(`x: ${Math.round(v.x)}`, v.x - 20, 20)
    text(`y: ${Math.round(-v.y)}`, -80, v.y + 10)
  }

  stroke(249, 38, 114)
  fill(249, 38, 114)
  if(options.color) {
    stroke(options.color.r, options.color.g, options.color.b)
    fill(options.color.r, options.color.g, options.color.b)
  }

  if (options && options.label) {
    strokeWeight(1)
    textSize(20)
    const labelPosition = v.copy().setMag(v.mag()*0.5)
    text(options.label, labelPosition.x, labelPosition.y+20)
  }

  strokeWeight(4)
  line(0, 0, v.x, v.y)
  push()
  translate(v.x, v.y)
  rotate(v.heading() + PI / 2)
  line(0, 0, 10, 20)
  line(0, 0, -10, 20)
  pop()
}

function linedash(x1, y1, x2, y2, list) {
  drawingContext.setLineDash(list)
  line(x1, y1, x2, y2)
  drawingContext.setLineDash([])
}