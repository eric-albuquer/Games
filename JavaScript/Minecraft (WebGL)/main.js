const angle_velocity = 0.001
const horizontal_velocity = 0.05
const vertical_velocity = 0.07
const dump_horizontal = 0.97
const dump_vertical = 0.99
const gravity = 0.002

let fov = Math.PI / 2
const near = 0.1
const far = 1000

//Background Color
gl.clearColor(...color(129, 172, 253), 1.0);

render();