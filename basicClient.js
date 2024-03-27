"use strict";

const MBCLIENT = require("./src/modbusTCPClient.js");

let mbClient = new MBCLIENT();

mbClient.host = "127.0.0.1";
mbClient.port = 50200;

let transaction = 0;

function query_00 () {
    if (! mbClient.awaitingReply) {
        transaction = (transaction < 65535) ? (transaction + 1) : 0;
        mbClient.readHoldingRegisters(transaction, 1, 239, 125)
            .then((data) => { if (data != null) { setTimeout(() => { query_00(); }, 1000 ); } })
            .catch((err) => { console.log(err); });
    }
}
query_00();