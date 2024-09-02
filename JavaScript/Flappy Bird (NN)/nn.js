class NeuralNetwork {
    constructor(inputNodes, hiddenNodes, outputNodes) {
        this.inputNodes = inputNodes
        this.hiddenNodes = hiddenNodes
        this.outputNodes = outputNodes

        tf.setBackend("cpu");
        this.model = this.createModel()
    }

    createModel() {
        const model = tf.sequential()

        const hidden = tf.layers.dense({
            units: this.hiddenNodes,
            inputDim: this.inputNodes,
            activation: "sigmoid"
        })

        const output = tf.layers.dense({
            units: this.outputNodes,
            activation: "sigmoid"
        })

        model.add(hidden)
        model.add(output)

        model.compile({
            loss: "binaryCrossentropy",
            optimizer: "adam"
        })

        return model
    }

    async train(input, target, epochs, size) {
        input = tf.tensor2d(input)
        target = tf.tensor2d(target)
        for (let i = 0; i < size; i++) {
            const response = await this.model.fit(input, target, { epochs: epochs, shuffle: true })
            console.log(response.history.loss[0])
        }
    }

    predict(input) {
        return this.model.predict(input)
    }

    copy() {
        const clonedModel = this.createModel()
        const weights = this.model.getWeights()
        const weightsCopies = []
        for (let i = 0; i < weights.length; i++) {
            weightsCopies[i] = weights[i].clone()
        }
        clonedModel.setWeights(weightsCopies)
        const copy = new NeuralNetwork(this.inputNodes, this.hiddenNodes, this.outputNodes)
        copy.model = clonedModel
        return copy
    }

    mutate(rate) {
        const weights = this.model.getWeights()
        const mutatedWeights = []
        for (let i = 0; i < weights.length; i++) {
            let tensor = weights[i]
            let shape = weights[i].shape
            let values = tensor.dataSync().slice()
            for (let j = 0; j < values.length; j++) {
                if (Math.random() < rate) {
                    let w = values[j]
                    values[j] = w + Math.random() * 2 - 1
                }
            }
            let newTensor = tf.tensor(values, shape)
            mutatedWeights[i] = newTensor
        }
        this.model.setWeights(mutatedWeights)
    }
}
