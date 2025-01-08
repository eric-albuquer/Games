const mat4 = function () {
    return new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ])
}

// function transpose(m) {
//     for (let i = 0; i < 4; i++) {
//         for (let j = i + 1; j < 4; j++) {
//             [m[i * 4 + j], m[j * 4 + i]] = [m[j * 4 + i], m[i * 4 + j]];
//         }
//     }
// }

function setMatrix(m, v) {
    for (let i = 0; i < m.length; i++) {
        m[i] = v[i]
    }
}

function perspective(m, fov, aspect_ratio, near, far) {
    const fn = 1 / (near - far);

    const halfFov = 1 / Math.tan(fov / 2);

    m[0] = halfFov * aspect_ratio;
    m[5] = halfFov;
    m[10] = (far + near) * fn;
    m[11] = -1;
    m[14] = 2 * far * near * fn;

    // Os valores 1, 0, e -1 para as outras entradas podem ser mantidos como constantes
    m[1] = m[2] = m[3] = 0;
    m[4] = m[6] = m[7] = 0;
    m[8] = m[9] = m[12] = m[13] = m[15] = 0;
}


function rotateX(matrix, theta) {
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);

    // Cópia temporária dos valores que serão modificados
    const m4 = matrix[4], m5 = matrix[5], m6 = matrix[6], m7 = matrix[7];
    const m8 = matrix[8], m9 = matrix[9], m10 = matrix[10], m11 = matrix[11];

    // Atualiza os elementos da matriz
    matrix[4] = m4 * cosTheta + m8 * sinTheta;
    matrix[5] = m5 * cosTheta + m9 * sinTheta;
    matrix[6] = m6 * cosTheta + m10 * sinTheta;
    matrix[7] = m7 * cosTheta + m11 * sinTheta;

    matrix[8] = -m4 * sinTheta + m8 * cosTheta;
    matrix[9] = -m5 * sinTheta + m9 * cosTheta;
    matrix[10] = -m6 * sinTheta + m10 * cosTheta;
    matrix[11] = -m7 * sinTheta + m11 * cosTheta;
}


function rotateY(matrix, theta) {
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);

    // Cópia temporária dos valores que serão modificados
    const m0 = matrix[0], m1 = matrix[1], m2 = matrix[2], m3 = matrix[3];
    const m8 = matrix[8], m9 = matrix[9], m10 = matrix[10], m11 = matrix[11];

    // Atualiza os elementos da matriz
    matrix[0] = m0 * cosTheta - m8 * sinTheta;
    matrix[1] = m1 * cosTheta - m9 * sinTheta;
    matrix[2] = m2 * cosTheta - m10 * sinTheta;
    matrix[3] = m3 * cosTheta - m11 * sinTheta;
    matrix[8] = m0 * sinTheta + m8 * cosTheta;
    matrix[9] = m1 * sinTheta + m9 * cosTheta;
    matrix[10] = m2 * sinTheta + m10 * cosTheta;
    matrix[11] = m3 * sinTheta + m11 * cosTheta;
}


function translate(matrix, x, y, z) {
    matrix[12] += matrix[0] * x + matrix[4] * y + matrix[8] * z;
    matrix[13] += matrix[1] * x + matrix[5] * y + matrix[9] * z;
    matrix[14] += matrix[2] * x + matrix[6] * y + matrix[10] * z;
    matrix[15] += matrix[3] * x + matrix[7] * y + matrix[11] * z;
}

const transpose=function(t,n){if(t===n){var r=n[1],a=n[2],e=n[3],u=n[6],o=n[7],i=n[11];t[1]=n[4],t[2]=n[8],t[3]=n[12],t[4]=r,t[6]=n[9],t[7]=n[13],t[8]=a,t[9]=u,t[11]=n[14],t[12]=e,t[13]=o,t[14]=i}else t[0]=n[0],t[1]=n[4],t[2]=n[8],t[3]=n[12],t[4]=n[1],t[5]=n[5],t[6]=n[9],t[7]=n[13],t[8]=n[2],t[9]=n[6],t[10]=n[10],t[11]=n[14],t[12]=n[3],t[13]=n[7],t[14]=n[11],t[15]=n[15];return t}
const invert=function(t,n){var r=n[0],a=n[1],e=n[2],u=n[3],o=n[4],i=n[5],s=n[6],c=n[7],f=n[8],M=n[9],h=n[10],l=n[11],v=n[12],d=n[13],b=n[14],m=n[15],p=r*i-a*o,P=r*s-e*o,A=r*c-u*o,E=a*s-e*i,O=a*c-u*i,R=e*c-u*s,y=f*d-M*v,q=f*b-h*v,x=f*m-l*v,_=M*b-h*d,Y=M*m-l*d,L=h*m-l*b,S=p*L-P*Y+A*_+E*x-O*q+R*y;if(!S)return null;return S=1/S,t[0]=(i*L-s*Y+c*_)*S,t[1]=(e*Y-a*L-u*_)*S,t[2]=(d*R-b*O+m*E)*S,t[3]=(h*O-M*R-l*E)*S,t[4]=(s*x-o*L-c*q)*S,t[5]=(r*L-e*x+u*q)*S,t[6]=(b*A-v*R-m*P)*S,t[7]=(f*R-h*A+l*P)*S,t[8]=(o*Y-i*x+c*y)*S,t[9]=(a*x-r*Y-u*y)*S,t[10]=(v*O-d*A+m*p)*S,t[11]=(M*A-f*O-l*p)*S,t[12]=(i*q-o*_-s*y)*S,t[13]=(r*_-a*q+e*y)*S,t[14]=(d*P-v*E-b*p)*S,t[15]=(f*E-M*P+h*p)*S,t}

function vec3(x, y, z){
    return new Float32Array([x, y, z])
}

function vec3Add(a, b){
    for (let i = 0; i < 3; i++) {
        a[i] += b[i]
    }
}

function vec3mul(v, s){
    for (let i = 0; i < 3; i++) {
        v[i] *= s
    }
}

// Calcula a magnitude (módulo) de um vetor
function vec3Magnitude(v) {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
}

// Normaliza o vetor v (divide cada componente pela magnitude)
function vec3Normalize(v) {
    const mag = vec3Magnitude(v);
    if (mag === 0) return;  // Evitar divisão por zero
    vec3mul(v, 1 / mag);  // Normaliza o vetor
}

function color(r, g, b){
    return new Float32Array([r / 256, g / 256, b / 256])
}