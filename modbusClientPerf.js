"use strict";

const MBCLIENT = require("./src/modbusTCPClient.js");
const term = require("terminal-kit").terminal;

function getIP () {
    return new Promise((resolve, reject) => {
        term("Enter IP Address: ");
        term.inputField({ default: "127.0.0.1"}, (err, input) => {
            if (err) { throw err; return; }
            let value = input.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/);
            if (value == null) { reject(new Error("IP Address not recoginized as valid.")); }
            term.nextLine();
            term.grabInput(false);
            resolve(value[0]);
        });
    });
}

function getInteger (title, def, min, max) {
    return new Promise((resolve, reject) => {
        if (typeof title !== "string") { reject(new Error("title not a valid string.")); }
        if (typeof def !== "number") { reject(new Error("def not a valid number.")); }
        if (typeof min !== "number") { reject(new Error("min not a valid number.")); }
        if (typeof max !== "number") { reject(new Error("max not a valid number.")); }
        term("Enter " + title + ": ");
        def = Math.round(def);
        min = Math.round(min);
        max = Math.round(max);
        term.inputField({ default: def.toString() }, (err, input) => {
            let value = def;
            if (err == null) { value = Number.parseInt(input); }
            if (isNaN(value)) { port = def; }
            if (value > max) { value = max; }
            if (value < min) { value = min; }
            term.nextLine();
            term.grabInput(false);
            resolve(value);
        });
    });
}

(async () => {
    try {
        term.clear();
        let ip = await getIP();
        let port = await getInteger("Port", 502, 0, 65535);
        let address = await getInteger("Modbus Address", 1, 1, 65536);
        let numAddresses = await getInteger("Number of Addresses", 1, 1, 120);
        
        let mbClient = new MBCLIENT();

        mbClient.host = ip;
        mbClient.port = port;

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
            mbClient.readHoldingRegisters(255,address,numAddresses)
                .then((data) => {
                    stats.numTotalResponses++;
                    read();
                })
                .catch((err) => {
                    if (err.message === "Modbus timeout exceeded") { stats.numTotalTimeouts++; }
                    else if (err.code === "ECONNRESET") { stats.numTotalReconnections++; }
                    read();
                    return;
                });
        }
        read();



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
    }
    catch (e) {
        debugger;
    }
})();

/**/
