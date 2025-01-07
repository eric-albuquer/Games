class Vec4d {
    constructor(x, y, z, w = 1) {
        this.x = x
        this.y = y
        this.z = z
        this.w = w
    }

    toScreen(){
        this.x = this.x * center_x + center_x
        this.y = -this.y * center_y + center_y
    }

    visible(){
        return this.z > -1 && this.z < 1
    }

    add(v){
        this.x += v.x
        this.y += v.y
        this.z += v.z
        this.w += v.w
    }

    static add(a, b){
        return new Vec4d(
            a.x + b.x,
            a.y + b.y,
            a.z + b.z,
            a.w + b.w
        )
    }

    mul(s){
        this.x *= s
        this.y *= s
        this.z *= s
        this.w *= s
    }
}