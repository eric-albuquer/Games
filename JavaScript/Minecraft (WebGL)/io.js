const keysPressed = new Set();

// Detectar quando uma tecla é pressionada
document.addEventListener("keydown", (event) => {
    keysPressed[event.key.toLowerCase()] = true;
});

// Detectar quando uma tecla é solta
document.addEventListener("keyup", (event) => {
    keysPressed[event.key.toLowerCase()] = false;
});

// Função para atualizar a posição da câmera
function updateCamera() {
    const sin_y = Math.sin(angle_y)
    const cos_y = Math.cos(angle_y)

    let anyKeyPressed = false;
    let vx = 0
    let vz = 0

    // Movimento para frente (w) e para trás (s)
    if (keysPressed["w"]) {
        vx += -sin_y * horizontal_velocity;
        vz += cos_y * horizontal_velocity;
        anyKeyPressed = true;
    }
    if (keysPressed["s"]) {
        vx += sin_y * horizontal_velocity;
        vz += -cos_y * horizontal_velocity;
        anyKeyPressed = true;
    }

    // Movimento para a esquerda (a) e para a direita (d)
    if (keysPressed["a"]) {
        vx += cos_y * horizontal_velocity;
        vz += sin_y * horizontal_velocity;
        anyKeyPressed = true;
    }
    if (keysPressed["d"]) {
        vx -= cos_y * horizontal_velocity;
        vz -= sin_y * horizontal_velocity;
        anyKeyPressed = true;
    }

    if (anyKeyPressed) {
        camera_speed[0] = -vx;
        camera_speed[2] = -vz;
    }

    // Movimento para cima (espaço) e para baixo (Shift)
    if (keysPressed[" "]) {
        camera_speed[1] = -vertical_velocity;
    }
    if (keysPressed["shift"]) camera_speed[1] = vertical_velocity;
}

let lastMouseX = 0;
let lastMouseY = 0;

canvas.addEventListener("mousemove", (event) => {
    const deltaX = event.movementX || event.clientX - lastMouseX;
    const deltaY = event.movementY || event.clientY - lastMouseY;

    // Ajuste os ângulos da câmera com base no movimento do mouse
    angle_x += deltaY * angle_velocity; // Sensibilidade no eixo X
    angle_y += deltaX * angle_velocity; // Sensibilidade no eixo Y

    angle_x = Math.max(Math.min(angle_x, Math.PI / 2), -Math.PI / 2); // Limita entre -90° e 90°

    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
});