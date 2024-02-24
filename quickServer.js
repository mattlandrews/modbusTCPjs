"use strict";

const term = require("terminal-kit").terminal;
const ScreenBuffer = require("terminal-kit").ScreenBuffer;
const interfaces = require("os").networkInterfaces;
const MBSERVER = require("./src/modbusTCPServer.js");

async function selectInterface () {
    return new Promise((resolve, reject) => {
        let ifaces = interfaces();
        ifaces = Object.keys(ifaces)
            .map((d) => { return {name: d, value: ifaces[d].filter((d) => { return (d.family === 'IPv4'); })[0] }; });
        term.clear();
        term("Available ethernet interfaces:\n");
        ifaces.forEach((d, i) => {
            term((i+1) + ")  " + d.name + " (" + d.value.cidr + ")\n");
        });
        term("Select an interface: ");
        term.inputField((error, input) => {
            if (error) { reject(error); }
            term("\n\n");
            let n = Number.parseInt(input-1);
            if ((n < 0) || (n >= ifaces.length)) { reject(new Error("Invalid interface selection.")); return; }
            resolve(ifaces[Number.parseInt(input-1)]);
        });
    });
}

async function selectPort () {
    return new Promise((resolve, reject) => {
        term.clear();
        term("Enter a port: ");
        term.inputField((error, input) => {
            if (error) { reject(error); }
            term("\n\n");
            let n = Number.parseInt(input);
            if ((n < 0) || (n > 65535)) { reject(new Error("Invalid port entered.")); return; }
            resolve(n)
        });
    });
}

async function startServer (ip, port) {
    return new Promise((resolve, reject) => {
        term.clear();
        term.on("key", (name) => {
            if (name === "ESCAPE") { resolve(); }
        });

        let mbServer = new MBSERVER();
        let holdingRegisters = new Uint16Array(500);

        mbServer.host = ip;
        mbServer.port = port;

        mbServer.on("readHoldingRegisters", (request, response) => {
            let a = request.readAddress;
            let b = request.readAddress + request.readLength;
            let data = Array.from(holdingRegisters.slice(a, b));
            let arr = [...request.buffer];
            term("\x1b[107m\x1b[30m" + JSON.stringify(arr));
            term("\x1b[40m\x1b[97m" + JSON.stringify(data));
            response(data);
        });

        mbServer.listen();
    });
}

(async () => {
    try {
        let iface = await selectInterface();
        let port = await selectPort();
        await startServer(iface.value.address, port);
    }
    catch (exc) {
        console.error(exc);
    }
    process.exit();
})();