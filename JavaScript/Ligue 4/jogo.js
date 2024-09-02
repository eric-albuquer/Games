class Jogo {
    #lances = []
    #tabuleiro = new Tabuleiro()
    #corAJogar = 1 //1 = azul, -1 = amarelo

    #alternarCor() {
        if (this.#corAJogar === 1) {
            this.#corAJogar = -1
        } else {
            this.#corAJogar = 1
        }
    }

    colocarPeca(x) {
        if (this.fimJogo() !== false) {
            return false
        }
        const peca = this.#tabuleiro.colocarPeca(x, this.#corAJogar);
        if (!peca) {
            return false;
        }
        this.#lances.push(peca);
        this.#alternarCor();
        return true;
    }

    desfazerUltimaJogada() {
        if (this.#lances.length === 0) {
            return false
        } else {
            const [x, y] = this.#lances[this.#lances.length - 1]
            this.#tabuleiro.setMatriz(x, y, null)
            this.#alternarCor()
            this.#lances.pop()
            return true
        }
    }

    verificarSentido(x, y, sentido, cor) {
        let mao = 0;
        let contraMao = 0;
        const sentidos = {
            horizontal: [[1, 0], [-1, 0]],
            vertical: [[0, 1], [0, -1]],
            direitaCima: [[1, 1], [-1, -1]],
            esquerdaCima: [[-1, 1], [1, -1]]
        };

        for (let i = 0; i < 2; i++) {
            const [dx, dy] = sentidos[sentido][i];
            for (let j = 0; j < 4; j++) {
                const posicao = this.#tabuleiro.getPosicao(x + j * dx, y + j * dy);

                if (posicao === undefined || posicao === null || posicao.cor !== cor) {
                    break;
                } else if (posicao.cor === cor) {
                    if (i === 0) mao++;
                    else contraMao++;
                }
            }
        }

        if (mao + contraMao - 1 >= 4) {
            return true;
        }
        return false;
    }

    verificarDirecao(x, y, direcao, cor, numLinha) {
        let validar = 0;
        let proxima;
        for (let i = 0; i < numLinha; i++) {
            let posicao;
            if (direcao === "cima") {
                posicao = this.#tabuleiro.getPosicao(x, y + i);
                proxima = x
            } else if (direcao === "baixo") {
                posicao = this.#tabuleiro.getPosicao(x, y - i);
                proxima = x
            } else if (direcao === "direita") {
                posicao = this.#tabuleiro.getPosicao(x + i, y);
                proxima = x + 3
            } else if (direcao === "esquerda") {
                posicao = this.#tabuleiro.getPosicao(x - i, y);
                proxima = x - 3
            } else if (direcao === "direitaCima") {
                posicao = this.#tabuleiro.getPosicao(x + i, y + i);
                proxima = x + 3
            } else if (direcao === "direitaBaixo") {
                posicao = this.#tabuleiro.getPosicao(x + i, y - i);
                proxima = x + 3
            } else if (direcao === "esquerdaCima") {
                posicao = this.#tabuleiro.getPosicao(x - i, y + i);
                proxima = x - 3
            } else if (direcao === "esquerdaBaixo") {
                posicao = this.#tabuleiro.getPosicao(x - i, y - i);
                proxima = x - 3
            }
            if (posicao === undefined || posicao === null || posicao.cor !== cor) {
                return false;
            } else if (posicao.cor === cor) {
                validar++;
            }
        }
        if (validar === numLinha) {
            return [true, proxima];
        }
        return false
    }

    reiniciar() {
        this.#tabuleiro = new Tabuleiro()
        this.#lances = []
        this.#corAJogar = 1
        this.exibirHtml()
        console.info("Jogo reiniciado")
    }

    fimJogo() {
        if (this.#lances.length === 0) {
            return false;
        }

        const [ultimoX, ultimoY] = this.#lances[this.#lances.length - 1];
        const cor = this.#tabuleiro.getPosicao(ultimoX, ultimoY).cor;

        const sentidos = ["horizontal", "vertical", "direitaCima", "esquerdaCima"];

        for (const sentido of sentidos) {
            if (this.verificarSentido(ultimoX, ultimoY, sentido, cor)) {
                return cor;
            }
        }
        return false;
    }

    checkWin(player) {
        for (let ultimoX = 0; ultimoX < 7; ultimoX++) {
            for (let ultimoY = 0; ultimoY < 6; ultimoY++) {
                const sentidos = ["horizontal", "vertical", "direitaCima", "esquerdaCima"];

                for (const sentido of sentidos) {
                    if (this.verificarSentido(ultimoX, ultimoY, sentido, player)) {
                        return true;
                    }
                }
            }
        }
        return false
    }

    nomeCor(cor) {
        if (cor === 1) {
            return "Azul"
        } else if (cor === -1) {
            return "Amarela"
        }
    }

    exibir() {
        this.#tabuleiro.exibirTabuleiro()
    }

    get lances() {
        return this.#lances
    }

    get tabuleiro() {
        return this.#tabuleiro
    }

    exibirHtml() {
        const board = document.getElementById("board");
        board.innerHTML = "";

        for (let i = 5; i >= 0; i--) {
            const row = document.createElement("tr");
            for (let j = 0; j < 7; j++) {
                const cell = document.createElement("td");
                const posicao = this.#tabuleiro.getPosicao(j, i); // Inverti as coordenadas

                if (posicao !== null) {
                    const peca = posicao.cor;

                    // Crie um elemento div para representar a peça
                    const piece = document.createElement("div");
                    piece.classList.add("piece");

                    if (peca === 1) {
                        // Adicione a classe "blue" para círculos azuis
                        piece.classList.add("blue");
                    } else if (peca === -1) {
                        // Adicione a classe "yellow" para círculos amarelos
                        piece.classList.add("yellow");
                    }

                    cell.appendChild(piece);
                } else {
                    cell.textContent = "";
                    cell.classList.add("empty-cell");
                }
                row.appendChild(cell);
                cell.setAttribute("id", `cell-${j}-${i}`);
            }
            board.appendChild(row);
        }
    }

    evaluate() {
        let score = 0;

        const PLAYER = 1
        const AI = -1

        // Pontuação para as peças do jogador
        if (this.fimJogo() === 1) {
            score = -1000;
        }

        // Pontuação para as peças do AI
        if (this.fimJogo() === -1) {
            score = 1000;
        }

        // Pontuação para peças consecutivas do AI
        for (let row = 0; row < 6; row++) {
            for (let col = 0; col <= 7 - 4; col++) {
                const slice = this.#tabuleiro.invertida[row].slice(col, col + 4);
                const aiCount = slice.filter((cell) => cell !== null && cell.cor === AI).length;
                const playerCount = slice.filter((cell) => cell !== null && cell.cor === PLAYER).length;

                if (aiCount === 3 && playerCount === 0) {
                    score += 100;
                }

                if (aiCount === 2 && playerCount === 0) {
                    score += 10;
                }

                if (aiCount === 1 && playerCount === 0) {
                    score += 1;
                }

                if (aiCount === 0 && playerCount === 3) {
                    score -= 100;
                }

                if (aiCount === 0 && playerCount === 2) {
                    score -= 10;
                }

                if (aiCount === 0 && playerCount === 1) {
                    score -= 1;
                }
            }
        }
        return score;
    }

    melhorJogadaAlfaBeta(depth, jogador, alpha, beta) {
        if (depth === 0 || this.fimJogo() || this.#tabuleiro.tabuleiroCheio()) {
            return {
                score: this.evaluate(),
                coluna: null,
            };
        }

        let melhorJogada = { score: jogador === 1 ? -Infinity : Infinity, coluna: null };

        for (let col = 0; col < 7; col++) {
            if (!this.#tabuleiro.colunaCheia(col)) {
                const linha = this.#tabuleiro.getProximaLinhaVazia(col);
                this.colocarPeca(col);
                const pontuacao = this.melhorJogadaAlfaBeta(depth - 1, -jogador, alpha, beta).score;
                this.desfazerUltimaJogada();

                if (jogador === 1) {
                    if (pontuacao > melhorJogada.score) {
                        melhorJogada.score = pontuacao;
                        melhorJogada.coluna = col;
                    }
                    alpha = Math.max(alpha, pontuacao);
                } else {
                    if (pontuacao < melhorJogada.score) {
                        melhorJogada.score = pontuacao;
                        melhorJogada.coluna = col;
                    }
                    beta = Math.min(beta, pontuacao);
                }

                if (beta <= alpha) {
                    break; // Podar o restante do loop
                }
            }
        }

        return melhorJogada;
    }
}

