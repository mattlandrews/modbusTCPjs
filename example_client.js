"use strict";
const ModbusTCP = require("./src/modbustcp.js");

let modbusTCP = new ModbusTCP();
let client = new modbusTCP.client();

client.connect({ port: 502, ip: '192.168.1.71', reconnect: false }, (err) => {
    if (err) { console.error(err); }
    else {
        console.log("Connected");
        client.readHoldingRegisters(1,0,1, (err, data) => {
            if (err) { console.error(err.message); }
            else { console.log(data); }
            client.disconnect(() => {
                console.log("Disconnected");
            });
        });
    }
});