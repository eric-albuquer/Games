const images = {
    9: "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wk.png",
    10: "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wp.png",
    11: "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wr.png",
    12: "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wn.png",
    13: "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wb.png",
    14: "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wq.png",

    17: "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bk.png",
    18: "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bp.png",
    19: "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/br.png",
    20: "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bn.png",
    21: "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bb.png",
    22: "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bq.png",
}

let start = false
let target = false

class Colors {
    static green = [115, 149, 82]
    static white = [235, 236, 208]
    static yellow = [245, 246, 130]
    static blue = [0, 246, 201]
}

class Piece {
    static none = 0
    static king = 1
    static pawn = 2
    static rook = 3
    static knight = 4
    static bishop = 5
    static queen = 6

    static white = 8
    static black = 16

    static move = 32

    static isMoved(piece) {
        return piece >= Piece.move
    }

    static isType(piece, otherPiece) {
        piece &= 7
        otherPiece &= 7
        return piece === otherPiece
    }

    static isSliding(piece) {
        const isBishop = Piece.isType(piece, Piece.bishop)
        const isRook = Piece.isType(piece, Piece.rook)
        const isQueen = Piece.isType(piece, Piece.queen)

        return isBishop || isRook || isQueen
    }

    static getColor(piece) {
        if (piece === 0)
            return Piece.none

        piece >>= 3
        if (piece % 2 === 1)
            return Piece.white

        return Piece.black
    }
}

class Move {
    #start
    #target

    constructor(start, target) {
        this.#start = start
        this.#target = target
    }

    getStart() {
        return this.#start
    }

    getTarget() {
        return this.#target
    }
}

class Enpassant extends Move {
    #side
    constructor(start, target, side) {
        super(start, target)
        this.#side = side
    }

    getSide() {
        return this.#side
    }
}

class CastleMove extends Move {
    #rookStart
    #rookTarget
    constructor(kingStart, kingTarget, rookStart, rookTarget) {
        super(kingStart, kingTarget)
        this.#rookStart = rookStart
        this.#rookTarget = rookTarget
    }

    getRookStart() {
        return this.#rookStart
    }

    getRookTarget() {
        return this.#rookTarget
    }
}

class Promotion extends Move {
    #promotedPiece
    constructor(start, target, promotedPiece) {
        super(start, target)
        this.#promotedPiece = promotedPiece
    }

    getPromoted() {
        return this.#promotedPiece
    }
}

class Game {
    static directionsVector = [8, -8, -1, 1, 7, -7, 9, -9]
    static knightVector = [-17, -10, 6, 15, 17, 10, -6, -15]
    squaresToEdge = []
    moves = []
    gameMoves = []
    white_king = 4
    black_king = 60

    constructor(color = Piece.white, oponentColor = Piece.black, board) {
        if (!board)
            this.initBoard()
        else
            this.board = board.map(x => x)

        this.AllMoveData()
        this.color = color
        this.oponentColor = oponentColor
        this.kingInCheck()
    }

    changeColor() {
        if (this.color === Piece.white) {
            this.color = Piece.black
            this.oponentColor = Piece.white
        } else {
            this.color = Piece.white
            this.oponentColor = Piece.black
        }
    }

    getPiece(x, y) {
        const z = 8 * y + x
        return this.board[z]
    }

    setPiece(x, y, piece) {
        const z = 8 * y + x
        this.board[z] = piece
    }

    getXY(position) {
        const x = position % 8
        const y = Math.floor(position / 8)

        return [x, y]
    }

    isInside(position) {
        return position >= 0 && position < 64
    }

    initBoard() {
        this.board = new Array(64).fill(Piece.none)

        for (let i = 0; i < 8; i++) {
            this.setPiece(i, 1, Piece.white | Piece.pawn)
            this.setPiece(i, 6, Piece.black | Piece.pawn)
        }

        for (let i = 0; i < 2; i++) {
            const color = i === 0 ? Piece.white : Piece.black
            const pos = i === 0 ? 0 : 7

            this.setPiece(0, pos, color | Piece.rook)
            this.setPiece(1, pos, color | Piece.knight)
            this.setPiece(2, pos, color | Piece.bishop)
            this.setPiece(3, pos, color | Piece.queen)
            this.setPiece(4, pos, color | Piece.king)
            this.setPiece(5, pos, color | Piece.bishop)
            this.setPiece(6, pos, color | Piece.knight)
            this.setPiece(7, pos, color | Piece.rook)
        }
    }

