const width = innerWidth
const height = innerHeight
const pipeLargura = width / 12
const larguraBuraco = height / 4
let velocidadePipe = 3
const birdX = width / 3
const birdY = height / 2
const gravity = 0.3
const numBirds = 250
const birdRadius = larguraBuraco / 10
const birdJump = height / 100

let pipes = [new Pipe(pipeLargura, -velocidadePipe, Math.random() * (height - larguraBuraco), larguraBuraco, width)]
let birds = []
//const bird = new Bird(birdX, birdY, gravity)
let scores = new Array(numBirds)
let bestScore = 0
let vivos = numBirds
let geracao = 1

for (let i = 0; i < numBirds; i++) {
    birds.push(new Bird(birdX, birdY, gravity))
}

function drawPipe(pipe) {
    fill(0, 255, 0)
    stroke(0)
    strokeWeight(2.5)
    rect(pipe.pipeX, 0, pipe.largura, pipe.buracoY)
    rect(pipe.pipeX, pipe.buracoY + pipe.alturaBuraco, pipe.largura, height)
    pipe.update()
}

function drawBird(bird) {
    fill(255, 120, 0)
    stroke(0)
    strokeWeight(2.5)
    circle(bird.x, bird.y, 2 * birdRadius)
    if (bird.y > height || bird.y < 0) {
        bird.died = true
    }
    bird.update()
}

// function handleKeyPress(event) {
//     if (event.keyCode === 32 && bird.y >= 0) {
//         bird.jump()
//     }
// }

// document.addEventListener('keydown', handleKeyPress);

function setup() {
    const canvas = createCanvas(width, height)
}

function draw() {
    tf.tidy(() => {
        if (pipes[0].pipeX + pipes[0].largura <= 0) {
            pipes.shift()
        }
        clear()
        background(0, 80, 255)

        for (let i = 0; i < birds.length; i++) {
            drawBird(birds[i])
            birds[i].think(pipes)
            if (birds[i].died) {
                scores[i] = birds[i]
                birds.splice(i, 1)
                vivos--
            }
        }

        for (const pipe of pipes) {
            if (intervaloDiscreto(pipe.pipeX + pipe.largura, birdX, velocidadePipe)) {
                pipe.proximo = false
                bestScore++
            }
            drawPipe(pipe)
            for (const bird of birds) {
                if (intervaloDiscreto(pipe.pipeX + pipe.largura, birdX, velocidadePipe) && !bird.died) {
                    bird.score++
                }
                if (pipe.colide(bird.x, bird.y, birdRadius)) {
                    bird.died = true
                }
            }
            if (intervaloDiscreto(pipe.pipeX + pipe.largura, width - width / 4, velocidadePipe)) {
                pipes.push(new Pipe(pipeLargura, -velocidadePipe, Math.random() * (height - larguraBuraco), larguraBuraco, width))
            }
        }

        fill(255, 0, 0)
        textSize(30)
        text(`Vivos: ${vivos}`, 50, 50)
        text(`Geração: ${geracao}`, 50, 100)
        text(`Score: ${bestScore}`, 50, 150)

        if (vivos === 0) restart()
    })
}

function nextGeneration() {
    let birds = []

    for (let i = 0; i < numBirds; i++) {
        const bird = new Bird(birdX, birdY, gravity)
        const bestModel = scores[0].brain.copy()
        if (i) {
            bestModel.mutate(0.1)
            bird.brain = bestModel
            birds.push(bird)
        } else {
            bird.brain = bestModel
            birds.push(bird)
        }
    }

    return birds
}

function intervaloDiscreto(x, num, intervalo) {
    return x >= num && x < num + intervalo
}

function restart() {
    pipes = [new Pipe(pipeLargura, -velocidadePipe, Math.random() * (height - larguraBuraco), larguraBuraco, width)]
    birds = nextGeneration()
    vivos = numBirds
    geracao++
    bestScore = 0

    scores = new Array(numBirds).fill(0)
}
