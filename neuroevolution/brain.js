class Brain {
  constructor(model) {
    if (model) {
      this.model = model
    }
    else {
      this.model = tf.sequential()
      // 8 inputs = # of lidars
      // 1 hidden layer with 16 nodes
      this.model.add(tf.layers.dense({ biasInitializer: 'randomNormal', units: 8, inputShape: [8], activation: 'relu6' }))
      // 4 outputs = commands to the car (turn l/r, accelerate, decelerate)

      // softmax function will do 2 things:
      // 1. convert all scores to probabilities.
      // 2. sum of all probabilities is 1.
      this.model.add(tf.layers.dense({ biasInitializer: 'randomNormal', units: 4, activation: 'softmax' })) //needs softmax explanation
    }
  }
  dispose() {
    this.model.dispose()
  }
  predict(distances) {
    let outputs = []
    // tf.tidy(() => {
    const distTensor = tf.tensor2d([distances])
    const predictions = this.model.predict(distTensor)
    outputs = predictions.dataSync()
    distTensor.dispose()
    predictions.dispose()
    // })
    return outputs
  }
  async predictAsync(distances) {
    let outputs = []
    const distTensor = tf.tensor2d([distances])
    const predictions = this.model.predict(distTensor)
    outputs = await predictions.data()
    distTensor.dispose()
    predictions.dispose()
    return outputs
  }

  copy() {
    let newBrain = new Brain()
    tf.tidy(() => {
      const weights = this.model.getWeights()
      newBrain.model.setWeights(weights)
    })
    return newBrain
  }

  mutate() {
    const rate = 0.1
    tf.tidy(() => {
      const weights = this.model.getWeights()
      const mutatedWeights = []
      for (let i = 0; i < weights.length; i++) {
        let tensor = weights[i]
        let shape = weights[i].shape
        let values = tensor.dataSync().slice()
        for (let j = 0; j < values.length; j++) {
          if (random(1) < rate) {
            let w = values[j]
            values[j] = randomGaussian() //actual mutation
          }
        }
        let newTensor = tf.tensor(values, shape)
        mutatedWeights[i] = newTensor
      }
      this.model.setWeights(mutatedWeights)
    })
  }

  crossover(otherBrain) {
    //keep half of our weights, use other half from the other brain
    tf.tidy(() => {
      const myWeights = this.model.getWeights()
      const otherWeights = otherBrain.model.getWeights()

      const newWeights = []
      for (let i = 0; i < myWeights.length; i++) {
        let myTensor = myWeights[i]
        let otherTensor = otherWeights[i]
        let shape = myWeights[i].shape
        let myValues = myTensor.dataSync().slice()
        let otherValues = otherTensor.dataSync().slice()

        myValues = this.oneOutOfTwoCrossover(myValues, otherValues)

        let newTensor = tf.tensor(myValues, shape)
        newWeights[i] = newTensor
      }
      this.model.setWeights(newWeights)
    });
  }
  oneOutOfTwoCrossover(myValues, otherValues) {
    for (let j = 0; j < myValues.length; j++) {
      if (j % 2 === 0)
        myValues[j] = otherValues[j]
    }
    return myValues
  }
}
