"use strict";

const MBAP = require("./mbap.js");

module.exports = class ReadHoldingRegisters_Query extends MBAP {

    constructor (data) {

        super(data);
        this.device = 1;
        this.func = 3;
        this.address = 0;
        this.registers = 1;
        if (Array.isArray(data)) {
            this.readFromBuffer(Buffer.from(data));
        }
        else if (Buffer.isBuffer(data)) {
            this.readFromBuffer(data);
        }
        else if (data != null) {
            throw new Error("Constructor type not recognized");
        }
        return;
        
    }

    readFromBuffer (buffer) {

        if (this.length != 6) {
            throw new Error ("Modbus query length invalid for query type");
            return;
        }
        this.device = buffer.readUInt8(6);
        this.func = buffer.readUInt8(7);
        this.address = buffer.readUInt16BE(8);
        this.registers = buffer.readUInt16BE(10);
        
    }

};