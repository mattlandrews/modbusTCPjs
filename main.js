'use strict';

const MBSERVER = require("./src/modbusTCPServer.js");

let holdingRegisters = new Array(120);

let mbServer = new MBSERVER();
mbServer.host = "192.168.1.184";
mbServer.on("readHoldingRegisters", (request, callback) => {
    let d = [];
    for (let i=0; i<request.numAddresses; i++) {
        d.push(Math.random() * 1001);
    }
    callback(d);
});

mbServer.listen();

/*const mbtcp = require("./src/modbusTCPServer");

let mbClient = new mbtcp.Client();
(async () => {
    mbClient.host = "192.168.1.190";
    
    try {
        while (true) {
            let d = await mbClient.deviceIdentification(1,1,5);
            console.log(d);
            await (() => { return new Promise(resolve => { setTimeout(resolve, 250); }); })();
        }
    }
    catch (e) {
        console.log(e);
    }
    mbClient.disconnect();
})();*/

/*(async () => {
    mbClient.host = "192.168.1.181";
    mbClient.port = 503;
    let data0 = await mbClient.readHoldingRegisters(255,0,120);
    let data1 = await mbClient.readHoldingRegisters(255,120,120);
    let buffer0 = Buffer.from(new Uint16Array(data0).buffer);
    buffer0.swap16();

    console.log("Manufacturer: " + buffer0.toString('utf8', 8, 40));
    console.log("Model: " + buffer0.toString('utf8', 40, 72));
    console.log("Options: " + buffer0.toString('utf8', 72, 88));
    console.log("Version: " + buffer0.toString('utf8', 88, 104));
    console.log("Device Address: " + buffer0.readUInt16BE(136));

    let data2 = await mbClient.readHoldingRegisters(255,997,2);
    buffer0 = Buffer.from(new Uint16Array(data2).buffer);
    buffer0.swap16();
    console.log("UINT: " + buffer0.readUInt16BE(0));
    console.log("UINT: " + buffer0.readUInt16BE(2));
})();*/

