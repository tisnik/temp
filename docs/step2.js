// reference na objekt představující kreslicí plátno umístěné na webové stránce
const canvas = document.getElementById("web_gl_canvas");

// vytvoření a získání kontextu 2D (2D grafika)
const ctx = canvas.getContext("2d");

// styl vykreslování
ctx.strokeStyle = "red"
ctx.lineWidth = 5

// cesta tvořená kružnicovým obloukem
ctx.beginPath()
ctx.arc(canvas.width/2, canvas.height/2, canvas.width/3, 0, 2 * Math.PI);
ctx.stroke();

