"use strict";

const MBSERVER = require("./src/modbusTCPServer.js");

let mbServer = new MBSERVER();

mbServer.host = "127.0.0.1";
mbServer.port = 50200;

mbServer.on("readHoldingRegisters", (req, callback) => {
    if ((req.readAddress === 0) && (req.readLength === 1)) {
        callback([0]);
    }
    else {
        callback(false);
    }
});

mbServer.on("writeHoldingRegisters", (req, callback) => {
    if ((req.writeAddress === 0) && (req.writeLength === 1)) {
        callback(true);
    }
    else {
        callback (false);
    }
});

mbServer.listen();