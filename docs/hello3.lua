print("Hello World!")

local js = require("js")

local document = js.global.document

local div = document:getElementById("output")
div.innerText = "Hello, world!"

