let a
let b
let c
let d
let origin

let showOrigins
let showIntersect
let tSlider
let uSlider

function setup() {
  createCanvas(800, 600)

  showOrigins = createCheckbox('All vectors', false)
  showIntersect = createCheckbox('Intersect', false)

  tSlider = createSlider(0, 1, 0.5, 0.01)
  uSlider = createSlider(0, 1, 0.5, 0.01)

  origin = createVector(0, height)
  a = createVector(180, -180)
  b = createVector(600, -400)

  c = createVector(400, -180)
  d = createVector(220, -500)
}

const lightgray = { r: 120, g: 120, b: 120 }

function draw() {
  background(0)

  if (showOrigins.checked()) {
    drawVector(a, { origin: origin, label: 'a', color: lightgray })
    drawVector(b, { origin: origin, label: 'b', color: lightgray })
    drawVector(c, { origin: origin, label: 'c', color: lightgray })
    drawVector(d, { origin: origin, label: 'd', color: lightgray })
  }
   {
    stroke(255)
    fill(255)
    strokeWeight(1)
    textSize(20)

    text('a', a.x-20, origin.y+a.y+20)
    text('b', b.x+20, origin.y+b.y)

    text('c', c.x, origin.y+c.y+20)
    text('d', d.x-20, origin.y+d.y-15)
  }
  let label1 = 'r'
  let label2 = '    s'
  if (showOrigins.checked()) {
    label1 = 'r = b-a'
    label2 = '    s = d-c'
  }
  drawVector(p5.Vector.sub(b, a), { origin: p5.Vector.add(origin, a), label: label1, color: { r: 120, g: 255, b: 120 } })
  drawVector(p5.Vector.sub(d, c), { origin: p5.Vector.add(origin, c), label: label2, color: { r: 255, g: 120, b: 120 } })

  let t = tSlider.value()
  let u = uSlider.value()

  if (showIntersect.checked()) {
    drawVector(p5.Vector.sub(b, a).mult(t), { origin: p5.Vector.add(origin, a), label: 'tr', color: { r: 0, g: 255, b: 0 } })
    drawVector(p5.Vector.sub(d, c).mult(u), { origin: p5.Vector.add(origin, c), label: '    us', color: { r: 255, g: 0, b: 0 } })

    stroke(255)
    fill(255)
    strokeWeight(1)
    textSize(20)
    text(`t : ${nf(t, 1, 2)}`, 550, 500)
    text(`u : ${nf(u, 1, 2)}`, 550, 550)
  }
}

function drawVector(v, options) {
  push()
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
    text(`y: ${Math.round(v.y)}`, -80, v.y + 10)
  }

  stroke(249, 38, 114)
  fill(249, 38, 114)
  if (options.color) {
    stroke(options.color.r, options.color.g, options.color.b)
    fill(options.color.r, options.color.g, options.color.b)
  }

  if (options && options.label) {
    strokeWeight(1)
    textSize(20)
    const labelPosition = v.copy().setMag(v.mag() * 0.5)
    text(options.label, labelPosition.x, labelPosition.y + 20)
  }

  strokeWeight(4)
  line(0, 0, v.x, v.y)
  push()
  translate(v.x, v.y)
  rotate(v.heading() + PI / 2)
  line(0, 0, 10, 20)
  line(0, 0, -10, 20)
  pop()
  pop()
}

function linedash(x1, y1, x2, y2, list) {
  drawingContext.setLineDash(list)
  line(x1, y1, x2, y2)
  drawingContext.setLineDash([])
}