class Mat4 {
    constructor(array) {
        // Usando Float32Array para melhor performance
        this.array = new Float32Array(array);
    }

    // Multiplicação de matriz por vetor (dot product)
    dotVec4d(v) {
        const m = this.array;
        const x = m[0] * v.x + m[1] * v.y + m[2] * v.z + m[3] * v.w;
        const y = m[4] * v.x + m[5] * v.y + m[6] * v.z + m[7] * v.w;
        const z = m[8] * v.x + m[9] * v.y + m[10] * v.z + m[11] * v.w;
        const w = m[12] * v.x + m[13] * v.y + m[14] * v.z + m[15] * v.w;

        if (w !== 0) {
            return new Vec4d(x / w, y / w, z / w, 1)
        }
        return new Vec4d(x, y, z, w);
    }

    // Multiplicação de matrizes
    static dot(a, b) {
        const ma = a.array;
        const mb = b.array;
        const mr = new Float32Array(16);

        // Calculando o produto de matrizes
        for (let i = 0; i < 4; i++) {
            let i4 = i * 4;
            for (let j = 0; j < 4; j++) {
                mr[i4 + j] = ma[i4] * mb[j] +
                    ma[i4 + 1] * mb[4 + j] +
                    ma[i4 + 2] * mb[8 + j] +
                    ma[i4 + 3] * mb[12 + j];
            }
        }

        return new Mat4(mr);
    }
}
