const WIDTH = 800
const HEIGHT = 800

const square_size = Math.floor(WIDTH / ROWS)

const colors = {
    0: [238, 228, 218],
    1: [237, 223, 196],
    2: [244, 177, 122],
    3: [247, 150, 99],
    4: [247, 124, 95],
    5: [246, 94, 57],
    6: [237, 206, 115],
    7: [237, 202, 100],
    8: [237, 198, 81],
    9: [238, 199, 68],
    10: [235, 194, 48]
}

function drawTable() {
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            const x = j * square_size
            const y = i * square_size
            fill(204, 192, 178)
            let font_color = [204, 192, 178]
            if (table[i][j]) {
                let color = Math.log2(table[i][j]) - 1
                if (color < 2)
                    font_color = 0
                else
                    font_color = 255
                color = colors[color]
                fill(color, 0, 0)
            }
            rect(x, y, square_size, square_size)
            textAlign(CENTER, CENTER)
            textSize(70)
            fill(font_color)
            textStyle(BOLD)
            text(table[i][j], x + square_size / 2, y + square_size / 2)
        }
    }
}

function keyPressed() {
    const board = table.map(a => a.map(b => b))

    if (key === "4") {
        moveLeft()
    } else if (key === "8") {
        moveUp()
    } else if (key === "6") {
        moveRight()
    } else if (key === "5") {
        moveDown()
    }

    if (allowMove(board, table))
        put()
}

function move(key) {
    const board = table.map(a => a.map(b => b))

    if (key === "4") {
        moveLeft()
    } else if (key === "8") {
        moveUp()
    } else if (key === "6") {
        moveRight()
    } else if (key === "5") {
        moveDown()
    }

    if (allowMove(board, table))
        put()
}

const scoreElement = document.getElementById("score")

function setup() {
    const canvas = createCanvas(WIDTH, HEIGHT)
}

let i = 0

function draw() {
    background(0)
    drawTable()
    scoreElement.textContent = score
    }
