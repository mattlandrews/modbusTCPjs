"use strict";

const MBSERVER = require("./src/modbusTCPServer.js");

const MAX_HOLDING_REGS = 120;
let holdingRegisters = new Array(MAX_HOLDING_REGS);

let mbServer = new MBSERVER();

mbServer.host = "127.0.0.1";
mbServer.port = 503;
mbServer.on("readHoldingRegisters", (request, callback) => {
    if ((request.address < 0) || ((request.address + request.numAddresses) > MAX_HOLDING_REGS)) { callback(); }
    else { callback(holdingRegisters.slice(request.address, (request.address + request.numAddresses))); }
});

mbServer.listen();

const term = require("terminal-kit").terminal;

setInterval(() => {
    term.clear();
    term("Modbus Server Connections:");
    mbServer.connections.forEach((c) => {
        term.nextLine();
        term("    " + c.socket.remoteAddress + ":" + c.socket.remotePort);
        term("   Reqs/sec: " + c.stats.requestsPerSecond);
        term("   Total Reqs: " + c.stats.numTotalRequests);
        term("   Total Errs: " + c.stats.numTotalErrors);
    });
}, 1000);