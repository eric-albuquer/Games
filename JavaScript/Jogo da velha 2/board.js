class Piece {
    static x = 1
    static o = 2
    static none = 0
    static draw = 4
}

class Board {
    constructor() {
        this.board = new Array(9).fill(Piece.none)
        this.winner = Piece.none
    }

    put(idx, color) {
        if (this.board[idx] !== Piece.none) return

        this.board[idx] = color
        return idx
    }

    verifyWin() {
        if (this.winner !== Piece.none) return this.winner

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

        let draw = true

        for (const pattern of patterns) {
            let end = true
            const color = this.board[pattern[0]]
            for (const idx of pattern) {
                if (this.board[idx] !== color || this.board[idx] === Piece.none) {
                    end = false
                    if (this.board[idx] === Piece.none) draw = false
                }
            }
            if (end) {
                this.winner = color
                return color
            }
        }
        if (draw) {
            this.winner = Piece.draw
            return Piece.draw
        }

        return Piece.none
    }
}
