class Game {
    static wrongSound = new Audio("https://cdn.freesound.org/previews/131/131657_2398403-lq.ogg")
    static correctSound = new Audio("https://cdn.freesound.org/previews/546/546120_9129912-lq.ogg")
    static endGameSound = new Audio("https://cdn.freesound.org/previews/341/341985_6101353-lq.ogg")

    constructor() {
        this.boards = []
        for (let i = 0; i < 9; i++) {
            this.boards[i] = new Board()
        }

        this.color = Piece.x
        this.idxToPlay = null
        this.winner = Piece.none
        this.playSound = false
    }

    changeColor() {
        this.color = this.color === Piece.x ? Piece.o : Piece.x
    }

    put(idx1, idx2) {
        if (this.winner !== Piece.none) return

        if (this.boards[idx1].winner !== Piece.none) {
            const player = this.boards[idx1].winner === 1 ? "X" : "O"
            Game.wrongSound.play();
            window.alert(`Completo pelo jogador ${player}`)
            return
        }

        if (this.idxToPlay !== null) {
            if (idx1 !== this.idxToPlay) {
                Game.wrongSound.play();
                window.alert(`Você deve jogar na casa ${this.idxToPlay}`)
                return
            }
            if (this.boards[this.idxToPlay].board[idx2] !== Piece.none){
                Game.wrongSound.play();
                window.alert(`A casa ${idx2} já está cheia`)
                return
            }
            this.idxToPlay = this.boards[this.idxToPlay].put(idx2, this.color)
        } else
            this.idxToPlay = this.boards[idx1].put(idx2, this.color)

        Game.correctSound.play()
        this.changeColor()
    }

    changeIdxToPlay() {
        if (this.idxToPlay !== null && this.boards[this.idxToPlay].winner !== Piece.none)
            this.idxToPlay = null
    }

    verifyWin() {
        const patterns = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [6, 4, 2]
        ]

        for (const pattern of patterns) {
            let end = true
            const color = this.boards[pattern[0]].winner
            for (const idx of pattern) {
                if (this.boards[idx].winner !== color || this.boards[idx].winner === Piece.none || this.boards[idx].winner === Piece.draw) {
                    end = false
                    break
                }
            }
            if (end) {
                return color
            }
        }
        return Piece.none
    }

    #drawX(x, y, width, height, proportion) {
        const size_w = width * proportion
        const size_h = height * proportion

        const startX = x + (width - size_w) / 2
        const startY = y + (height - size_h) / 2
        line(startX, startY, startX + size_w, startY + size_h)
        line(startX, startY + size_h, startX + size_w, startY)
    }

    draw() {
        fill(0, 0, 0, 0)

        const width_length = WIDTH / 3
        const height_length = HEIGTH / 3

        const width_length_2 = WIDTH / 9
        const height_length_2 = HEIGTH / 9

        for (let i = 0; i < 9; i++) {
            const board = this.boards[i]
            const winner = board.verifyWin()
            this.changeIdxToPlay()

            const X = i % 3 * width_length
            const Y = Math.floor(i / 3) * height_length

            stroke(255)
            strokeWeight(3)

            if (X > 0)
                line(X, 0, X, HEIGTH)
            if (Y > 0)
                line(0, Y, WIDTH, Y)

            if (this.idxToPlay === (Y / height_length) * 3 + (X / width_length)) {
                //stroke(100, 100, 255)
                fill(0, 200, 255, 128)
                rect(X, Y, width_length, height_length)
            } else if (this.boards[(Y / height_length) * 3 + (X / width_length)].winner === Piece.draw){
                fill(255, 0, 255, 128)
                rect(X, Y, width_length, height_length)
            } else if (this.boards[(Y / height_length) * 3 + (X / width_length)].winner === Piece.x){
                fill(255, 0, 0, 128)
                rect(X, Y, width_length, height_length)
            } else if (this.boards[(Y / height_length) * 3 + (X / width_length)].winner === Piece.o){
                fill(0, 255, 0, 128)
                rect(X, Y, width_length, height_length)
            }

            fill(0, 0, 0, 0)

            for (let j = 0; j < 9; j++) {
                stroke(200)
                strokeWeight(1)

                const x = j % 3 * width_length_2 + X
                const y = Math.floor(j / 3) * height_length_2 + Y

                if (x > 0)
                    line(x, y, x, y + height_length_2)

                if (y > 0)
                    line(x, y, x + width_length_2, y)

                const square = board.board[j]
                stroke(255)
                strokeWeight(2)
                if (square === Piece.o) circle(x + width_length_2 / 2, y + height_length_2 / 2, width_length_2 * 0.8)
                else if (square === Piece.x) this.#drawX(x, y, width_length_2, height_length_2, 0.8)
            }

            strokeWeight(14)
            
            if (winner === Piece.x) {
                stroke(0, 255, 0)
                this.#drawX(X, Y, width_length, height_length, 0.8)
            }
            else if (winner === Piece.o) {
                stroke(255, 0, 0)
                circle(X + width_length / 2, Y + height_length / 2, width_length * 0.8)
            }
        }

        this.winner = game.verifyWin()
        if (this.winner !== Piece.none) {
            this.idxToPlay = null
            textSize(WIDTH / 10);
            strokeWeight(2)
            stroke(0, 255, 0)
            const player = this.winner === 1 ? "X" : "O"
            text(`O jogador ${player} ganhou`, WIDTH / 20, HEIGTH / 2)
            if (this.playSound === false) {
                this.playSound = true
                Game.endGameSound.play()
            }
        }
    }
}
