class Pipe{
    constructor(largura, velocidadeX, buracoY, alturaBuraco, pipeX){
        this.largura = largura
        this.velocidadeX = velocidadeX
        this.buracoY = buracoY
        this.alturaBuraco = alturaBuraco
        this.pipeX = pipeX
        this.proximo = true
    }

    update(){
        this.pipeX += this.velocidadeX
    }

    colide(x,y, radius){
        if(x + radius > this.pipeX && x - radius < this.pipeX + this.largura){
            if(y - radius < this.buracoY || y + radius > this.buracoY + this.alturaBuraco){
                return true
            }
        }
        return false
    }
}
