function create_projection_matrix(fov, aspect_ratio, z_near, z_far) {
    const tan_half = 1 / (Math.tan((fov * PI) / 360))
    return new Mat4([
        tan_half * aspect_ratio, 0, 0, 0,
        0, tan_half, 0, 0,
        0, 0, (z_far) / (z_far - z_near), (- z_far * z_near) / (z_far - z_near),
        0, 0, 1, 0
    ])
}