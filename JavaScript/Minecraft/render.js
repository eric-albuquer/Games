let lastTime = 0;
let fps = 0;

function render(currentTime) {
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    // Calculando FPS
    fps = Math.floor(1000 / deltaTime);

    updateCamera()
    updatePhysics()

    frame_buffer.fill(0); // 0 representa preto (R=0, G=0, B=0, A=255)
    z_buffer = new Float32Array(total_pixels).fill(Infinity)

    const translate_matrix = create_translation_matrix(-camera_pos.x, -camera_pos.y, -camera_pos.z)
    const rotation_matrix = create_rotation_matrix(angle_x, angle_y, angle_z)

    const transform_matrix = Mat4.dot(Mat4.dot(projection_matrix, rotation_matrix), translate_matrix)

    for (const triangle of triangle_buffer) {
        const v0 = triangle.v0
        const v1 = triangle.v1
        const v2 = triangle.v2

        const v0_p = transform_matrix.dotVec4d(v0)
        const v1_p = transform_matrix.dotVec4d(v1)
        const v2_p = transform_matrix.dotVec4d(v2)

        v0_p.toScreen()
        v1_p.toScreen()
        v2_p.toScreen()

        const colors = triangle.colors()

        if (v0_p.visible() && v1_p.visible() && v2_p.visible())
            rasterize(v0_p, v1_p, v2_p, colors)
    }

    ctx.putImageData(frame, 0, 0);

    // Exibir FPS na tela
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText(`FPS: ${fps}`, 10, 30);

    // Chamar o próximo frame
    requestAnimationFrame(render);
}