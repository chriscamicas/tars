class Car {
  constructor(pos, brain) {
    this.pos = pos.copy()
    this.vel = createVector(0, 0)
    this.acc = createVector(0, 0)
    this.heading = 0
    this.lidar = []
    this.alive = true
    this.currentScore = 0
    this.maxScore = 0
    this.lastMaxScoreUpdate = 0
    this.currentAction = -1
    this.counter = 0

    if (brain)
      this.brain = brain
    else //random brain
      this.brain = new Brain()
    for (let i = 0; i < TWO_PI; i += TWO_PI / 8) {
      this.lidar.push(new Ray(i))
    }
  }
  dispose() {
    this.brain.dispose()
  }
  draw() {
    // push()
    if (this.alive)
      stroke(0, 255, 95)
    else
      stroke(120)

    strokeWeight(10)
    point(this.pos.x, this.pos.y)

    // translate(this.pos)
    // rotate(this.heading)

    // strokeWeight(1)
    // stroke(255, 0, 0)
    // for (let ray of this.lidar) {
    //   ray.draw2(this)
    // }

    strokeWeight(2)
    const dir = p5.Vector.fromAngle(this.heading)
    dir.setMag(10)
    line(this.pos.x, this.pos.y, this.pos.x + dir.x, this.pos.y + dir.y)

    // rotate(this.heading)

    // strokeWeight(1)
    // stroke(255, 0, 0)
    // for (let ray of this.lidar) {
    //   ray.draw()
    // }

    // strokeWeight(2)
    // stroke(0, 255, 0)
    // line(0, 0, 10, 0)
    // pop()
  }
  cast(walls) {
    let distances = []
    for (let ray of this.lidar) {
      let dist = ray.cast(this, walls)
      if (dist) {
        distances.push(dist / width) //for normalization
      }
      else {
        this.alive = false
        return
      }
    }
    return distances
  }
  accelerate() {
    this.acc = p5.Vector.fromAngle(this.heading)
    this.acc.mult(0.1)
  }
  decelerate() {
    this.acc = p5.Vector.fromAngle(this.heading)
    this.acc.mult(-0.05)
  }
  rotateLeft() {
    this.rotate(-0.03)
  }
  rotateRight() {
    this.rotate(0.03)
  }
  // async update() {
  //   if (this.updating) {
  //     // console.log('update drop')
  //     return
  //   }
  //   this.updating = true
  //   await this.updateAsync()
  //   this.updating = false
  // }
  // async updateAsync() {
  update() {
    if (!this.alive)
      return

    // friction force to slow down the car
    let friction = this.vel.copy()
    friction.mult(-0.1)

    this.acc = createVector(0, 0)
    this.acc.add(friction)

    const dist = this.cast(walls)
    if (!this.alive) //out of boundaries
      return

    // Thinking ...
    let action = this.currentAction
    if (this.counter === 5) {
      this.counter = 0
      // {
      const outputs = this.brain.predict(dist)
      let maxValue = 0
      for (let actionTemp = 0; actionTemp < 4; actionTemp++) {
        const value = outputs[actionTemp]
        if (value > maxValue) {
          maxValue = value
          action = actionTemp
        }
      }
      this.currentAction = action
    }
    this.counter++

    if (action === 0) {
      this.accelerate()
    }
    else if (action === 1) {
      this.decelerate()
    }
    else if (action === 2) {
      this.rotateLeft()
    }
    else if (action === 3) {
      this.rotateRight()
    }

    // if (keyIsPressed) {
    //   if (key === 'ArrowUp') {
    //     this.accelerate()
    //   }
    //   if (key === 'ArrowDown') {
    //     this.decelerate()
    //   }
    //   if (key === 'ArrowLeft') {
    //     this.rotateLeft()
    //   }
    //   if (key === 'ArrowRight') {
    //     this.rotateRight()
    //   }
    // }
    this.vel.add(this.acc)

    //min/max velocity
    const velMag = this.vel.mag()
    if (velMag < 0.01)
      this.vel.setMag(0)
    else if (velMag > 5) {
      this.vel.setMag(5)
    }

    //screen boundaries
    // if (this.pos.x > width) {
    //   this.pos.x = width
    // }
    // else if (this.pos.x < 0) {
    //   this.pos.x = 0
    // }
    // if (this.pos.y > height) {
    //   this.pos.y = height
    // }
    // else if (this.pos.y < 0) {
    //   this.pos.y = 0
    // }

    //finally update the position
    this.pos.add(this.vel)

    //update score
    this.lastMaxScoreUpdate++
    if (this.lastMaxScoreUpdate > 500) {
      this.alive = false
    } else {
      this.currentScore = this.score()
      if (this.currentScore > this.maxScore) {
        this.maxScore = this.currentScore
        this.lastMaxScoreUpdate = 0
        if (this.currentScore > 0.95) { //win
          this.alive = false
        }
      }
    }

  }

  rotate(offset) {
    this.heading += offset
    this.acc.rotate(offset)
    this.vel.rotate(offset)
  }

  score() {
    return (p5.Vector.sub(this.pos, center).heading() + PI) / TWO_PI
  }

  giveBirth(otherParent) {
    let brain = this.brain.copy()
    let newCar = new Car(startPos, brain)
    newCar.heading = startHeading
    newCar.crossover(otherParent)
    newCar.mutate()
    return newCar
  }

  crossover(otherParent) {
    this.brain.crossover(otherParent.brain)
  }

  mutate() {
    this.brain.mutate()
  }
}