    draw(w, h) {
        const rect_w = w / 8
        const rect_h = h / 8

        strokeWeight(0)

        for (let i = 0; i < 8; i++) {
            const y = w - rect_h * (i + 1)
            for (let j = 0; j < 8; j++) {
                const x = rect_w * j
                const z = 8 * i + j
                const color = (i + j) % 2 === 1 ? Colors.white : Colors.green
                fill(color)
                if (z === start) {
                    fill(Colors.yellow)
                } else if (this.isLegalMove(start, z)) {
                    fill(Colors.blue)
                }

                rect(x, y, rect_w, rect_h)

                const piece = this.getPiece(j, i) & 31

                if (piece) {
                    image(images[piece], x, y, rect_w, rect_h)
                }

                fill(0)
                textSize(30)
                textAlign(CENTER, CENTER)
                //text(`${8 * i + j}`, x + rect_w / 2, y + rect_h / 2)
            }
        }
    }

    generateMoves() {
        this.moves = []
        for (let i = 0; i < 64; i++) {
            const piece = this.board[i]

            if (Piece.getColor(piece) === this.color)
                if (Piece.isSliding(piece)) {
                    this.generateSlidingMoves(i, piece)
                }
                else if (Piece.isType(piece, Piece.knight)) {
                    this.generateKnightMoves(i)
                }
                else if (Piece.isType(piece, Piece.king)) {
                    this.generateKingMoves(i)
                    this.generateCastleMoves(i)
                }
                else if (Piece.isType(piece, Piece.pawn)) {
                    this.generatePawnMoves(i, piece)
                }
        }

        return this.moves
    }

