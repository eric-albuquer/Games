// const perspectiveMatrix = mat4();
// perspective(perspectiveMatrix, fov, aspect_ratio, near, far);

const matrix = mat4()

function render() {
    updateCamera()
    updatePhysics()

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //setMatrix(matrix, perspectiveMatrix)
    perspective(matrix, fov, aspect_ratio, near, far);
    rotateX(matrix, angle_x)
    rotateY(matrix, angle_y);
    translate(matrix, -camera[0], camera[1], -camera[2]);

    gl.uniformMatrix4fv(matrixLocation, false, matrix);

    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

    requestAnimationFrame(render);
}