const ROWS = 4
const COLS = 4

const table = []

let score = 0

for (let i = 0; i < ROWS; i++) {
    table[i] = []
    for (let j = 0; j < COLS; j++) {
        table[i][j] = 0
    }
}

function freeSquares() {
    const squares = []
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            if (!table[i][j])
                squares.push([i, j])
        }
    }

    return squares
}

function powerOf2() {
    const e = Math.floor(Math.random() * 2 + 1)
    return Math.pow(2, e)
}

function put() {
    const free = freeSquares()

    if (!free.length)
        return false

    const idx = Math.floor(Math.random() * free.length)
    const [y, x] = free[idx]
    table[y][x] = powerOf2()
    return true
}

function moveRight() {
    for (let i = 0; i < ROWS; i++) {
        for (let j = COLS - 1; j >= 0; j--) {
            for (let k = j - 1; k >= 0; k--) {
                if (table[i][j] === table[i][k] && table[i][j]) {
                    table[i][j] *= 2
                    table[i][k] = 0
                    score += table[i][j]
                    break
                } else if (!table[i][j] && table[i][k]) {
                    table[i][j] = table[i][k]
                    table[i][k] = 0
                    j++
                    break
                } else if (table[i][j] * table[i][k] !== 0) {
                    break
                }
            }
        }
    }
}

function moveLeft() {
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            for (let k = j + 1; k < COLS; k++) {
                if (table[i][j] === table[i][k] && table[i][j]) {
                    table[i][j] *= 2
                    table[i][k] = 0
                    score += table[i][j]
                    break
                } else if (!table[i][j] && table[i][k]) {
                    table[i][j] = table[i][k]
                    table[i][k] = 0
                    j--
                    break
                } else if (table[i][j] * table[i][k] !== 0) {
                    break
                }
            }
        }
    }
}

function moveUp() {
    for (let j = 0; j < ROWS; j++) {
        for (let i = 0; i < COLS; i++) {
            for (let k = i + 1; k < ROWS; k++) {
                if (table[i][j] === table[k][j] && table[i][j]) {
                    table[i][j] *= 2
                    table[k][j] = 0
                    score += table[i][j]
                    break
                } else if (!table[i][j] && table[k][j]) {
                    table[i][j] = table[k][j]
                    table[k][j] = 0
                    i--
                    break
                } else if (table[i][j] * table[k][j] !== 0) {
                    break
                }
            }
        }
    }
}

function moveDown() {
    for (let j = 0; j < COLS; j++) {
        for (let i = ROWS - 1; i >= 0; i--) {
            for (let k = i - 1; k >= 0; k--) {
                if (table[i][j] === table[k][j] && table[i][j]) {
                    table[i][j] *= 2
                    table[k][j] = 0
                    score += table[i][j]
                    break
                } else if (!table[i][j] && table[k][j]) {
                    table[i][j] = table[k][j]
                    table[k][j] = 0
                    i++
                    break
                } else if (table[i][j] * table[k][j] !== 0) {
                    break
                }
            }
        }
    }
}

function allowMove(board, new_board) {
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            if (board[i][j] !== new_board[i][j])
                return true
        }
    }
    return false
}

put()
put()