const jogo = new Jogo()

jogo.exibirHtml()

let auto = true

//atualizar o jogo se uma coluna for clicada
document.getElementById("board").addEventListener("click", (event) => {
    if (event.target.tagName === "TD") {
        const cell = event.target;
        const cellId = cell.getAttribute("id");
        const column = parseInt(cellId.split("-")[1]);
        jogo.colocarPeca(column);
        jogo.exibirHtml();
        if (auto) {
            setTimeout(function () {
                //fazerLanceAuto()
                lanceMinimax()
            }, 1);
        } else {
            const fim = jogo.fimJogo()
            if (fim) {
                atualizarPlacar(fim)
                setTimeout(function () {
                    let corVencedora = jogo.nomeCor(fim)
                    if (confirm(`${corVencedora} venceu! Reiniciar jogo?`)) {
                        jogo.reiniciar()
                    }
                }, 100);
                return
            }
        }
    }
});

let amarelaPontos = 0
let azulPontos = 0

function atualizarPlacar(fim) {
    const pontuacaoAmarela = document.getElementById("pontuacaoAmarela")
    const pontuacaoAzul = document.getElementById("pontuacaoAzul")

    if (jogo.nomeCor(fim) === "Azul") {
        azulPontos++
        pontuacaoAzul.innerHTML = azulPontos
    } else if (jogo.nomeCor(fim) === "Amarela") {
        amarelaPontos++
        pontuacaoAmarela.innerHTML = amarelaPontos
    }
    return
}

function reiniciar() {
    if (confirm("Você deseja reiniciar?")) {
        jogo.reiniciar()
    }
}
