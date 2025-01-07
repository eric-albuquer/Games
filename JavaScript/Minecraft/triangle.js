class Triangle {
    constructor(v0, v1, v2, c0, c1, c2){
        this.v0 = v0
        this.v1 = v1
        this.v2 = v2
        
        this.c0 = c0
        this.c1 = c1
        this.c2 = c2
    }

    colors(){
        return [this.c0, this.c1, this.c2]
    }
}