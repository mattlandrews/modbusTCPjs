"use strict";

const modbusQuery = require("./modbusQuery.js");
const { ModbusReadLengthError, ModbusWriteLengthError } = require("./modbusError.js");

module.exports = class readWriteHoldingRegistersReply extends modbusQuery {

    constructor (transaction, device, data, dataLength) {
        super(transaction, (3 + (data.length * 2)), device);
        this.functionCode = 23;
        this.type = "readWriteHoldingRegistersReply";
        this.buffer.writeUInt8(this.functionCode, 7);
        if ((typeof dataLength === "number") && ((dataLength < 2) || (dataLength > 250))) { throw new ModbusWriteLengthError("invalid data length"); }
        this.setDataLength(data.length);
        this.setData(data);
    }

    getFunctionCode () {
        return this.functionCode;
    }

    getType () {
        return this.type;
    }

    setDataLength (dataLength) {
        if ((typeof dataLength !== "number") || (dataLength < 1) || (dataLength > 125)) { throw new ModbusReadLengthError("invalid data length"); }
        this.dataLength = (dataLength * 2);
        this.buffer.writeUInt8(this.dataLength, 8);
    }

    getDataLength () {
        return this.dataLength;
    }

    setData (data) {
        if ((!Array.isArray(data)) || (data.length < 0) || (data.length > 125)) { throw new ModbusReadLengthError("invalid data"); }
        this.data = data;
        this.data.forEach((d,i) => {
            this.buffer.writeInt16BE(d, (9 + (i * 2)));
        });
    }

    getData () {
        return this.data;
    }

}