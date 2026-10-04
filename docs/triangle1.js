const vertexShaderSource = `
    attribute vec2 position;

    void main() {
        gl_Position = vec4(position, 0, 1);
    }
`

const fragmentShaderSource = `
    precision mediump float;

    void main() {
        gl_FragColor = vec4(0.7, 0.7, 0.0, 1);
    }
`

function print(message) {
    console.log(message);
}

// reference na objekt představující kreslicí plátno umístěné na webové stránce
const canvas = document.getElementById("web_gl_canvas");
if (!canvas) {
    throw new Error("Canvas with id 'web_gl_canvas' not found");
}
print("Canvas object retrieved");

// vytvoření a získání kontextu WebGL (3D grafika)
const gl = canvas.getContext("webgl");
if (!gl) {
    throw new Error("WebGL is not supported or context creation failed");
}
print("WebGL context created");

// vytvoření vertex shaderu
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
if (!vertexShader) {
    throw new Error("Failed to create vertex shader.");
}
print("Vertex shader created");

// překlad vertex shaderu
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);
if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(vertexShader);
    gl.deleteShader(vertexShader);
    throw new Error(`Vertex shader compile failed: ${log}`);
}
print("Vertex shader compiled");

// vytvoření fragment shaderu
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
if (!fragmentShader) {
    throw new Error("Failed to create fragment shader.");
}
print("Fragment shader created");

// překlad fragment shaderu
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);
if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(fragmentShader);
    gl.deleteShader(fragmentShader);
    throw new Error(`fragment shader compile failed: ${log}`);
}
print("Fragment shader compiled");

// registrace obou shaderů
const program = gl.createProgram();
if (!program) {
    throw new Error("Failed to create program.");
}
print("Program created");

gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
print("Shaders attached to the program");

gl.linkProgram(program);
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`Program link failed: ${log}`);
}
print("Program linked");

// souřadnice vrcholů trojúhelníku
const vertexes = [
   // x   y  
   -0.9, -0.8,
    0.9, -0.8,
    0.0,  0.7,
];

// buffer, do kterého se překopírují souřadnice bodu
const vertexBuffer = gl.createBuffer();
if (!vertexBuffer) {
    throw new Error("Failed to create buffer.");
}
print("Vertex buffer created");
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

const data = new Float32Array(vertexes);
gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
print("Vertex buffer filled-in by vertexes");

// navázání na parametr předávaný do vertex shaderu
const p = gl.getAttribLocation(program, "position");
if (p === -1) {
    throw new Error("Attribute 'position' not found in shader program");
}
print("Attribute 'position' found in shader program")


// seznam předávaný do vertex shaderu
gl.vertexAttribPointer(p,
                       2,                                // počet prvků v každém atributu
                       gl.FLOAT,                         // typ prvků
                       gl.FALSE,                         // data nejsou normalizována
                       2*Float32Array.BYTES_PER_ELEMENT, // velikost vertexu v bajtech
                       0                                 // offset
);
gl.enableVertexAttribArray(p);

// transformace souřadnic: z normalizovaných souřadnic na souřadnice na plátnu
gl.viewport(0, 0, canvas.width, canvas.height);

// nastavení barvy pro vymazání barvového bufferu
gl.clearColor(0, 0, 0, 1);

// vymazání barvového bufferu
gl.clear(gl.COLOR_BUFFER_BIT);

// spuštění programu
gl.useProgram(program);

// vykreslení trojúhelníku
gl.drawArrays(gl.TRIANGLES, 0, 3);

