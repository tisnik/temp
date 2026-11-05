local vertexShaderSource = [[
    attribute vec2 position;

    void main() {
        gl_Position = vec4(position, 0, 1);
    }
]]

local fragmentShaderSource = [[
    precision mediump float;

    void main() {
        gl_FragColor = vec4(0.7, 0.7, 0.0, 1);
    }
]]

local function log(message)
    print(message)
end

local js = require("js")

local document = js.global.document
local Float32Array = js.global.Float32Array

local function log(msg)
    js.global.console:log(msg)
end

-- reference na objekt představující kreslicí plátno umístěné
-- na webové stránce
local canvas = document:getElementById("web_gl_canvas")
if not canvas then
    error("Canvas with id 'web_gl_canvas' not found")
end
log("Canvas object retrieved")

-- vytvoření a získání kontextu WebGL (3D grafika)
local gl = canvas:getContext("webgl")
if not gl then
    error("WebGL is not supported or context creation failed")
end
log("WebGL context created")

-- vytvoření fragment shaderu
local vertexShader = gl:createShader(gl.VERTEX_SHADER)
if not vertexShader then
    error("Failed to create vertex shader.")
end
log("Vertex shader created")

-- překlad vertex shaderu
gl:shaderSource(vertexShader, vertexShaderSource)
gl:compileShader(vertexShader)
if not gl:getShaderParameter(vertexShader, gl.COMPILE_STATUS) then
    local logText = gl:getShaderInfoLog(vertexShader)
    gl:deleteShader(vertexShader)
    error("Vertex shader compile failed: " .. logText)
end
log("Vertex shader compiled")

-- vytvoření fragment shaderu
local fragmentShader = gl:createShader(gl.FRAGMENT_SHADER)
if not fragmentShader then
    error("Failed to create fragment shader.")
end
log("Fragment shader created")

-- překlad fragment shaderu
gl:shaderSource(fragmentShader, fragmentShaderSource)
gl:compileShader(fragmentShader)
if not gl:getShaderParameter(fragmentShader, gl.COMPILE_STATUS) then
    local logText = gl:getShaderInfoLog(fragmentShader)
    gl:deleteShader(fragmentShader)
    error("Fragment shader compile failed: " .. logText)
end
log("Fragment shader compiled")

-- registrace obou shaderů
local program = gl:createProgram()
if not program then
    error("Failed to create program.")
end
log("Program created")

gl:attachShader(program, vertexShader)
gl:attachShader(program, fragmentShader)
log("Shaders attached to the program")

gl:linkProgram(program)
if not gl:getProgramParameter(program, gl.LINK_STATUS) then
    local logText = gl:getProgramInfoLog(program)
    gl:deleteProgram(program)
    error("Program link failed: " .. logText)
end
log("Program linked")

-- souřadnice vrcholů trojúhelníku
local vertexes = {
   -- x   y  
   -0.9, -0.8,
    0.9, -0.8,
    0.0,  0.7,
}

-- buffer, do kterého se překopírují souřadnice bodu
local vertexBuffer = gl:createBuffer()
if not vertexBuffer then
    error("Failed to create buffer.")
end
log("Vertex buffer created")
gl:bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)

local data = js.new(Float32Array, vertexes)
for i = 1, #vertexes do
    data[i - 1] = vertexes[i]
end

gl:bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
log("Vertex buffer filled-in by vertexes")

-- navázání na parametr předávaný do vertex shaderu
local p = gl:getAttribLocation(program, "position")
if p == -1 then
    error("Attribute 'position' not found in shader program")
end
log("Attribute 'position' found in shader program")

-- seznam předávaný do vertex shaderu
gl:vertexAttribPointer(
    p,
    2,
    gl.FLOAT,
    false,
    2 * 4,
    0
)
gl:enableVertexAttribArray(p)

-- transformace souřadnic:
-- z normalizovaných souřadnic na souřadnice na plátnu
gl:viewport(0, 0, canvas.width, canvas.height)

-- nastavení barvy pro vymazání barvového bufferu
gl:clearColor(0, 0, 0, 1)

-- vymazání barvového bufferu
gl:clear(gl.COLOR_BUFFER_BIT)

-- spuštění programu
gl:useProgram(program)

-- vykreslení trojúhelníku
gl:drawArrays(gl.TRIANGLES, 0, 3)

