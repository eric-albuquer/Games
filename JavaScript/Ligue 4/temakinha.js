class Temakinha {
    #jogo
    constructor(jogo) {
        this.#jogo = jogo
    }

    falta1() {
        if (this.#jogo.lances.length === 0) {
            return false;
        }

        const [ultimoX, ultimoY] = this.#jogo.lances[this.#jogo.lances.length - 1];
        const cor = this.#jogo.tabuleiro.getPosicao(ultimoX, ultimoY).cor;

        const direcoes = ["direita", "esquerda", "cima", "baixo", "direitaCima", "direitaBaixo", "esquerdaCima", "esquerdaBaixo"];

        for (const direcao of direcoes) {
            const validar = this.#jogo.verificarDirecao(ultimoX, ultimoY, direcao, cor, 3)
            if (validar[0]) {
                return [cor, validar[1]];
            }
        }
        return false;
    }

    autoLance() {
        const avaliar = this.falta1()
        if (avaliar === false) {
            return Math.round(generateRandomNumber())
        } else {
            return avaliar[1]
        }
    }
}

const temakinha = new Temakinha(jogo)

function fazerLanceAuto() {
    let coluna = temakinha.autoLance()
    while (jogo.tabuleiro.colunaCheia(coluna) === true && jogo.fimJogo() === false) {
        coluna = Math.round(generateRandomNumber())
    }
    jogo.colocarPeca(coluna)
    jogo.exibirHtml()
    const fim = jogo.fimJogo()
    if (fim !== false) {
        atualizarPlacar(fim)
        setTimeout(function () {
            let corVencedora = jogo.nomeCor(fim)
            if (confirm(`${corVencedora} venceu! Reiniciar jogo?`)) {
                jogo.reiniciar()
            }
        }, 100);
        return
    }
    return coluna
}

function automatico(){
    const player = document.getElementById("auto")
    if(auto){
        player.innerHTML = "2 Players"
    } else {
        player.innerHTML = "Automático"
    }
    
    auto = !auto
}

function lanceMinimax(){
    const coluna = jogo.melhorJogadaAlfaBeta(9, 1, -Infinity, Infinity).coluna

    jogo.colocarPeca(coluna)
    jogo.exibirHtml()
    const fim = jogo.fimJogo()

    if (fim !== false) {
        atualizarPlacar(fim)
        setTimeout(function () {
            let corVencedora = jogo.nomeCor(fim)
            if (confirm(`${corVencedora} venceu! Reiniciar jogo?`)) {
                jogo.reiniciar()
            }
        }, 100);
        return
    }
    return coluna
}
