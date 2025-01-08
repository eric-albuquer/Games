function colide() {
    const flags = [false, false, false]

    const pos = vec3(...camera)
    vec3Add(pos, camera_speed)
    let [x, y, z] = pos

    y = -y

    const xf = Math.floor(x)
    const yf = Math.floor(y)
    const zf = Math.floor(z)

    const foot = `${xf},${Math.floor(y - 1.5)},${zf}`;
    const head = `${xf},${Math.floor(y + 0.5)},${zf}`;

    const walls = [
        `${Math.floor(x - 0.2)},${yf},${zf}`,
        `${xf},${yf},${Math.floor(z - 0.2)}`,
        `${Math.floor(x + 0.2)},${yf},${zf}`,
        `${xf},${yf},${Math.floor(z + 0.2)}`,
        `${Math.floor(x - 0.2)},${Math.floor(y - 1.4)},${zf}`,
        `${xf},${Math.floor(y - 1.4)},${Math.floor(z - 0.2)}`,
        `${Math.floor(x + 0.2)},${Math.floor(y - 1.4)},${zf}`,
        `${xf},${Math.floor(y - 1.4)},${Math.floor(z + 0.2)}`
    ]

    if (world.has(foot))
        flags[0] = true
    if (world.has(head))
        flags[1] = true
    if (walls.some(wall => world.has(wall)))
        flags[2] = true

    return flags;
}

let angle_x = 0, angle_y = 0

function updatePhysics() {
    camera_speed[1] += gravity
    const [foot, head, wall] = colide()

    if (foot) {
        camera_speed[1] = 0

    } if (head) {
        camera_speed[1] = 0
    }
    if (wall) {
        camera_speed[0] = camera_speed[2] = 0
    }
    vec3Add(camera, camera_speed)
    camera_speed[0] *= dump_horizontal
    camera_speed[1] *= dump_vertical
    camera_speed[2] *= dump_horizontal
}