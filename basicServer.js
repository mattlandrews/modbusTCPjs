"use strict";

const MBSERVER = require("./src/modbusTCPServer.js");

let mbServer = new MBSERVER();

mbServer.host = "127.0.0.1";
mbServer.port = 502;

mbServer.on("readHoldingRegisters", (req, callback) => {
    if ((req.address === 0) && (req.numAddresses === 1)) {
        callback(0);
    }
    else {
        callback();
    }
});

mbServer.listen();