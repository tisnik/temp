const vertexShaderSource = `
    attribute vec3 position;
    attribute vec2 texcoord;
    varying vec2 vTexcoord;
    uniform mat4 umatrix;

    void main() {
        gl_Position = umatrix * vec4(position, 1);
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
    const divider = width / 8;

    let index = 0;
    for (j=0; j<height; j++) {
        for (i=0; i<width; i++) {
            const alpha = ((i&divider)==0^(j&divider)==0) * 255;
            array[index++] = 128;
            array[index++] = 256*i/width;
            array[index++] = 256*j/width;
            array[index++] = alpha;            // alfa slozka
        }
    }
    return array;
}

function matrix_identity() {
    return new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);
}

function matrix_translate(z) {
    return new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, z, 1
    ]);
}

function matrix_rotate_around_x(a) {
    const c = Math.cos(a);
    const s = Math.sin(a);
    return new Float32Array([
        1, 0, 0, 0,
        0, c, s, 0,
        0, -s, c, 0,
        0, 0, 0, 1
    ]);
}  

function matrix_rotate_around_y(a) {
    const c = Math.cos(a);
    const s = Math.sin(a);
    return new Float32Array([
        c, 0, -s, 0,
        0, 1, 0, 0,
        s, 0, c, 0,
        0, 0, 0, 1
    ]);
}

function matrix_perspective_fov(fovy, aspect, near, far) {
    const f = 1.0 / Math.tan(fovy / 2);
    const nf = 1 / (near - far);
    return new Float32Array([
        f / aspect, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (far + near) * nf, -1,
        0, 0, (2 * far * near) * nf, 0
    ]);
}

function matrix_multiply(a, b) {
    const out = new Float32Array(16);
    for (let col = 0; col < 4; col++) {
        for (let row = 0; row < 4; row++) {
            out[col * 4 + row] =
              a[0 * 4 + row] * b[col * 4 + 0] +
              a[1 * 4 + row] * b[col * 4 + 1] +
              a[2 * 4 + row] * b[col * 4 + 2] +
              a[3 * 4 + row] * b[col * 4 + 3];
        }
    }
    return out;
}

// reference na objekt představující kreslicí plátno umístěné na webové stránce
const canvas = document.getElementById("web_gl_canvas");
if (!canvas) {
    throw new Error("Canvas with id 'web_gl_canvas' not found");
}
print("Canvas object retrieved");

// vytvoření a získání kontextu WebGL (3D grafika)
const gl = canvas.getContext("webgl", {
  depth: true,
  stencil: true
});
if (!gl) {
    throw new Error("WebGL is not supported or context creation failed");
}
if (gl.getParameter(gl.STENCIL_BITS) === 0) {
    throw new Error("WebGL stencil buffer is not available");
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

// omezeno tak, aby bylo možné později rotovat
const min_x = -0.5
const max_x = 0.5
const min_y = min_x
const max_y = max_x
const min_z = min_x
const max_z = max_x

const min_u = 0.0
const min_v = 0.0
const max_u = 1.0
const max_v = 1.0

// souřadnice vrcholů trojúhelníků + souřadnice v prostoru textury
const vertexes = [
    // přední stěna (2 trojúhelníky)
    min_x, min_y, max_z, min_u, min_v,
    max_x, min_y, max_z, max_u, min_v,
    max_x, max_y, max_z, max_u, max_v,

    min_x, min_y, max_z, min_u, min_v,
    max_x, max_y, max_z, max_u, max_v,
    min_x, max_y, max_z, min_u, max_v,

    // pravá stěna (2 trojúhelníky)
    max_x, min_y, max_z, min_u, min_v,
    max_x, min_y, min_z, max_u, min_v,
    max_x, max_y, min_z, max_u, max_v,

    max_x, min_y, max_z, min_u, min_v,
    max_x, max_y, min_z, max_u, max_v,
    max_x, max_y, max_z, min_u, max_v,

    // zadní stěna (2 trojúhelníky)
    max_x, min_y, min_z, min_u, min_v,
    min_x, min_y, min_z, max_u, min_v,
    min_x, max_y, min_z, max_u, max_v,

    max_x, min_y, min_z, min_u, min_v,
    min_x, max_y, min_z, max_u, max_v,
    max_x, max_y, min_z, min_u, max_v,

    // levá stěna (2 trojúhelníky)
    min_x, min_y, min_z, min_u, min_v,
    min_x, min_y, max_z, max_u, min_v,
    min_x, max_y, max_z, max_u, max_v,

    min_x, min_y, min_z, min_u, min_v,
    min_x, max_y, max_z, max_u, max_v,
    min_x, max_y, min_z, min_u, max_v,
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
                       3,                                // počet prvků v každém atributu
                       gl.FLOAT,                         // typ prvků
                       gl.FALSE,                         // data nejsou normalizována
                       5*Float32Array.BYTES_PER_ELEMENT, // velikost vertexu+texturovacích souřadnic v bajtech
                       0                                 // offset
);
gl.enableVertexAttribArray(p);

// seznam předávaný do vertex shaderu
gl.vertexAttribPointer(texLoc,
                       2,                                // počet prvků v každém atributu
                       gl.FLOAT,                         // typ prvků
                       gl.FALSE,                         // data nejsou normalizována
                       5*Float32Array.BYTES_PER_ELEMENT, // velikost vertexu+texturovacích souřadnic v bajtech
                       3*Float32Array.BYTES_PER_ELEMENT  // offset
);
gl.enableVertexAttribArray(texLoc);

// textura (prozatím primitivní)
const texture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, texture);
gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

const textureWidth = 16
const textureHeight = 16

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
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

// navázání na atribut ve shaderech
const samplerLoc = gl.getUniformLocation(program, "texture");
gl.uniform1i(samplerLoc, 0);

// spuštění programu
gl.useProgram(program);

// úhly pro rotaci krychle
let rotX = 0, rotY = 0;

// čas vykreslení posledního snímku
let lastTime = 0;

// navázání na proměnnou dostupnou ve vertex shaderu
const umatrix = gl.getUniformLocation(program, "umatrix");

// povolení Z-bufferu
gl.enable(gl.DEPTH_TEST);
gl.depthFunc(gl.LESS);

gl.clearDepth(1.0);

// nastavení barvy pro vymazání barvového bufferu
gl.clearColor(0, 0, 0, 1);

let scissor_x = 10;
let scissor_y = 70;
let scissor_dx = 1;
let scissor_dy = 1;


// vykreslení jednoho snímku
function draw(time) {
    // přečíst parametry nastavené na formuláři
    const enable_blending = document.getElementById("enable_blending").checked;
    const scissor_enabled = document.getElementById("enable_scissor").checked;

    // nastavení blending operace
    const blending_func_1_value = document.getElementById("blending_func_1").value;
    const blending_func_2_value = document.getElementById("blending_func_2").value;

    const blending_func_1 = gl[blending_func_1_value];
    const blending_func_2 = gl[blending_func_2_value];

    // barva na kterou se vymaže pozadí před vykreslením textury
    const r = document.getElementById("r").value;
    const g = document.getElementById("g").value;
    const b = document.getElementById("b").value;
    const a = document.getElementById("a").value;

    // přizpůsobíme se rychlosti vykreslování snímků
    const dt = (time - lastTime) * 0.001;
    lastTime = time;

    // výpočet 
    rotX += dt * 0.8;
    rotY += dt * 1.0;

    // povolení či zákaz blendingu
    if (enable_blending) {
        gl.enable(gl.BLEND);
    } else {
        gl.disable(gl.BLEND);
    }
    // nastavení blendingu
    gl.blendFunc(blending_func_1, blending_func_2);

    // transformace souřadnic: z normalizovaných souřadnic na souřadnice na plátnu
    gl.viewport(0, 0, canvas.width, canvas.height);

    // nastavení barvy pro vymazání barvového bufferu
    gl.clearColor(r, g, b, a);

    // vymazání barvového bufferu i paměti hloubky
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // transformační matice
    const aspect = canvas.width / canvas.height;
    const perspective_fov = matrix_perspective_fov(Math.PI / 3, aspect, 0.5, 100);
    const translate = matrix_translate(-2.0);
    const rx = matrix_rotate_around_x(rotX);
    const ry = matrix_rotate_around_y(rotY);
    const matrix = matrix_multiply(perspective_fov, matrix_multiply(translate, matrix_multiply(rx, ry)));

    // předat matici do vykreslovací pipeline
    gl.uniformMatrix4fv(umatrix, false, new Float32Array(matrix));

    // posun čtverce s "nůžkami"
    scissor_x += scissor_dx;
    scissor_y += scissor_dy;

    // vyřešení nárazů do okrajů
    const scissor_size = 120;
    if (scissor_x < 0) {
        scissor_dx = 1;
    }
    if (scissor_y < 0) {
        scissor_dy = 1;
    }
    if (scissor_x + scissor_size > canvas.width) {
        scissor_dx = -1;
    }
    if (scissor_y + scissor_size > canvas.height) {
        scissor_dy = -1;
    }

    if (scissor_enabled) {
        // oříznutí části scény
        gl.enable(gl.SCISSOR_TEST);
        gl.scissor(scissor_x, scissor_y, scissor_size, scissor_size);
    } else {
        gl.disable(gl.SCISSOR_TEST);
    }

    // vykreslení trojúhelníků s předáním souřadnic vertexů a texturovacích souřadnic
    gl.drawArrays(gl.TRIANGLES, 0, 36-12);

    // vyžádání vykreslení dalšího snímku
    requestAnimationFrame(draw);
}

// vyžádání vykreslení dalšího snímku
requestAnimationFrame(draw);

