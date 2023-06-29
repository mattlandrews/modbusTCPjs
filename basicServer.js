"use strict";

const MBSERVER = require("./src/modbusTCPServer.js");

let mbServer = new MBSERVER();

mbServer.host = "127.0.0.1";
mbServer.port = 50200;

mbServer.on("readHoldingRegisters", (request, response) => {
    let data = [];
    let a = request.readAddress;
    let b = request.readAddress + request.readLength;
    for (let i=a; i<b; i++) {
        data.push(i);
    }
    response(data);
});

mbServer.on("writeHoldingRegisters", (request, response) => {
    response(true);
});

mbServer.listen();