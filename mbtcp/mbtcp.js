'use strict';

const client = require('./client.js');
const readHoldingRegisters = require('./readHoldingRegisters.js');
const writeHoldingRegisters = require('./writeHoldingRegisters.js');

module.exports = function MBTCP () {
    
    this.client = client;
    this.readHoldingRegisters = readHoldingRegisters;
    this.writeHoldingRegisters = writeHoldingRegisters;

    return this;
}