function colide() {
    let horizontal = false
    let vertical = false
    for (const block of obj_buffer) {
        const block_x = block.position.x
        const block_y = block.position.y
        const block_z = block.position.z

        const half_size = block.half_size

        const bx_min = block_x - half_size
        const bx_max = block_x + half_size
        const bz_min = block_z - half_size
        const bz_max = block_z + half_size
        const by_min = block_y - half_size
        const by_max = block_y + half_size

        const next_pos = Vec4d.add(camera_pos, camera_speed)

        const foot = next_pos.y - 2
        const body = next_pos.y - 1

        if (
            next_pos.x >= bx_min &&
            next_pos.x <= bx_max &&
            next_pos.z >= bz_min &&
            next_pos.z <= bz_max &&
            body >= by_min &&
            body <= by_max
        ) {
            horizontal = true
        }

        if (
            next_pos.x >= bx_min &&
            next_pos.x <= bx_max &&
            next_pos.z >= bz_min &&
            next_pos.z <= bz_max &&
            foot >= by_min &&
            foot <= by_max
        ) {
            vertical = true
        }
    }

    if (horizontal)
        return 2
    if (vertical)
        return 1
    return false
}

function updatePhysics() {
    const colision_type = colide()
    if (colision_type === 1) {
        camera_speed.y = 0
    } else if (colision_type === 2) {
        camera_speed.x = 0
        camera_speed.z = 0
    }
    else {
        camera_speed.add(gravity_vec)
    }
    camera_speed.mul(dump)
    camera_pos.add(camera_speed)
}