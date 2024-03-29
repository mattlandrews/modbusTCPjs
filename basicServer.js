"use strict";

const MBSERVER = require("./src/modbusTCPServer.js");

let mbServer = new MBSERVER();

mbServer.host = "127.0.0.1";
mbServer.port = 50200;

let holdingRegisters = new Uint16Array(500);

mbServer.on("readHoldingRegisters", (request, response) => {
    let a = request.readAddress;
    let b = request.readAddress + request.readLength;
    let data = Array.from(holdingRegisters.slice(a, b));
    process.stdout.write(request.toString());
    response(data);
});

mbServer.on("writeHoldingRegisters", (request, response) => {
    process.stdout.write(request.toString());
    response(true);
});

mbServer.on("response", (response) => {
    process.stdout.write(response.toString());
});

mbServer.listen();