"use strict";

const ModbusError = require("./modbusError.js");

module.exports = class modbusQuery {

    constructor (transaction, queryLength, device) {
        if ((typeof queryLength !== "number") || (queryLength < 1) || (transaction > 65535)) { throw new ModbusError("invalid queryLength"); }
        this.buffer = Buffer.allocUnsafe(6 + queryLength);
        this.setQueryLength(queryLength);
        this.setTransaction(transaction);
        this.buffer.writeUint16BE(0, 2);
        this.setDevice(device);
    }

    setTransaction (transaction) {
        if ((typeof transaction !== "number") || (transaction < 0) || (transaction > 65535)) { throw new ModbusError("invalid transaction"); }
        this.transaction = transaction;
        this.buffer.writeUInt16BE(this.transaction, 0);
    }

    getTransaction () {
        return this.transaction;
    }

    setQueryLength (queryLength) {
        if ((typeof queryLength !== "number") || (queryLength < 1) || (queryLength > 65535)) { throw new ModbusError("invalid queryLength"); }
        this.queryLength = queryLength;
        this.buffer.writeUInt16BE(this.queryLength, 4);
    }
    
    getQueryLength () {
        return this.queryLength;
    }

    setDevice (device) {
        if ((typeof device !== "number") || (device < 1) || (device > 255)) { throw new ModbusError("invalid device"); }
        this.device = device;
        this.buffer.writeUInt8(this.device, 6);
    }

    getDevice () {
        return this.device;
    }

    getBuffer () {
        return this.buffer;
    }
}