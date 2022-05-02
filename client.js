"use strict";

const MBCLIENT = require("./src/modbusTCPClient.js");

let mbClient = new MBCLIENT();
mbClient.host = "127.0.0.1";
mbClient.connect();
setTimeout(() => {
    mbClient.readHoldingRegisters(1, 0, 1, (data) => {
        mbClient.writeHoldingRegisters(1,0,[1,2,3,4,5,6,7], () => {
            mbClient.readHoldingRegisters(1, 0, 1, (data) => {
                debugger;
            });
        });
    });
}, 1000);