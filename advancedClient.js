"use strict";

const MBCLIENT = require("./src/modbusTCPClient.js");

const RED = "\u001b[31m";
const WHITE = "\u001b[37m";
const RESET = "\u001b[0m";

const numServers = 1;

let mbClient = [];
let errors = [];

for (let i=0; i<numServers; i++) {

    mbClient.push(new MBCLIENT());

    mbClient[i].host = "127.0.0.1";
    mbClient[i].port = 502;
    
    mbClient[i]["transaction"] = 0;
    mbClient[i]["count"] = 0;

    function query_00 () {
        if (! mbClient[i].awaitingReply) {
            mbClient[i].transaction = (mbClient[i].transaction < 65535) ? (mbClient[i].transaction + 1) : 0;
            mbClient[i].readHoldingRegisters(mbClient[i].transaction, 1, 239, 125)
                .then((data) => { if (data != null) { mbClient[i].count++; query_00(); } })
                .catch((err) => { errors.push(err); query_00(); });
        }
    }

    //setInterval(query_00, 500);
    query_00();
}

setInterval(() => {
    console.clear();
    errors.forEach((d) => {
        if (d.name === "ModbusError") {
            console.log(WHITE + "[" + d.time + "] " + RED + d.name + ": " + d.message + RESET);
        }
        else {
            console.log(d.name + ": " + d.message);
        }
    });
    
    for (let i=0; i<numServers; i++) {
        console.log("count: %d", mbClient[i].count);
    }
}, 1000);