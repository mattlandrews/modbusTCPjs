"use strict";

const MBSERVER = require("./src/modbusTCPServer.js");

const RED = "\u001b[31m";
const WHITE = "\u001b[37m";
const RESET = "\u001b[0m";

const numServers = 2;

let holdingRegisters = new Array(65535).fill(0);
let mbServer = [];

for (let i=0; i<numServers; i++) {

    mbServer.push(new MBSERVER());

    mbServer[i].host = "127.0.0.1";
    mbServer[i].port = 50200 + i;
    
    mbServer[i].on("readHoldingRegisters", (request, response) => {
        let data = holdingRegisters.slice(request.readAddress, (request.readAddress + request.readLength));
        response(data);
    });

    mbServer[i].on("writeHoldingRegisters", (request, response) => {
        request.data.forEach((d,i) => { holdingRegisters[request.writeAddress + i] = d; });
        response(true);
    })

    mbServer[i].listen();
}

setInterval(() => {
    console.clear();
    for (let i=0; i<numServers; i++) {
        mbServer[i].getErrors().forEach((d) => { 
            if (d.name === "ModbusError") {
                console.log(WHITE + "[" + d.time + "] " + RED + d.name + ": " + d.message + RESET);
            }
            else {
                console.log(d.name + ": " + d.message);
            }
        });
    }
    let stats = {};
    Object.keys(mbServer[0].getStats()).forEach((d) => { stats[d] = 0; });
    for (let i=0; i<numServers; i++) {
        let s = mbServer[i].getStats();
        let k = Object.keys(s);
        k.forEach((d) => { stats[d] += s[d]; });
    }
    console.log("%o", stats);
}, 1000);