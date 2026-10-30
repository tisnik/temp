const vertexShaderSource = `
    attribute vec2 position;
    attribute vec2 texcoord;
    varying vec2 vTexcoord;

    void main() {
        gl_Position = vec4(position, 0, 1);
        vTexcoord = texcoord;
    }
`

const fragmentShaderSource = `
    precision mediump float;
    varying vec2 vTexcoord;
    uniform sampler2D texture;

    void main() {
        gl_FragColor = texture2D(texture, vTexcoord);
    }
`

function print(message) {
    console.log(message);
}

function makeTexture(width, height) {
    const array = new Array(width*height*4);

    let index = 0;
    for (j=0; j<height; j++) {
        for (i=0; i<width; i++) {
            const c = ((i&0x20)==0^(j&0x20)==0) * 255;
            array[index++] = c;
            array[index++] = i;
            array[index++] = j;
            array[index++] = 255;            // alfa slozka
        }
    }
    return array;
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

const min_x = -0.9
const max_x = 0.9
const min_y = min_x
const max_y = max_x

// souřadnice vrcholů trojúhelníku + souřadnice v prostoru textury
const vertexes = [
  // x, y,   u, v
   min_x, min_y, 0.0, 0.0,
   min_x, max_y, 0.0, 1.0,
   max_x, max_y, 1.0, 1.0,

   min_x, min_y, 0.0, 0.0,
   max_x, max_y, 2.0, 2.0,
   max_x, min_y, 2.0, 0.0,
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

// navázání na parametr předávaný do vertex shaderu
const texLoc = gl.getAttribLocation(program, "texcoord");
if (p === -1) {
    throw new Error("Attribute 'texcoord' not found in shader program");
}
print("Attribute 'texcoord' found in shader program")

// seznam předávaný do vertex shaderu
gl.vertexAttribPointer(p,
                       2,                                // počet prvků v každém atributu
                       gl.FLOAT,                         // typ prvků
                       gl.FALSE,                         // data nejsou normalizována
                       4*Float32Array.BYTES_PER_ELEMENT, // velikost vertexu+texturovacích souřadnic v bajtech
                       0                                 // offset
);
gl.enableVertexAttribArray(p);

// seznam předávaný do vertex shaderu
gl.vertexAttribPointer(texLoc,
                       2,                                // počet prvků v každém atributu
                       gl.FLOAT,                         // typ prvků
                       gl.FALSE,                         // data nejsou normalizována
                       4*Float32Array.BYTES_PER_ELEMENT, // velikost vertexu+texturovacích souřadnic v bajtech
                       2*Float32Array.BYTES_PER_ELEMENT  // offset
);
gl.enableVertexAttribArray(texLoc);

// textura (prozatím primitivní)
const texture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, texture);
gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

const textureWidth = 256
const textureHeight = 256

// textura
textureArray = makeTexture(textureWidth, textureHeight);
const texels = new Uint8Array(textureArray);

gl.texImage2D(gl.TEXTURE_2D,      // typ textury: zde 2D textura
              0,                  // úroveň detailu
              gl.RGBA,            // počet barvových komponent (zde 4)
              textureWidth,       // horizontální rozlišení textury
              textureHeight,      // vertikální rozlišení textury
              0,                  // šířka okraje textury
              gl.RGBA,            // formát uložení texelů
              gl.UNSIGNED_BYTE,   // typ každé barvové složky texelu
              texels              // pole texelů
);

// způsob vykreslení textury
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

// navázání na atribut ve shaderech
const samplerLoc = gl.getUniformLocation(program, "texture");
gl.uniform1i(samplerLoc, 0);

// transformace souřadnic: z normalizovaných souřadnic na souřadnice na plátnu
gl.viewport(0, 0, canvas.width, canvas.height);

// nastavení barvy pro vymazání barvového bufferu
gl.clearColor(0, 0, 0, 1);

// vymazání barvového bufferu
gl.clear(gl.COLOR_BUFFER_BIT);

// spuštění programu
gl.useProgram(program);

// vykreslení dvojice trojúhelníků
gl.drawArrays(gl.TRIANGLES, 0, 6);

