class Color {
    constructor(r, g, b){
        this.r = r
        this.g = g
        this.b = b
    }

    copy(){
        return new Color(this.r, this.g, this.b)
    }
}