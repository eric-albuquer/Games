for (let i = -10; i < 10; i++) {
    for (let j = -10; j < 10; j++) {
        createCube(i, 1, j, "grass_block")
        createCube(i, 0, j, "stone_block")
    }
}

createCube(0, 2, 0, "stone_block")
createCube(0, 3, 0, "stone_block")
createCube(0, 4, 0, "planck_block")