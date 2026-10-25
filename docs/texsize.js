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

const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);

document.getElementById("tsize").innerHTML = maxTextureSize + "&times;" + maxTextureSize + " texels";