    AllMoveData() {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const toTop = 7 - row
                const toBotton = row
                const toLeft = col
                const toRight = 7 - col

                const squareIdx = row * 8 + col

                this.squaresToEdge[squareIdx] = [
                    toTop,
                    toBotton,
                    toLeft,
                    toRight,
                    Math.min(toTop, toLeft),
                    Math.min(toBotton, toRight),
                    Math.min(toTop, toRight),
                    Math.min(toBotton, toLeft)
                ]
            }
        }
    }

    generateSlidingMoves(position, piece) {
        const startDirectionsIdx = Piece.isType(piece, Piece.bishop) ? 4 : 0
        const endDirectionsIdx = Piece.isType(piece, Piece.rook) ? 4 : 8

        for (let direction = startDirectionsIdx; direction < endDirectionsIdx; direction++) {
            for (let n = 0; n < this.squaresToEdge[position][direction]; n++) {

                const target = position + Game.directionsVector[direction] * (n + 1)
                const pieceOnTarget = this.board[target]

                if (Piece.getColor(pieceOnTarget) === this.color)
                    break

                this.moves.push(new Move(position, target))

                if (Piece.getColor(pieceOnTarget) === this.oponentColor)
                    break
            }
        }
    }

    generateKnightMoves(position) {
        for (let direction = 0; direction < Game.knightVector.length; direction++) {
            const target = position + Game.knightVector[direction]
            const pieceOnTarget = this.board[target]
            const pieceOnTargetColor = Piece.getColor(pieceOnTarget)

            const [xOrigin, yOrigin] = this.getXY(position)
            const [xDest, yDest] = this.getXY(target)
            const dx = xDest - xOrigin
            const dy = yDest - yOrigin

            if (this.isInside(target)) {
                if (Math.abs(dx) + Math.abs(dy) === 3 && Math.abs(dx) * Math.abs(dy) !== 0) {
                    if (pieceOnTargetColor === this.oponentColor || pieceOnTargetColor === Piece.none)
                        this.moves.push(new Move(position, target))
                }
            }
        }
    }

    generateKingMoves(position) {
        for (let direction = 0; direction < Game.directionsVector.length; direction++) {
            const target = position + Game.directionsVector[direction]
            const pieceOnTarget = this.board[target]
            const pieceOnTargetColor = Piece.getColor(pieceOnTarget)

            const [xOrigin, yOrigin] = this.getXY(position)
            const [xDest, yDest] = this.getXY(target)
            const dx = xDest - xOrigin
            const dy = yDest - yOrigin

            if (this.isInside(target) && Math.abs(dx) <= 1 && Math.abs(dy) <= 1) {
                if (pieceOnTargetColor === this.oponentColor || pieceOnTargetColor === Piece.none)
                    this.moves.push(new Move(position, target))
            }
        }
    }

    generateCastleMoves(position) {
        const king = this.board[position]
        const kingIsMoved = Piece.isMoved(king)

        if (this.kingCheck)
            return

        if (kingIsMoved)
            return

        let shortCastle = true

        for (let i = 1; i <= 2; i++) {
            if (this.board[position + i] !== Piece.none)
                shortCastle = false
        }

        const rookRight = this.board[position + 2]
        const rookMoved = Piece.isMoved(rookRight)
        if (!rookMoved && shortCastle)
            this.moves.push(new CastleMove(position, position + 2, position + 3, position + 1))

        let grandCastle = true
        for (let i = -1; i >= -3; i--) {
            if (this.board[position + i] !== Piece.none)
                grandCastle = false
        }

        const rookLeft = this.board[position - 2]
        const rookLeftMoved = Piece.isMoved(rookLeft)
        if (!rookLeftMoved && grandCastle)
            this.moves.push(new CastleMove(position, position - 2, position - 4, position - 1))
    }

    generatePawnMoves(position, piece) {
        const vector = Piece.getColor(piece) === Piece.white ? 8 : -8
        const startPos = vector === 8 ? 8 : 48

        const ahead1 = position + vector
        const pieceOnTarget1 = this.board[ahead1]

        const ahead2 = position + vector * 2
        const pieceOnTarget2 = this.board[ahead2]

        const y = Math.floor(position / 8)

        const leftCapture = position + vector - 1
        const rightCapture = position + vector + 1

        const targetLeftColor = Piece.getColor(this.board[leftCapture])
        const targetRightColor = Piece.getColor(this.board[rightCapture])

        const right = position + 1
        const left = position - 1

        if (this.gameMoves.length > 0) {
            const lastMove = this.gameMoves[this.gameMoves.length - 1]

            const startLastMove = lastMove.getStart()
            const targetLastMove = lastMove.getTarget()

            const pieceLastMove = this.board[targetLastMove]
            const lastMoveWasPawn = Piece.isType(pieceLastMove, Piece.pawn)
            const sideRight = targetLastMove === right
            const sideLeft = targetLastMove === left

            const jump2 = Math.abs(targetLastMove - startLastMove) === 16

            const enpassantPosition = vector === 8 ? 32 : 24

            if (position >= enpassantPosition && position < enpassantPosition + 8 && lastMoveWasPawn && sideRight && jump2) {
                this.moves.unshift(new Enpassant(position, rightCapture, right))
            }
            if (position >= enpassantPosition && position < enpassantPosition + 8 && lastMoveWasPawn && sideLeft && jump2) {
                this.moves.unshift(new Enpassant(position, leftCapture, left))
            }
        }

        const promotionSquare = position < 64 - startPos && position >= 56 - startPos
        const nextYLeft = Math.floor(leftCapture / 8) === Math.floor(y + vector / 8)
        const nextYRight = Math.floor(rightCapture / 8) === Math.floor(y + vector / 8)

        if (promotionSquare) {
            if (pieceOnTarget1 === Piece.none) {
                this.moves.unshift(new Promotion(position, ahead1, Piece.rook | this.color))
                this.moves.unshift(new Promotion(position, ahead1, Piece.knight | this.color))
                this.moves.unshift(new Promotion(position, ahead1, Piece.bishop | this.color))
                this.moves.unshift(new Promotion(position, ahead1, Piece.queen | this.color))
            }

            if (targetLeftColor === this.oponentColor && nextYLeft) {
                this.moves.unshift(new Promotion(position, leftCapture, Piece.rook | this.color))
                this.moves.unshift(new Promotion(position, leftCapture, Piece.knight | this.color))
                this.moves.unshift(new Promotion(position, leftCapture, Piece.bishop | this.color))
                this.moves.unshift(new Promotion(position, leftCapture, Piece.queen | this.color))
            }

            if (targetRightColor === this.oponentColor && nextYRight) {
                this.moves.unshift(new Promotion(position, rightCapture, Piece.rook | this.color))
                this.moves.unshift(new Promotion(position, rightCapture, Piece.knight | this.color))
                this.moves.unshift(new Promotion(position, rightCapture, Piece.bishop | this.color))
                this.moves.unshift(new Promotion(position, rightCapture, Piece.queen | this.color))
            }
            return
        }

        if (this.isInside(leftCapture) && nextYLeft && targetLeftColor === this.oponentColor)
            this.moves.unshift(new Move(position, leftCapture))

        if (this.isInside(rightCapture) && nextYRight && targetRightColor === this.oponentColor)
            this.moves.unshift(new Move(position, rightCapture))

        if (this.isInside(ahead1) && pieceOnTarget1 === Piece.none) {
            this.moves.push(new Move(position, ahead1))
            if (this.isInside(ahead2) && pieceOnTarget2 === Piece.none && (position >= startPos && position < startPos + 8))
                this.moves.push(new Move(position, ahead2))
        }
    }

    kingInCheck() {
        this.changeColor()
        const legalMoves = this.generateLegalMoves()
        const king = this.color === Piece.white ? this.black_king : this.white_king
        this.changeColor()

        let check = false

        for (const move of legalMoves) {
            if (move.getTarget() === king) {
                check = true
                break
            }
        }
        this.kingCheck = check
        this.generateLegalMoves()
        return check
    }

    generateLegalMoves() {
        const pseudoLegalMoves = this.generateMoves()
        const legalMoves = []

        for (const move of pseudoLegalMoves) {
            const lastMove = this.move(move)
            const king = this.color === Piece.white ? this.black_king : this.white_king
            const oponentResponses = this.generateMoves()

            let capture_king = false
            for (const response of oponentResponses) {
                if (response.getTarget() === king) {
                    capture_king = true
                    break
                }
            }

            if (capture_king === false)
                legalMoves.push(move)

            this.unmakeMove(lastMove)
        }
        this.moves = legalMoves
        return legalMoves
    }

    move(move) {
        const start = move.getStart()
        const target = move.getTarget()
        const piece = this.board[start]
        const targetPiece = this.board[target]

        this.board[start] = Piece.none
        this.board[target] = piece | Piece.move

        if (Piece.isType(piece, Piece.king)) {
            if (Piece.getColor(piece) === Piece.white)
                this.white_king = target
            else
                this.black_king = target
        }

        const lastMoveData = [
            start,
            target,
            piece,
            targetPiece
        ]

        if (move instanceof CastleMove) {
            const startRook = move.getRookStart()
            const targetRook = move.getRookTarget()

            const rook = this.board[startRook]

            this.board[startRook] = Piece.none
            this.board[targetRook] = rook | Piece.move

            const castleData = [
                startRook,
                targetRook,
            ]

            lastMoveData.push(...castleData)

        } else if (move instanceof Enpassant) {
            const side = move.getSide()
            this.board[side] = Piece.none

            lastMoveData.push(side)
        } else if (move instanceof Promotion) {
            const promoted = move.getPromoted()
            this.board[target] = promoted | Piece.move
        }

        this.changeColor();

        this.gameMoves.push(move)

        return lastMoveData
    }

    unmakeMove(lastMoveData) {
        let start, target, piece, targetPiece, startRook, targetRook, side

        if (lastMoveData.length === 6) {
            startRook = lastMoveData[4]
            targetRook = lastMoveData[5]

            const rook = this.board[targetRook]

            this.board[startRook] = rook & 31
            this.board[targetRook] = Piece.none

        } else if (lastMoveData.length === 5) {
            side = lastMoveData[4]
            this.board[side] = Piece.pawn | this.color
        }

        start = lastMoveData[0]
        target = lastMoveData[1]
        piece = lastMoveData[2]
        targetPiece = lastMoveData[3]

        this.board[start] = piece
        this.board[target] = targetPiece

        if (Piece.isType(piece, Piece.king)) {
            if (Piece.getColor(piece) === Piece.white)
                this.white_king = start
            else
                this.black_king = start
        }

        this.gameMoves.pop()
        this.changeColor()
    }

    testMoves(depth) {
        if (depth === 0) {
            return 1;
        }

        let totalMoves = 0;
        const moves = this.generateLegalMoves()

        for (const move of moves) {
            const lastMove = this.move(move);
            totalMoves += this.testMoves(depth - 1);
            this.unmakeMove(lastMove)
        }

        return totalMoves;
    }

    isLegalMove(start, target) {
        let validMove = false

        for (const move of this.moves) {
            if (move.getStart() === start && move.getTarget() === target) {
                validMove = move
                break
            }
        }

        return validMove
    }
}

