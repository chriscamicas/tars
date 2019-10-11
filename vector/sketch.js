let xOffset = 0
let yOffset = 10000

function setup() {
  createCanvas(800, 600)
}

function draw() {
  background(0)

  stroke(255)
  strokeWeight(4)
  line(200, 500, 600, 500)
  line(200, 500, 200, 100)
  xOffset += 0.005
  yOffset += 0.005
  const x = noise(xOffset) * (width - 400) + 200
  const y = noise(yOffset) * (height - 200) + 100
  const v = createVector(x, y).sub(200, 500)

  stroke(255)
  fill(255)
  strokeWeight(2)
  linedash(x, y, x, 500, [5, 5])
  linedash(x, y, 200, y, [5, 5])
  strokeWeight(1)
  textSize(20)
  text('O', 200-20, 500+20)
  text('M', x+10, y-10)
  text(`x: ${Math.round(x)}`, x-20, 520)
  text(`y: ${Math.round(y)}`, 100, y+10)

  strokeWeight(4)
  stroke(249, 38, 114)
  line(200, 500, x, y)
  push()
  translate(x, y)
  rotate(v.heading() + PI / 2)
  line(0, 0, 10, 20)
  line(0, 0, -10, 20)
  pop()
}

function linedash(x1, y1, x2, y2, list) {
  drawingContext.setLineDash(list); // set the "dashed line" mode
  line(x1, y1, x2, y2); // draw the line
  drawingContext.setLineDash([]); // reset into "solid line" mode
}