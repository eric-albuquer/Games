const WIDTH = 770
const HEIGHT = 770

const cell_size_x = WIDTH / COLS
const cell_size_y = HEIGHT / ROWS

const colors = {
    0 : [255, 255, 255],
    1 : [0, 0, 255],
    2 : [0, 255, 0],
    3 : [255, 0, 0],
    4 : [255, 0, 255],
    5 : [255, 255, 0],
    6 : [0, 255, 255],
    7 : [128, 255, 128],
    8 : [255, 128, 128]
}

function drawTable() {
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            const x = j * cell_size_x
            const y = i * cell_size_y
            fill(31, 77, 0)
            rect(x, y, cell_size_x, cell_size_y)
            if (table.isVisible(j, i))
                if (table.numbers[i][j] === -1) {
                    fill(255, 0, 0)
                    rect(x, y, cell_size_x, cell_size_y)
                } else {
                    fill(64, 39, 0)
                    rect(x, y, cell_size_x, cell_size_y)
                    const number = table.numbers[i][j]
                    fill(...colors[number])
                    textSize(32)
                    textAlign(CENTER, CENTER)
                    text(number, x + cell_size_x / 2, y + cell_size_y / 2)
                }
            if (table.isTagged(j, i)){
                fill(0, 0, 255)
                rect(x, y, cell_size_x, cell_size_y)
            }
        }
    }
}

function mousePressed() {
    if (mouseX < 0 || mouseX > WIDTH || mouseY < 0 || mouseY > HEIGHT)
        return false

    const x = Math.floor(mouseX / cell_size_x)
    const y = Math.floor(mouseY / cell_size_y)

    if (mouseButton === LEFT)
        table.setVisible(x, y)
    else if(mouseButton === RIGHT)
        table.setTag(x, y)
}

function setup() {
    createCanvas(WIDTH, HEIGHT);
    const canvas = document.getElementById('defaultCanvas0');
    canvas.addEventListener('contextmenu', (event) => {
        event.preventDefault();
    });
}

const scoreElement = document.getElementById("score")
const atemptsElement = document.getElementById("atempts")

function draw() {
    background(0)
    drawTable()
    scoreElement.innerHTML = table.score
    atemptsElement.innerHTML = table.atempts
}
