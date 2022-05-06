"use strict";

const MBCLIENT = require("./src/modbusTCPClient.js");

let mbClient = new MBCLIENT();

mbClient.host = "127.0.0.1";
mbClient.port = 502;

mbClient.readHoldingRegisters(1,0,1)
    .then((data) => {
        console.log(data);
        process.exit(0);
    })
    .catch((err) => {
        console.log(err);
    });