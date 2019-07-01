"use strict";

const ModbusMBAP = require("./modbusmbap.js");

module.exports = class ModbusReply extends ModbusMBAP {

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

        this.data = (Array.isArray(obj.data)) ? obj.data : [0];
        this.length = this.data.length;
        this.dataLength = this.length * 2;
        this.buffer.writeUInt8(this.dataLength, 8);
        this.byteLength = 3 + this.dataLength;
        this.buffer.writeUInt16BE(this.byteLength, 4);
        for (let i=0; i<this.data.length; i++) {
            this.buffer.writeUInt16BE(this.data[i], (9 + (i * 2)));
        }
    };

    _constructReadHoldingRegistersFromBuffer (buffer) {
        this.dataLength = buffer.readUInt8(8);
        this.length = this.dataLength / 2;
        this.data = [];
        for (let i=0; i<this.length; i++) {
            this.data.push(buffer.readUInt16BE(9 + (i * 2)));
        }
        this.buffer = buffer;
    }

};