'use strict';

const mbtcp = require('./mbtcp/mbtcp.js');
const client = new mbtcp.server({ ip: '127.0.0.1', port: 502 });

client.setHoldingRegisters({ 0: 0, 1: 1, 2: 2 });

client.on("error", (err) => { console.log(err); });

client.on("connect", () => {
    console.log("connected");
});

client.on("disconnect", () => { console.log("disconnected"); });

client.listen();