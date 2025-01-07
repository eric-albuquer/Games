const triangle_buffer = []

for (const obj of obj_buffer) {
    triangle_buffer.push(...obj.triangles)
}