"use strict";

const modbusQuery = require("./modbusQuery.js");
const { ModbusReadAddressError, ModbusReadLengthError, ModbusWriteAddressError, ModbusWriteLengthError } = require("./modbusError.js");

module.exports = class readWriteHoldingRegistersRequest extends modbusQuery {

    constructor (transaction, device, readAddress, readLength, writeAddress, data, writeLength, dataLength) {
        super(transaction, (11 + (data.length * 2)), device);
        this.functionCode = 23;
        this.type = "readWriteHoldingRegistersRequest";
        this.buffer.writeUInt8(this.functionCode, 7);
        this.setReadAddress(readAddress);
        this.setReadLength(readLength);
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

    setReadAddress (readAddress) {
        if ((typeof readAddress !== "number") || (readAddress < 0) || (readAddress > 65535)) { throw new ModbusReadAddressError("invalid read address"); }
        this.readAddress = readAddress;
        this.buffer.writeUInt16BE(this.readAddress, 8);
    }

    getReadAddress () {
        return this.readAddress;
    }

    setReadLength (readLength) {
        if ((typeof readLength !== "number") || (readLength < 1) || (readLength > 125)) { throw new ModbusReadLengthError("invalid read length"); }
        this.readLength = readLength;
        this.buffer.writeUInt16BE(this.readLength, 10);
    }

    getReadLength () {
        return this.readLength;
    }

    setWriteAddress (writeAddress) {
        if((typeof writeAddress !== "number") || (writeAddress < 0) || (writeAddress > 65535)) { throw new ModbusWriteAddressError("invalid write address"); }
        this.writeAddress = writeAddress;
        this.buffer.writeUInt16BE(this.writeAddress, 12);
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
        this.buffer.writeUInt16BE(this.writeLength, 14);
        this.dataLength = data.length * 2;
        this.buffer.writeUInt8(this.dataLength, 16);
        this.data = data;
        this.data.forEach((d,i) => {
            this.buffer.writeInt16BE(d, (17 + (i * 2)));
        });
    }

    getData () {
        return this.data;
    }

}