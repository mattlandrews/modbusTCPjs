'use strict';

const mbtcp = require('./mbtcp/mbtcp.js');
const client = new mbtcp.client({ ip: '127.0.0.1', port: 502 });

client.on("error", (err) => { console.log(err); });

client.on("connect", () => {
    console.log("connected");
    client.readHoldingRegisters(0,1);
});

client.on("data", (reply) => {
    console.log("data recvd:" + JSON.stringify(reply));
    client.disconnect();
});

client.on("disconnect", () => { console.log("disconnected"); });

client.connect();