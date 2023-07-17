"use strict";

const modbusQuery = require("./modbusQuery.js");
const { ModbusError } = require("./modbusError.js");

module.exports = class modbusException extends modbusQuery {

    constructor (transaction, device, functionCode, exceptionCode) {
        super(transaction, 3, device);
        this.setFunctionCode(functionCode);
        this.setExceptionCode(exceptionCode);
    }

    setFunctionCode (functionCode) {
        if (typeof functionCode !== "number") { throw new ModbusError("invalid function code"); }
        else if (functionCode === 131) { this.type = "readHoldingRegistersException"; }
        else if (functionCode === 144) { this.type = "writeHoldingRegistersException"; }
        else { throw new ModbusError("invalid function code"); }
        this.functionCode = functionCode;
        this.buffer.writeUInt8(this.functionCode, 7);
    }

    getFunctionCode () {
        return this.functionCode;
    }

    getType () {
        return this.type;
    }

    getExceptionType () {
        return this.exceptionType;
    }

    setExceptionCode (exceptionCode) {
        if (typeof exceptionCode !== "number") { throw new ModbusError("invalid exception code"); }
        else if (exceptionCode === 1) { this.exceptionType = "illegal function"; }
        else if (exceptionCode === 2) { this.exceptionType = "illegal data address"; }
        else if (exceptionCode === 3) { this.exceptionType = "illegal data value"; }
        else if (exceptionCode === 4) { this.exceptionType = "slave device failure"; }
        else if (exceptionCode === 5) { this.exceptionType = "acknowledge"; }
        else if (exceptionCode === 6) { this.exceptionType = "slave device busy"; }
        else if (exceptionCode === 8) { this.exceptionType = "memory parity error"; }
        else if (exceptionCode === 10) { this.exceptionType = "gateway path unavailable"; }
        else if (exceptionCode === 11) { this.exceptionType = "gateway target failed to respond"; }
        else { throw new ModbusError("invalid exception code"); }
        this.exceptionCode = exceptionCode;
        this.buffer.writeUint8(this.exceptionCode, 8);
    }

    getExceptionCode () {
        return this.exceptionCode;
    }

    getBuffer () {
        return this.buffer;
    }
}