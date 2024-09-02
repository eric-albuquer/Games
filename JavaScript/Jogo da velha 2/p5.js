function setup(){
    createCanvas(WIDTH, HEIGTH)
}

const game = new Game()

function mouseClicked(){
    if (mouseX < 0 || mouseX >= WIDTH || mouseY < 0 || mouseY >= HEIGTH)
        return
    
    const X = Math.floor(mouseX / (WIDTH / 3))
    const Y = Math.floor(mouseY / (HEIGTH / 3))

    const idx1 = X + Y * 3

    const x = Math.floor((mouseX - X * WIDTH / 3) / (WIDTH / 9))
    const y = Math.floor((mouseY - Y * HEIGTH / 3) / (HEIGTH / 9))

    const idx2 = x + y * 3

    game.put(idx1, idx2)
}

function draw(){
    background(0)
    game.draw()
}
