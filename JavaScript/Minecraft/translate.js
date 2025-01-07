function create_translation_matrix(tx, ty, tz){
    return new Mat4([
        1, 0, 0, tx,
        0, 1, 0, ty,
        0, 0, 1, tz,
        0, 0, 0, 1
    ])
}