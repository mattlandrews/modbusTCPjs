"use strict";

const modbusQuery = require("./modbusQuery.js");
const { ModbusWriteAddressError, ModbusWriteLengthError } = require("./modbusError.js");

module.exports = class writeHoldingRegistersRequest extends modbusQuery {

    constructor (transaction, device, writeAddress, data, writeLength, dataLength) {
        super(transaction, (7 + (data.length * 2)), device);
        this.functionCode = 16;
        this.type = "writeHoldingRegistersRequest";
        this.buffer.writeUInt8(this.functionCode, 7);
        this.setWriteAddress(writeAddress);
        if ((typeof writeLength === "number") && ((writeLength < 1) || (writeLength > 125))) { throw new ModbusWriteLengthError("invalid write length"); }
        if ((typeof dataLength === "number") && ((dataLength < 2) || (dataLength > 250))) { throw new ModbusWriteLengthError("invalid data length"); }
        this.setData(data);
    }

    getFunctionCode () {
        return this.functionCode;
    }

    getType () {
        return this.type;
    }

    setWriteAddress (writeAddress) {
        if((typeof writeAddress !== "number") || (writeAddress < 0) || (writeAddress > 65535)) { throw new ModbusWriteAddressError("invalid write address"); }
        this.writeAddress = writeAddress;
        this.buffer.writeUInt16BE(this.writeAddress, 8);
    }

    getWriteAddress () {
        return this.writeAddress;
    }

    getWriteLength () {
        return this.writeLength;
    }

    getDataLength () {
        return this.dataLength;
    }

    setData (data) {
        if ((!Array.isArray(data)) || (data.length < 1) || (data.length > 125)) { throw new ModbusWriteLengthError("invalid write length"); }
        this.writeLength = data.length;
        this.buffer.writeUInt16BE(this.writeLength, 10);
        this.dataLength = data.length * 2;
        this.buffer.writeUInt8(this.dataLength, 12);
        this.data = data;
        this.data.forEach((d,i) => {
            this.buffer.writeInt16BE(d, (13 + (i * 2)));
        });
    }

    getData () {
        return this.data;
    }

}