const canvas = document.getElementById('webglCanvas');

canvas.addEventListener("click", () => {
    canvas.requestPointerLock();
});

const height = window.innerHeight;
const width = window.innerWidth;

canvas.width = width
canvas.height = height

const aspect_ratio = height / width

const gl = canvas.getContext('webgl2', { antialias: true });

if (!gl) {
    console.error('WebGL não é suportado neste navegador!');
    throw new Error('WebGL não suportado');
}

// Vertex Shader (inclui matriz de transformação)
const vertexShaderSource = `
attribute vec3 a_position;
attribute vec3 a_normal; // Normais dos vértices
attribute vec3 a_color;

uniform mat4 u_matrix;      // Matriz de transformação (Model-View-Projection)
uniform mat4 u_normalMatrix; // Matriz para transformar as normais corretamente

varying vec3 v_color;
varying vec3 v_normal;
varying vec3 v_position;

void main() {
    // Calcula a posição do vértice transformado pela matriz de modelo, visão e projeção
    gl_Position = u_matrix * vec4(a_position, 1.0);
    
    // Passa a posição do vértice para o fragment shader para cálculo da iluminação
    v_position = (u_matrix * vec4(a_position, 1.0)).xyz;
    
    // Aplica a matriz normal para transformar corretamente as normais
    v_normal = (u_normalMatrix * vec4(a_normal, 0.0)).xyz;
    
    // Passa a cor do vértice para o fragment shader
    v_color = a_color;
}
`;

// Fragment Shader
const fragmentShaderSource = `
precision mediump float;

varying vec3 v_color;
varying vec3 v_normal;
varying vec3 v_position;

uniform vec3 u_lightPosition;  // Posição da luz
uniform vec3 u_lightColor;     // Cor da luz
uniform vec3 u_viewPosition;   // Posição da câmera
uniform vec3 u_ambientColor;   // Cor ambiente

void main() {
    // Normaliza as normais
    vec3 normal = normalize(v_normal);

    // Calcula o vetor direção da luz
    vec3 lightDir = normalize(u_lightPosition - v_position); // Direção da luz

    // Componente difusa (intensidade aumentada)
    float diff = max(dot(normal, lightDir), 0.0);
    vec3 diffuse = diff * u_lightColor * 1.2; // Intensidade da luz difusa aumentada

    // Componente especular (Phong, intensidade aumentada)
    vec3 viewDir = normalize(u_viewPosition - v_position);
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 16.0); // Intensidade da especular com "dureza" ajustada
    vec3 specular = spec * u_lightColor * 1.0; // Intensidade da luz especular aumentada

    // Componente ambiente (intensidade aumentada)
    vec3 ambient = u_ambientColor * 0.9; // Luz ambiente aumentada

    // Reflexão (melhorada, sem textura)
    float reflectFactor = max(dot(viewDir, reflectDir), 0.0);
    vec3 reflection = reflectFactor * u_lightColor * 0.4; // Reflexo moderado

    // Melhora o reflexo para uma transição mais suave com base no ângulo
    float fresnelFactor = pow(1.0 - max(dot(viewDir, normal), 0.0), 3.0); // Fator Fresnel ajustado
    vec3 fresnelReflection = reflection * fresnelFactor * 1.0; // Reflexão baseado em Fresnel com intensidade aumentada

    // Soma todos os componentes (difusa, especular, ambiente e reflexo)
    vec3 result = (ambient + diffuse + specular + fresnelReflection) * v_color;

    // Limitar o valor máximo de cada componente para evitar que o objeto fique completamente branco
    result = min(result, vec3(1.0));

    gl_FragColor = vec4(result, 1.0);
}

`;

function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        throw new Error('Erro ao compilar shader');
    }

    return shader;
}

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        throw new Error('Erro ao linkar programa');
    }

    return program;
}

const program = createProgram(gl, vertexShader, fragmentShader);
gl.useProgram(program);

// Matrizes de transformação
const matrixLocation = gl.getUniformLocation(program, 'u_matrix');

// ZBuffer
gl.enable(gl.DEPTH_TEST);

// Habilita o multisample (não é necessário explicitamente no WebGL 1.0, mas garantido em 2.0)
if (gl.getContextAttributes().antialias) {
    console.log('MSAA está habilitado para suavização de bordas.');
} else {
    console.warn('MSAA não está disponível. Verifique o suporte da GPU.');
}

const camera_speed = vec3(0, 0, 0)

const camera = vec3(0, -5, 0)

// Definição do cubo (8 vértices e 6 faces)
let positions = [];

let colors = [];

let indices = [];

let normals = []