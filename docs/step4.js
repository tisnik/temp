// reference na objekt představující kreslicí plátno umístěné na webové stránce
const canvas = document.getElementById("web_gl_canvas");

// vytvoření a získání kontextu WebGL (3D grafika)
const gl = canvas.getContext("webgl");

// transformace souřadnic: z normalizovaných souřadnic na souřadnice na plátnu
gl.viewport(0, 0, canvas.width, canvas.height);

// nastavení barvy pro vymazání barvového bufferu
gl.clearColor(0.8, 1.0, 0.8, 1);

// vymazání barvového bufferu
gl.clear(gl.COLOR_BUFFER_BIT);
