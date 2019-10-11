class Wall {
  constructor(x1, y1, x2, y2) {
    this.start = createVector(x1, y1);
    this.end = createVector(x2, y2);
    this.s = p5.Vector.sub(this.end, this.start)
  }
  draw() {
    stroke(255);
    // line(this.start.x, this.start.y, this.end.x, this.end.y);
    vertex(this.start.x, this.start.y);
  }
}