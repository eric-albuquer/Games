// Configuráveis

const width = window.innerWidth
const height = window.innerHeight

const z_near = 0.01
const z_far = 128
const fov = 60 // graus

const vertical_velocity = 0.25
const horizontal_velocity = 0.1
const angle_velocity = 0.001

const gravity = 0.01
const dump = 0.95

let angle_x = 0
let angle_y = 0
let angle_z = 0

const camera_pos = new Vec4d(0, 3, 0, 0)
const camera_speed = new Vec4d(0, 0, 0, 0)

//Constantes de execução (não configuraveis)

canvas.width = width
canvas.height = height

const frame = ctx.createImageData(width, height);

const total_pixels = width * height

let frame_buffer = frame.data
let z_buffer = new Float32Array(total_pixels).fill(Infinity)

const aspect_ratio = height / width

const center_x = width >> 1
const center_y = height >> 1

const PI = Math.PI

const projection_matrix = create_projection_matrix(fov, aspect_ratio, z_near, z_far)
const gravity_vec = new Vec4d(0, -gravity, 0, 0)

render()