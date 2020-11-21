'use strict';

const ModbusTCP = require("./mbtcp/mbtcp.js");
const mbtcp = new ModbusTCP();

let client = new mbtcp.client({ ip: '192.168.1.110', port: 502 });

client.on("error", (err) => { console.log(err); });

client.on("connect", () => {
    console.log("connected");
    client.send(new mbtcp.readHoldingRegisters().query);
});

client.on("data", (reply) => {
    console.log("data recvd");
    client.disconnect();
});

client.on("disconnect", () => { console.log("disconnected"); });

client.connect();