"use strict";

const modbusQuery = require("./modbusQuery.js");
const ModbusError = require("./modbusError.js");

module.exports = class readHoldingRegistersRequest extends modbusQuery {

    constructor (transaction, device, readAddress, readLength) {
        super(transaction, 6, device);
        this.functionCode = 3;
        this.type = "readHoldingRegistersRequest";
        this.buffer.writeUInt8(this.functionCode, 7);
        this.setReadAddress(readAddress);
        this.setReadLength(readLength);
    }

    getFunctionCode () {
        return this.functionCode;
    }

    getType () {
        return this.type;
    }

    setReadAddress (readAddress) {
        if ((typeof readAddress !== "number") || (readAddress < 0) || (readAddress > 65535)) { throw new ModbusError("invalid read address"); }
        this.readAddress = readAddress;
        this.buffer.writeUInt16BE(this.readAddress, 8);
    }

    getReadAddress () {
        return this.readAddress;
    }

    setReadLength (readLength) {
        if ((typeof readLength !== "number") || (readLength < 1) || (readLength > 125)) { throw new ModbusError("invalid read length"); }
        this.readLength = readLength;
        this.buffer.writeUInt16BE(this.readLength, 10);
    }

    getReadLength () {
        return this.readLength;
    }

}