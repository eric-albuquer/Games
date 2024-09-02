class Bird {
    constructor(x, y, gravity) {
        this.x = x
        this.y = y
        this.gravity = gravity
        this.dy = -5
        this.died = false
        this.score = 0

        this.brain = new NeuralNetwork(4, 4, 1)
    }

    think(pipes) {
        let proxPipe
        for (let i = 0; i < pipes.length; i++) {
            if (pipes[i].proximo) {
                proxPipe = pipes[i]
                break
            }
        }

        let inputs = []
        inputs[0] = this.y / height
        inputs[1] = proxPipe.buracoY / height
        inputs[2] = (proxPipe.buracoY + proxPipe.alturaBuraco) / height
        inputs[3] = proxPipe.pipeX / width

        inputs = tf.tensor2d([inputs])

        let output = this.brain.predict(inputs).arraySync()[0][0];

        if (output > 0.5) this.jump()
    }

    update() {
        this.dy += this.gravity
        this.y += this.dy
    }

    jump() {
        this.dy = -birdJump
    }
}
