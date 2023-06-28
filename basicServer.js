"use strict";

const MBSERVER = require("./src3/modbusTCPServer.js");

let mbServer = new MBSERVER();

mbServer.host = "127.0.0.1";
mbServer.port = 50200;

mbServer.listen();

setInterval(() => {
    console.log(mbServer.getConnections());
}, 1000);