class Bot {
    endgameWheight
    constructor(game) {
        this.game = game
    }

    distanceCenter(piece) {
        const [x, y] = this.game.getXY(piece)
        const deltaX = x - 3.5
        const deltaY = y - 3.5

        return Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    }

    distance(piece1, piece2){
        const [x, y] = this.game.getXY(piece1)
        const [x2, y2] = this.game.getXY(piece2)
        const deltaX = x - x2
        const deltaY = y - y2

        return Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    }

    evaluate() {
        let evaluation = 0
        let material = 0
        for (let i = 0; i < 64; i++) {
            const piece = this.game.board[i]
            const color = Piece.getColor(piece) === this.game.color ? 1 : -1
            if (Piece.isType(piece, Piece.pawn)) {
                let distance = 0
                if (i % 8 >= 2 && i % 8 <= 5)
                    distance = this.distanceCenter(i)
                evaluation += color * (1 - distance / 8)
                material += 1
            }
            else if (Piece.isType(piece, Piece.knight)) {
                const distance = this.distanceCenter(i)
                evaluation += color * (3 - distance / 12)
                material += 3
            }
            else if (Piece.isType(piece, Piece.bishop)) {
                const distance = this.distanceCenter(i)
                evaluation += color * (3.1 - distance / 12)
                material += 3
            }
            else if (Piece.isType(piece, Piece.rook)) {
                evaluation += color * 5
                material += 5
            }
            else if (Piece.isType(piece, Piece.queen)) {
                evaluation += color * 9
                material += 9
            }
        }

        this.endgameWheight = 1 - material / 78

        const distance_white = this.distanceCenter(this.game.white_king)
        const distance_black = this.distanceCenter(this.game.black_king)

        const pespective = this.game.color === Piece.white ? -1 : 1

        const kingDistance = this.distance(this.game.black_king, this.game.white_king)

        if (evaluation > 0){
            evaluation += (-kingDistance) * this.endgameWheight * pespective
            evaluation += distance_white * this.endgameWheight * pespective
        } else {
            evaluation += distance_white * this.endgameWheight * pespective
            evaluation += distance_black * this.endgameWheight * pespective - 1
        }

        return evaluation * pespective
    }

