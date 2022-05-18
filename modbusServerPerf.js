"use strict";

const MBSERVER = require("./src/modbusTCPServer.js");
const term = require("terminal-kit").terminal;
const OS = require("os");

const MAX_HOLDING_REGS = 65535;
let holdingRegisters = new Array(MAX_HOLDING_REGS);

let mbServer = new MBSERVER();

function selectInterfaces () {
    return new Promise((resolve, reject) => {
        let allInterfaces = OS.networkInterfaces();
        let interfaces = [{ name: "All IPv4 Interfaces", address: "0.0.0.0" }];
        Object.keys(allInterfaces).map((i) => {
            let d = allInterfaces[i].filter((d) => { return (d.family === "IPv4"); });
            d.map((dd) => { interfaces.push({
                name: i,
                address: dd.address
            }); });
        });
        let selectedInterfaceIndex = 0;
        function drawInterfaces () {
            term.clear();
            term("Select the desired interface:");
            for (let i=0; i<interfaces.length; i++) {
                term.nextLine();
                if (i === selectedInterfaceIndex) {
                    term.inverse("    " + i + ". " + interfaces[i].name + " (" + interfaces[i].address + ")");
                }
                else {
                    term("    " + i + ". " + interfaces[i].name + " (" + interfaces[i].address + ")");
                }
            }
        }
        term.grabInput();
        term.on("key", (name, matches, data) => {
            if (name === "DOWN") {
                if (selectedInterfaceIndex < (interfaces.length - 1)) { selectedInterfaceIndex++; drawInterfaces(); }
            }
            else if (name === "UP") {
                if (selectedInterfaceIndex > 0) { selectedInterfaceIndex--; drawInterfaces(); }
            }
            else if (name === "ENTER") {
                term.grabInput("false");
                resolve(interfaces[selectedInterfaceIndex]);
            }
            else if (name === "CTRL_C") {
                term.clear();
                process.exit(0);
            }
        });
        drawInterfaces();
    });
}

function selectPort () {
    return new Promise((resolve, reject) => {
        term.clear();
        term("Enter the desired port number (default is 4000): ");
        term.inputField({ default: "4000", minLength: "1", maxLength: "5" }, (err, input) => {
            let port = 4000;
            if (err == null) { port = Number.parseInt(input); }
            if (isNaN(port)) { port = 4000; }
            if (port > 65535) { port = 65535; }
            if (port < 0) { port = 0; }
            resolve(port);
        });
    });
}

function startModbusServer (host, port) {
    mbServer.host = host.address;
    mbServer.port = port;
    mbServer.on("readHoldingRegisters", (request, callback) => {
        if ((request.address < 0) || ((request.address + request.numAddresses) > MAX_HOLDING_REGS)) { callback(); }
        else { callback(holdingRegisters.slice(request.address, (request.address + request.numAddresses))); }
    });
    mbServer.listen();
    setInterval(() => {
        term.clear();
        term("Modbus Server Connections (" + mbServer.host + ":" + mbServer.port + "):");
        term.nextLine();
        mbServer.connections.forEach((c) => {
            term("    " + c.socket.remoteAddress + ":" + c.socket.remotePort + " -> " + c.socket.localAddress + ":" + c.socket.localPort);
            term("   Reqs/sec: " + c.stats.requestsPerSecond);
            term("   Total Reqs: " + c.stats.numTotalRequests);
            term("   Total Errs: " + c.stats.numTotalErrors);
            term.nextLine();
        });
    }, 1000);
}

(async () => {
    let iface = await selectInterfaces();
    let port = await selectPort();
    startModbusServer(iface, port);
})();
