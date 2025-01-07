const obj_buffer = [
]

for (let i = -5; i < 5; i++) {
    for (let j = -5; j < 5; j++) {
        obj_buffer.push(new Grass(i, 0.5, j))
    }
}

for (let i = -5; i < 5; i++) {
    obj_buffer.push(new Stone(i, 1.5, 4))
}
