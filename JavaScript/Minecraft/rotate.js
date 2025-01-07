function create_rotation_matrix(angle_x, angle_y, angle_z) {
    const sin_x = Math.sin(angle_x), cos_x = Math.cos(angle_x);
    const sin_y = Math.sin(angle_y), cos_y = Math.cos(angle_y);
    const sin_z = Math.sin(angle_z), cos_z = Math.cos(angle_z);

    // Matriz de rotação total 4x4, combinando R_x, R_y e R_z
    const rotation_matrix = [
        cos_y * cos_z, 
        -cos_y * sin_z, 
        sin_y, 
        0,
        
        cos_x * sin_z + sin_x * sin_y * cos_z, 
        cos_x * cos_z - sin_x * sin_y * sin_z, 
        -sin_x * cos_y, 
        0,
        
        sin_x * sin_z - cos_x * sin_y * cos_z, 
        sin_x * cos_z + cos_x * sin_y * sin_z, 
        cos_x * cos_y, 
        0,

        0, 0, 0, 1
    ];

    return new Mat4(rotation_matrix);
}
