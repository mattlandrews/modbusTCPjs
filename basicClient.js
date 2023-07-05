"use strict";

const MBCLIENT = require("./src/modbusTCPClient.js");

let mbClient = new MBCLIENT();

mbClient.host = "127.0.0.1";
mbClient.port = 50200;

let transaction = 0;

function query_00 () {
    if (! mbClient.awaitingReply) {
        mbClient.readHoldingRegisters(transaction++, 1, 0, 3)
            .then((data) => { console.log(data); })
            .catch((err) => { console.log(err); });
    }
}

setInterval(query_00, 100);