const ROWS = 10
const COLS = 10
const BOMBS = 15

function zeros(rows, cols) {
    const x = []
    for (let i = 0; i < rows; i++) {
        x[i] = []
        for (let j = 0; j < cols; j++) {
            x[i][j] = 0
        }
    }

    return x
}

class Table {
    constructor(rows, cols, bombs, atempts) {
        this.rows = rows
        this.cols = cols

        this.initBombs(bombs)
        this.initNumbers()
        this.visible = []
        this.tags = []
        this.init()
        this.score = 0
        this.atempts = atempts
    }

    init(){
        const startX = Math.floor(this.cols / 2)
        const startY = Math.floor(this.rows / 2)

        const area = Math.floor(Math.sqrt(this.rows * this.cols))

        function choice(){
            const options = [-1, 0, 1]
            const idx = Math.floor(Math.random() * 3)

            return options[idx]
        }

        for (let i = 0; i < area; i++) {
            let x = startX
            let y = startY
            do {
                x += choice()
                y += choice()

                if (this.bombExists(x, y)){
                    x = startX
                    y = startY
                }
            } while(this.isVisible(x, y) || this.bombExists(x, y))

            this.setVisible(x, y)
        }
    }

    setVisible(x, y){
        if (this.isVisible(x, y))
            return

        // if(this.bombExists(x, y))
        //     window.alert("Game over!")

        this.visible.push([x, y])
    }

    isVisible(x, y){
        if(!this.visible)
            return false

        for (const [i, j] of this.visible) {
            if (i === x && j === y)
                return true
        }

        return false
    }

    setTag(x, y){
        if (this.isTagged(x, y)){
            this.setVisible(x, y)
            this.notTagged(x, y)
            return
        }
            
        if (this.bombExists(x, y))
            this.score++
        else
            this.atempts--

        if (this.atempts === 0)
            window.alert("Game over!")

        this.tags.push([x, y])
    }

    isTagged(x, y){
        if(!this.tags)
            return false

        for (const [i, j] of this.tags) {
            if (i === x && j === y)
                return true
        }

        return false
    }

    notTagged(x, y){
        for (let i = 0; i < this.tags.length; i++) {
            const [X, Y] = this.tags[i]

            if (x === X && y === Y){
                this.tags.splice(i, 1)
                return true
            }
        }
        return false
    }

    initBombs(bombs) {
        this.bombs = []

        for (let i = 0; i < bombs; i++) {
            let x, y
            do {
                x = Math.floor(Math.random() * this.cols)
                y = Math.floor(Math.random() * this.rows)
            } while(this.bombExists(x, y))

            this.bombs.push([x, y])
        }
    }

    bombExists(x, y){
        if(!this.bombs)
            return false

        for (const [i, j] of this.bombs) {
            if (i === x && j === y)
                return true
        }

        return false
    }

    initNumbers(){
        this.numbers = zeros(this.rows, this.cols)
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                let count = 0

                for (let x = -1; x <= 1; x++) {
                    for (let y = -1; y <= 1; y++) {
                        if (i + y < 0 || i + y >= this.rows || j + x < 0 || j + x >= this.cols)
                            continue

                        if (this.bombExists(j + x, i + y))
                            count++
                    }
                }
                this.numbers[i][j] = count
                if (this.bombExists(j, i))
                    this.numbers[i][j] = -1
            }
        }
    }
}

const table = new Table(ROWS, COLS, BOMBS, 3)
