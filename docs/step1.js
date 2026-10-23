// Technologie WebGL a OpenGL ES
// -----------------------------
//
// Webová stránka s kreslicím plátnem (canvasem)
//
// Použito v článku:
//
// WebGL: tvorba 3D grafiky s využitím programovatelné vykreslovací pipeline
// https://www.root.cz/clanky/webgl-tvorba-3d-grafiky-s-vyuzitim-programovatelne-vykreslovaci-pipeline/

// reference na objekt představující kreslicí plátno umístěné na webové stránce
const canvas = document.getElementById("web_gl_canvas");

// zobrazení základních informací o získaném objektu
window.alert("Canvas: " + canvas.width + "x" + canvas.height);

