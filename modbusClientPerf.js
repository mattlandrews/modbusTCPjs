"use strict";

const MBCLIENT = require("./src/modbusTCPClient.js");

let mbClient = new MBCLIENT();

mbClient.host = "192.168.1.19";
mbClient.port = 502;

let stats = {
    numTotalResponses: 0,
    responsesPerSec: 0,
    numTotalTimeouts: 0,
    numTotalReconnections: 0
};

let lastResponsesPerSec = 0;
setInterval(() => {
    stats.responsesPerSec = (stats.numTotalResponses - lastResponsesPerSec);
    lastResponsesPerSec = stats.numTotalResponses;
}, 1000);

function read () {
    mbClient.readHoldingRegisters(1,0,1)
        .then((data) => {
            stats.numTotalResponses++;
            read();
        })
        .catch((err) => {
            if (err.message === "Modbus timeout exceeded") { stats.numTotalTimeouts++; read(); return; }
            if (err.message.match(/^connect ECONNREFUSED.+/) != null) { stats.numTotalReconnections++; setTimeout(read, 500); return; }
            debugger;
        });
}
read();



const term = require("terminal-kit").terminal;

setInterval(() => {
    term.clear();
    term("Modbus Client: ");
    term.nextLine();
    term("        Reqs/sec: " + stats.responsesPerSec);
    term.nextLine();
    term("        Total Reqs: " + stats.numTotalResponses);
    term.nextLine();
    term("        Total Timouts: " + stats.numTotalTimeouts);
    term.nextLine();
    term("        Total Reconnections: " + stats.numTotalReconnections);
}, 1000);