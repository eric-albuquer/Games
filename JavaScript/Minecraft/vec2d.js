class Vec2d {
    constructor(x, y){
        this.x = x
        this.y = y
    }

    static edge_cross(a, b, p){
        const ab = new Vec2d(b.x - a.x, b.y - a.y)
        const ap = new Vec2d(p.x - a.x, p.y - a.y)
        return ab.x * ap.y - ab.y * ap.x
    }

    static is_top_left(start, end) {
        const edge = { x: end.x - start.x, y: end.y - start.y }

        const is_top_edge = edge.y === 0 && edge.x > 0
        const is_left_edge = edge.y < 0

        return is_left_edge || is_top_edge
    }
}