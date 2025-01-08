positions = new Float32Array(positions)
colors = new Float32Array(colors)
indices = new Uint16Array(indices)
normals = new Float32Array(normals)

// Buffer de posições
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
gl.enableVertexAttribArray(positionAttributeLocation);
gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

// Buffer de cores
const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

const colorAttributeLocation = gl.getAttribLocation(program, 'a_color');
gl.enableVertexAttribArray(colorAttributeLocation);
gl.vertexAttribPointer(colorAttributeLocation, 3, gl.FLOAT, false, 0, 0);

// Buffer de índices
const indexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

// Buffer de normais
const normalBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);

const normalAttributeLocation = gl.getAttribLocation(program, 'a_normal');
gl.enableVertexAttribArray(normalAttributeLocation);
gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);

// Parâmetros da luz
const lightPosition = [0, 5, 10];
const lightColor = [1.0, 1.0, 1.0]; // Luz branca
const ambientColor = [0.3, 0.3, 0.3]; // Luz ambiente suave

// Passando a posição da luz para o shader
gl.uniform3fv(gl.getUniformLocation(program, 'u_lightPosition'), lightPosition);
gl.uniform3fv(gl.getUniformLocation(program, 'u_lightColor'), lightColor);
gl.uniform3fv(gl.getUniformLocation(program, 'u_ambientColor'), ambientColor);

// Passando a posição da câmera para o shader
gl.uniform3fv(gl.getUniformLocation(program, 'u_viewPosition'), camera);

const modelMatrix = mat4(); // Matriz de modelo
const normalMatrix = mat4();

// No loop de renderização, sempre atualize a matriz normal
invert(normalMatrix, modelMatrix);
transpose(normalMatrix, normalMatrix);

const normalMatrixLocation = gl.getUniformLocation(program, 'u_normalMatrix');
gl.uniformMatrix4fv(normalMatrixLocation, false, normalMatrix);