class Tabuleiro {
    #LINHAS = 6
    #COLUNAS = 7
    #matriz = []

    constructor() {
        this.iniciarMatriz()
    }

    iniciarMatriz() {
        for (let x = 0; x < this.#COLUNAS; x++) {
            this.#matriz[x] = []
            for (let y = 0; y < this.#LINHAS; y++) {
                this.#matriz[x][y] = null
            }
        }
    }

    tabuleiroCheio(){
        for (let i = 0; i < this.#COLUNAS; i++) {
            for (let j = 0; j < this.#LINHAS; j++) {
                if(this.#matriz[i][j] === null){
                    return false
                }
            }
        }
        return true
    }

    #addPeca(x, y, cor) {
        this.#matriz[x][y] = new Peca(cor)
    }

    getProximaLinhaVazia(col){
        for (let i = 0; i < this.#LINHAS; i++) {
            if(this.#matriz[col][i] === null){
                return i
            }        
        }
        return -1
    }

    pecasNaColuna(x) {
        let quantidadeDePecas = 0
        for (let i = 0; i < this.#LINHAS; i++) {
            if (this.#matriz[x][i] !== null) {
                quantidadeDePecas++
            }
        }
        return quantidadeDePecas
    }

    colunaCheia(x) {
        if (this.#matriz[x][this.#LINHAS - 1] !== null) {
            return true
        }
        return false
    }

    #colunaVazia(x) {
        if (this.#matriz[x][0] === null) {
            return true
        }
        return false
    }

    colocarPeca(x, cor) {
        //Se a coluna não está cheia
        if (!this.colunaCheia(x)) {
            //Coluna vazia
            if (this.#colunaVazia(x)) {
                this.#addPeca(x, 0, cor)
                return [x, 0]
            } else {
                //Coluna contem ao menos 1 peça porem não está cheia
                for (let i = this.#LINHAS - 1; i >= 0; i--) {
                    if (this.#matriz[x][i] !== null) {
                        this.#addPeca(x, i + 1, cor)
                        return [x, i + 1]
                    }
                }
            }
        }
        return false
    }

    exibirTabuleiro() {
        for (let y = this.#LINHAS - 1; y >= 0; y--) {
            let linha = '';
            for (let x = 0; x < this.#COLUNAS; x++) {
                const peca = this.#matriz[x][y];
                if (peca === null) {
                    linha += ' - ';
                } else {
                    linha += ` ${peca.cor} `;
                }
            }
            console.log(linha);
        }
    }

    getPosicao(x, y) {
        if (x >= 0 && x < this.#matriz.length && y >= 0 && y < this.#matriz[x].length) {
            return this.#matriz[x][y];
        } else {
            //Retornar undefined se estiver fora do limite da matriz
            return undefined;
        }
    }

    get matriz() {
        return this.#matriz
    }

    get invertida(){
        const novaMatriz = []
        for (let i = 0; i < this.#LINHAS; i++) {
            novaMatriz[i] = []
            for (let j = 0; j < this.#COLUNAS; j++) {
                novaMatriz[i][j] = this.#matriz[j][i]
            }
        }
        return novaMatriz
    }

    setMatriz (x, y, valor) {
        this.#matriz[x][y] = valor
    }
}
