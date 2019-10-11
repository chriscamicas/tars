class Ray {
  constructor(angle) {
    this.angle = angle
    // this.dir.setMag(100)
  }

  draw() {
    let dir = p5.Vector.fromAngle(this.angle)
    dir.setMag(50)
    line(0, 0, dir.x, dir.y)
  }

  draw2(car) {
    let dir = p5.Vector.fromAngle(car.heading + this.angle)
    dir.setMag(50)
    line(0, 0, dir.x, dir.y)
  }

  cast(car, walls) {
    let a = car.pos //start of the ray
    let r = p5.Vector.fromAngle(car.heading + this.angle) //end of the ray
    // r.setMag(width)
    // r.setMag(50)
    let b = p5.Vector.add(a, r)
    // stroke(222, 255, 0)
    // line(a.x, a.y, b.x, b.y)

    let closestWallDist = Infinity

    for (let w of walls) {
      let s = w.s
      const c = w.start
      const d = w.end

      //for debug purpose
      // push()
      // strokeWeight(1)
      // stroke(0, 255, 0)
      // fill(0, 255, 0)
      // text('c', c.x, c.y - 10)
      // text('d', d.x, d.y - 10)

      // text('a', a.x, a.y - 10)
      // text('b', b.x, b.y - 10)
      // pop()

      // push()
      // translate(width / 2, height / 2)
      // line(0, 0, r.x, r.y)
      // line(0, 0, s.x, s.y)
      // text('r', r.x, r.y - 10)
      // text('s', s.x, s.y - 10)
      // pop()
      // line(c.x, c.y, d.x, d.y)

      let denom = cross2d(r, s)
      let num = p5.Vector.sub(c, a)
      const t = cross2d(num, s) / denom
      const u = cross2d(num, r) / denom

      if (t >= 0 && u <= 1 && u >= 0) {
        if (t < closestWallDist) {
          closestWallDist = t
        }
      }
    }
    if (Number.isFinite(closestWallDist)) {
      if (closestWallDist < 5) return //dead

      // let intersect = p5.Vector.add(a, p5.Vector.mult(r, closestWallDist))
      // point(intersect.x, intersect.y)

      // strokeWeight(1)
      // stroke(255)

      // line(a.x, a.y, intersect.x, intersect.y)

      // text(closestWallDist, intersect.x + 10, intersect.y - 10)
      return closestWallDist
    }
  }
}