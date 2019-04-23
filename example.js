"use strict";

const ModbusTCP = require("./src/ModbusTCP.js");

let mbtcp = new ModbusTCP();

mbtcp.on("connect", function () { console.log("Connected."); });
mbtcp.on("error", function (err) { console.error("Error: " + err); });
mbtcp.connect("127.0.0.1", 502);