    minimax(depth, alpha, beta) {
        if (depth === 0) {
            return { evaluation: this.evaluate(), bestMove: null };
        }

        const legalMoves = this.game.generateLegalMoves();
        this.game.kingInCheck()
        if (legalMoves.length === 0) {
            if (this.game.kingInCheck()) {
                return { evaluation: -Infinity, bestMove: null };
            }
            return { evaluation: 0, bestMove: null };
        }

        let bestMove = null;

        for (const move of legalMoves) {
            const lastMove = this.game.move(move);
            const result = this.minimax(depth - 1, -beta, -alpha);
            const evaluation = -result.evaluation;
            this.game.unmakeMove(lastMove);

            if (evaluation >= beta) {
                return { evaluation: beta, bestMove: move };
            }

            if (evaluation > alpha) {
                alpha = evaluation;
                bestMove = move;
            }
        }
        return { evaluation: alpha, bestMove: bestMove };
    }
}

const game = new Game(Piece.white, Piece.black)
const bot = new Bot(game)

let bot_turn = false

function botMove() {
    if (!bot_turn)
        return

    console.log(bot.evaluate())

    const botMove = bot.minimax(4, -Infinity, Infinity)
    if (botMove.bestMove !== null) {
        game.move(botMove.bestMove)
    } else {
        game.kingInCheck()
        if (game.moves.length > 0) {
            game.move(game.moves[0])
        } else {
            check_mate = true
        }
    }
    bot_turn = false
    game.kingInCheck()
}

function mousePressed() {
    const x = Math.floor(8 * mouseX / WIDTH)
    const y = Math.floor(8 * (HEIGHT - mouseY) / HEIGHT)
    const z = 8 * y + x

    if (game.moves.length === 0) {
        window.alert("Check Mate")
    }

    if (start === false) {
        start = z
    } else if (target === false) {
        target = z
        const move = game.isLegalMove(start, target)
        if (move) {
            game.move(move)
            bot_turn = true
        } else {
            console.log("Lance invalido")
        }
        start = false
        target = false
    }
}

function preload() {
    for (const key in images) {
        images[key] = loadImage(images[key])
    }
}

let WIDTH, HEIGHT;

function setup() {
    const container = document.getElementById('chess-container');
    WIDTH = container.clientWidth;
    HEIGHT = container.clientHeight;
    let canvas = createCanvas(WIDTH, HEIGHT);
    canvas.parent('chess-container');
}

function draw() {
    game.draw(WIDTH, HEIGHT)
    botMove()
}
