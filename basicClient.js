"use strict";

const MBCLIENT = require("./src/modbusTCPClient.js");

let mbClient = new MBCLIENT();

mbClient.host = "127.0.0.1";
mbClient.port = 50200;

let transaction = 0;

function query_00 () {
    if (! mbClient.awaitingReply) {
        transaction = (transaction < 65535) ? (transaction + 1) : 0;
        mbClient.readHoldingRegisters(transaction, 1, 239, Math.floor(Math.random() * 124) + 1)
            .then((data) => { setTimeout(() => { query_01(); }, 83 ); })
            .catch((err) => { console.log(err); });
    }
}

function query_01 () {
    if (! mbClient.awaitingReply) {
        transaction = (transaction < 65535) ? (transaction + 1) : 0;
        mbClient.writeHoldingRegisters(transaction, 1, 1, [0,0])
            .then(() => { setTimeout(() => { query_00(); }, 83 ); })
            .catch((err) => { console.log(err); });
    }
}
query_00();