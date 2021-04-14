'use strict';

const mbtcp = require('./mbtcp/mbtcp.js');
const server = new mbtcp.server({ ip: '127.0.0.1', port: 50002 });

server.setHoldingRegisters({ 0: 0, 1: 1, 2: 2 });

server.on("error", (err) => { console.log(err); });

server.on("start", () => { console.log("started"); });

server.on("stop", () => { console.log("stopped"); });

server.on("connect", () => { console.log("connect"); });

server.on("data", (data) => { console.log(data); client.disconnect(); });

server.on("disconnect", () => { console.log("disconnect"); });

server.start();

const client = new mbtcp.client({ ip: '127.0.0.1', port: 50002 });

client.connect();

server.stop();

client.readHoldingRegisters(0,3);