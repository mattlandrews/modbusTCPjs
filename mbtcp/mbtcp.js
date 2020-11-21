'use strict';

const client = require('./client.js');
const readHoldingRegisters = require('./readHoldingRegisters.js');
const writeHoldingRegisters = require('./writeHoldingRegisters.js');

module.exports = {
    client: client,
    readHoldingRegisters: readHoldingRegisters,
    writeHoldingRegisters: writeHoldingRegisters
}