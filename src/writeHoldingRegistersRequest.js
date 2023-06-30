"use strict";

const modbusQuery = require("./modbusQuery.js");
const ModbusError = require("./modbusError.js");

module.exports = class writeHoldingRegistersRequest extends modbusQuery {

    constructor (transaction, device, writeAddress, data) {
        super(transaction, (7 + (data.length * 2)), device);
        this.functionCode = 16;
        this.type = "writeHoldingRegistersRequest";
        this.buffer.writeUInt8(this.functionCode, 7);
        this.setWriteAddress(writeAddress);
        this.setData(data);
    }

    getFunctionCode () {
        return this.functionCode;
    }

    getType () {
        return this.type;
    }

    setWriteAddress (writeAddress) {
        if((typeof writeAddress !== "number") || (writeAddress < 0) || (writeAddress > 65535)) { throw new ModbusError("invalid write address"); }
        this.writeAddress = writeAddress;
        this.buffer.writeUInt16BE(this.writeAddress, 8);
    }

    getWriteAddress () {
        return this.writeAddress;
    }

    getWriteLength () {
        return this.data.length;
    }

    getDataLength () {
        return this.data.length * 2;
    }

    setData (data) {
        if ((!Array.isArray(data)) || (data.length < 1) || (data.length > 125)) { throw new ModbusError("invalid write length"); }
        this.buffer.writeUInt16BE(data.length, 10);
        this.buffer.writeUInt8(data.length * 2, 12);
        this.data = data;
        this.data.forEach((d,i) => {
            this.buffer.writeInt16BE(d, (13 + (i * 2)));
        });
    }

    getData () {
        return this.data;
    }

}