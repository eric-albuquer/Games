class Cube {
    constructor(x, y, z, size, color_top, color_botton, color_front, color_back, color_left, color_right) {
        const half_size = size / 2;
        this.half_size = half_size
        this.position = new Vec4d(x, y, z, 0)

        // Vértices do cubo
        const vertex = [
            new Vec4d(x - half_size, y - half_size, z - half_size), // v0
            new Vec4d(x - half_size, y - half_size, z + half_size), // v1
            new Vec4d(x - half_size, y + half_size, z - half_size), // v2
            new Vec4d(x - half_size, y + half_size, z + half_size), // v3
            new Vec4d(x + half_size, y - half_size, z - half_size), // v4
            new Vec4d(x + half_size, y - half_size, z + half_size), // v5
            new Vec4d(x + half_size, y + half_size, z - half_size), // v6
            new Vec4d(x + half_size, y + half_size, z + half_size)  // v7
        ];

        const colors_t = [color_top, color_top, color_top]
        const colors_b = [color_botton, color_botton, color_botton]
        const colors_f = [color_front, color_front, color_front]
        const colors_ba = [color_back, color_back, color_back]
        const colors_l = [color_left, color_left, color_left]
        const colors_r = [color_right, color_right, color_right]

        // Triângulos do cubo (dividindo cada face em dois triângulos)
        this.triangles = [
            // Face frontal (v0, v1, v3, v2)
            new Triangle(vertex[0], vertex[1], vertex[2], ...colors_f), // Triângulo 1
            new Triangle(vertex[1], vertex[3], vertex[2], ...colors_f), // Triângulo 2
            
            // Face traseira (v4, v5, v7, v6)
            new Triangle(vertex[4], vertex[5], vertex[6], ...colors_ba), // Triângulo 3
            new Triangle(vertex[5], vertex[7], vertex[6], ...colors_ba), // Triângulo 4
            
            // Face superior (v2, v3, v6, v7)
            new Triangle(vertex[2], vertex[3], vertex[6], ...colors_t), // Triângulo 5
            new Triangle(vertex[3], vertex[7], vertex[6], ...colors_t), // Triângulo 6
            
            // Face inferior (v0, v1, v4, v5)
            new Triangle(vertex[0], vertex[1], vertex[4], ...colors_b), // Triângulo 7
            new Triangle(vertex[1], vertex[5], vertex[4], ...colors_b), // Triângulo 8
            
            // Face esquerda (v0, v2, v4, v6)
            new Triangle(vertex[0], vertex[2], vertex[4], ...colors_l), // Triângulo 9
            new Triangle(vertex[2], vertex[6], vertex[4], ...colors_l), // Triângulo 10
            
            // Face direita (v1, v3, v5, v7)
            new Triangle(vertex[1], vertex[3], vertex[5], ...colors_r), // Triângulo 11
            new Triangle(vertex[3], vertex[7], vertex[5], ...colors_r)  // Triângulo 12
        ];
    }
}
