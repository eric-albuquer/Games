function rasterize(v0, v1, v2, colors) {
    const x_min = Math.floor(Math.max(0, Math.min(v0.x, v1.x, v2.x)))
    const y_min = Math.floor(Math.max(0, Math.min(v0.y, v1.y, v2.y)))
    const x_max = Math.ceil(Math.min(width - 1, Math.max(v0.x, v1.x, v2.x)))
    const y_max = Math.ceil(Math.min(height - 1, Math.max(v0.y, v1.y, v2.y)))

    let area = Vec2d.edge_cross(v0, v1, v2)

    if (area < 0) {
        [v0, v1] = [v1, v0]
        area = -area
    }

    const inv_area = 1 / area

    const delta_w0_col = v1.y - v2.y
    const delta_w1_col = v2.y - v0.y
    const delta_w2_col = v0.y - v1.y

    const delta_w0_row = v2.x - v1.x
    const delta_w1_row = v0.x - v2.x
    const delta_w2_row = v1.x - v0.x

    const bias0 = Vec2d.is_top_left(v1, v2) ? 0 : -0.0001;
    const bias1 = Vec2d.is_top_left(v2, v0) ? 0 : -0.0001;
    const bias2 = Vec2d.is_top_left(v0, v1) ? 0 : -0.0001;

    const p0 = new Vec2d(x_min, y_min)

    let w0_row = Vec2d.edge_cross(v1, v2, p0) + bias0
    let w1_row = Vec2d.edge_cross(v2, v0, p0) + bias1
    let w2_row = Vec2d.edge_cross(v0, v1, p0) + bias2

    for (let y = y_min; y <= y_max; y++) {
        let w0 = w0_row
        let w1 = w1_row
        let w2 = w2_row
        for (let x = x_min; x <= x_max; x++) {
            const is_inside = w0 >= 0 && w1 >= 0 && w2 >= 0

            if (is_inside) {
                const alpha = w0 * inv_area
                const beta = w1 * inv_area
                const gamma = 1 - alpha - beta

                const z = alpha * v0.z + beta * v1.z + gamma * v2.z
                const idx = y * width + x

                if (z < z_buffer[idx]) {
                    z_buffer[idx] = z

                    const r = alpha * colors[0].r + beta * colors[1].r + gamma * colors[2].r
                    const g = alpha * colors[0].g + beta * colors[1].g + gamma * colors[2].g
                    const b = alpha * colors[0].b + beta * colors[1].b + gamma * colors[2].b

                    const pixel_idx = idx * 4

                    frame_buffer[pixel_idx] = r
                    frame_buffer[pixel_idx + 1] = g
                    frame_buffer[pixel_idx + 2] = b
                    frame_buffer[pixel_idx + 3] = 255
                }
            }
            w0 += delta_w0_col
            w1 += delta_w1_col
            w2 += delta_w2_col
        }
        w0_row += delta_w0_row
        w1_row += delta_w1_row
        w2_row += delta_w2_row
    }
}