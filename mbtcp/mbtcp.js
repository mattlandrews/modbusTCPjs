'use strict';

const client = require('./client.js');
//const server = require('./server.js');
const readHoldingRegisters = require('./readHoldingRegisters.js');
const writeHoldingRegisters = require('./writeHoldingRegisters.js');

module.exports = {
    client: client,
    //server: server,
    readHoldingRegisters: readHoldingRegisters,
    writeHoldingRegisters: writeHoldingRegisters
}