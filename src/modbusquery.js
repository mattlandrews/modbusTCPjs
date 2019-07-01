"use strict";

const ModbusMBAP = require("./modbusmbap.js");

module.exports = class ModbusQuery extends ModbusMBAP {

    constructor (data) {
        if (data == null) { data = {}; }
        super(data);
        if (Array.isArray(data)) {
            if (this.func === 3) { this._constructReadHoldingRegistersFromBuffer(Buffer.from(data)); }
        }
        else if (Buffer.isBuffer(data)) {
            if (this.func === 3) { this._constructReadHoldingRegistersFromBuffer(data); }
        }
        else if (typeof data === "object") {
            if (this.func === 3) { this._constructReadHoldingRegistersFromObject(data); }
        }
    };

    _constructReadHoldingRegistersFromObject (obj) {
        this.byteLength = 6;
        this.buffer.writeUInt16BE(this.byteLength,4);
        this.address = (obj.address == null) ? 0 : obj.address;
        this.length = (obj.length == null) ? 1 : obj.length;
        this.dataLength = (this.length * 2);
        this.buffer.writeUInt16BE(this.address,8);
        this.buffer.writeUInt16BE(this.length,10);
    };

    _constructReadHoldingRegistersFromBuffer (buffer) {
        this.address = buffer.readUInt16BE(8);
        this.length = buffer.readUInt16BE(10);
        this.dataLength = this.length * 2;
        this.buffer = buffer;
    }

};