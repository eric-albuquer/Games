const world = new Map()

function createCube(x, y, z, type) {
    // Definição dos vértices do cubo
    positions.push(
        //Frente
        x, y, z + 1,
        x, y + 1, z + 1,
        x + 1, y, z + 1,
        x + 1, y + 1, z + 1,
        
        //Trás
        x, y, z,
        x, y + 1, z,
        x + 1, y, z,
        x + 1, y + 1, z,
        
        //Esquerda
        x, y, z,
        x, y, z + 1,
        x, y + 1, z,
        x, y + 1, z + 1,

        //Direita
        x + 1, y, z,
        x + 1, y, z + 1,
        x + 1, y + 1, z,
        x + 1, y + 1, z + 1,

        //Cima
        x, y + 1, z,
        x, y + 1, z + 1,
        x + 1, y + 1, z,
        x + 1, y + 1, z + 1,

        //Baixo
        x, y, z,
        x, y, z + 1,
        x + 1, y, z,
        x + 1, y, z + 1,
    );

    
    normals.push(
        // Frente
        0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
        // Trás
        0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
        // Esquerda
        -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 
        // Direita
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 
        // Cima
        0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 
        //Baixo
        0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 
    )

    // positions.push(
    //     // Frente
    //     x, y, 1 + z,
    //     1 + x, y, 1 + z,
    //     1 + x, 1 + y, 1 + z,
    //     x, 1 + y, 1 + z,
    //     // Trás
    //     x, y, z,
    //     1 + x, y, z,
    //     1 + x, 1 + y, z,
    //     x, 1 + y, z,
    // );

    const [v1, v5, v7, v3, v4, v0, v6, v2] = textures[type]

    colors.push(
        //Frente
        ...v0, ...v1, ...v2, ...v3,
        //Trás
        ...v4, ...v5, ...v6, ...v7,
        //Esquerda
        ...v4, ...v0, ...v5, ...v1,
        //Direita
        ...v6, ...v2, ...v7, ...v3,
        //Cima
        ...v5, ...v1, ...v7, ...v3,
        //Baixo
        ...v4, ...v0, ...v6, ...v2
    )

    const idx = (indices.length << 1) / 3;

    indices.push(
        // Frente
        0 + idx, 1 + idx, 2 + idx,
        1 + idx, 2 + idx, 3 + idx,
        // Trás
        4 + idx, 5 + idx, 6 + idx,
        5 + idx, 6 + idx, 7 + idx,
        //Esquerda
        8 + idx, 9 + idx, 10 + idx,
        9 + idx, 10 + idx, 11 + idx,
        // Direita
        12 + idx, 13 + idx, 14 + idx,
        13 + idx, 14 + idx, 15 + idx,
        // Cima
        16 + idx, 17 + idx, 18 + idx,
        17 + idx, 18 + idx, 19 + idx,
        // Baixo
        20 + idx, 21 + idx, 22 + idx,
        21 + idx, 22 + idx, 23 + idx,
    );

    // indices.push(
    //     // Frente
    //     0 + idx, 1 + idx, 2 + idx,
    //     0 + idx, 2 + idx, 3 + idx,
    //     // Trás
    //     4 + idx, 5 + idx, 6 + idx,
    //     4 + idx, 6 + idx, 7 + idx,
    //     // Topo
    //     3 + idx, 2 + idx, 6 + idx,
    //     3 + idx, 6 + idx, 7 + idx,
    //     // Base
    //     0 + idx, 1 + idx, 5 + idx,
    //     0 + idx, 5 + idx, 4 + idx,
    //     // Esquerda
    //     0 + idx, 3 + idx, 7 + idx,
    //     0 + idx, 7 + idx, 4 + idx,
    //     // Direita
    //     1 + idx, 2 + idx, 6 + idx,
    //     1 + idx, 6 + idx, 5 + idx,
    // );

    const key = `${x},${y},${z}`;
    world.set(key, { type });
}