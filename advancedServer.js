"use strict";

const MBSERVER = require("./src/modbusTCPServer.js");

const RED = "\u001b[31m";
const WHITE = "\u001b[37m";
const RESET = "\u001b[0m";

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

setInterval(() => {
    console.clear();
    mbServer.getErrors().forEach((d) => { 
        if (d.name === "ModbusError") {
            console.log(WHITE + "[" + d.time + "] " + RED + d.name + ": " + d.message + RESET);
        }
        else {
            console.log(d.name + ": " + d.message);
        }
    });
    console.log("%o", mbServer.getStats());
}, 1000);