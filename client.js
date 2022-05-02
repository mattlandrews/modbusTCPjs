"use strict";

const MBCLIENT = require("./src/modbusTCPClient.js");

let mbClient = new MBCLIENT();
mbClient.host = "127.0.0.1";

mbClient.writeHoldingRegisters(1,0,[0,0,0])
    .then(() => {
        return mbClient.readHoldingRegisters(1,0,3)
    })
    .then((data) => {
        return mbClient.writeHoldingRegisters(1,0,[1,2,3]);
    })
    .then(() => {
        return mbClient.readHoldingRegisters(1,0,3);
    })
    .then((data) => {
        debugger;
    })
    .catch((err) => { throw err; });