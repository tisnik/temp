const vertexShaderSource = `
    void main() {
        gl_Position = vec4(0.0, 0.0, 0, 1);
        gl_PointSize = 20.0;
    }
`

const fragmentShaderSource = `
    precision mediump float;

    void main() {
        gl_FragColor = vec4(1, 0, 0, 1);
    }
`

// reference na objekt představující kreslicí plátno umístěné na webové stránce
const canvas = document.getElementById("web_gl_canvas");

// vytvoření a získání kontextu WebGL (3D grafika)
const gl = canvas.getContext("webgl");

// překlad vertex shaderu
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);

// překlad fragment shaderu
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);

// registrace obou shaderů
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

// transformace souřadnic: z normalizovaných souřadnic na souřadnice na plátnu
gl.viewport(0, 0, canvas.width, canvas.height);

// nastavení barvy pro vymazání barvového bufferu
gl.clearColor(0, 0, 0, 1);

// vymazání barvového bufferu
gl.clear(gl.COLOR_BUFFER_BIT);

// spuštění programu
gl.useProgram(program);

// vykreslení jednoho bodu (nepředáváme souřadnice)
gl.drawArrays(gl.POINTS, 0, 1);

