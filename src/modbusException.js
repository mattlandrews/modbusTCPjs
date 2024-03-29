"use strict";

const modbusQuery = require("./modbusQuery.js");
const { ModbusFunctionError, ModbusExceptionCodeError } = require("./modbusError.js");
const colors = require("./terminalColors.js");

module.exports = class modbusException extends modbusQuery {

    constructor (transaction, device, functionCode, exceptionCode) {
        super(transaction, 3, device);
        this.setFunctionCode(functionCode);
        this.setExceptionCode(exceptionCode);
    }

    setFunctionCode (functionCode) {
        if (typeof functionCode !== "number") { throw new ModbusFunctionError("invalid function code"); }
        else if (functionCode === 131) { this.type = "readHoldingRegistersException"; }
        else if (functionCode === 144) { this.type = "writeHoldingRegistersException"; }
        else if (functionCode === 151) { this.type = "readWriteHoldingRegistersException"; }
        else { throw new ModbusFunctionError("invalid function code"); }
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
        if (typeof exceptionCode !== "number") { throw new ModbusExceptionCodeError("invalid exception code"); }
        else if (exceptionCode === 1) { this.exceptionType = "illegal function"; }
        else if (exceptionCode === 2) { this.exceptionType = "illegal data address"; }
        else if (exceptionCode === 3) { this.exceptionType = "illegal data value"; }
        else if (exceptionCode === 4) { this.exceptionType = "slave device failure"; }
        else if (exceptionCode === 5) { this.exceptionType = "acknowledge"; }
        else if (exceptionCode === 6) { this.exceptionType = "slave device busy"; }
        else if (exceptionCode === 8) { this.exceptionType = "memory parity error"; }
        else if (exceptionCode === 10) { this.exceptionType = "gateway path unavailable"; }
        else if (exceptionCode === 11) { this.exceptionType = "gateway target failed to respond"; }
        else { throw new ModbusExceptionCodeError("invalid exception code"); }
        this.exceptionCode = exceptionCode;
        this.buffer.writeUint8(this.exceptionCode, 8);
    }

    getExceptionCode () {
        return this.exceptionCode;
    }

    getBuffer () {
        return this.buffer;
    }

    toString () {
        return colors.AllOff
            + colors.BackgroundBlack + colors.ForegroundLightWhite + "[ " + this.getTransaction().toString() + " ]"
            + colors.BackgroundBlack + colors.ForegroundLightWhite + "[ 0]"
            + colors.BackgroundBlack + colors.ForegroundLightWhite + "[ " + this.getQueryLength().toString() + " ]"
            + colors.BackgroundBlack + colors.ForegroundLightGreen + "[" + this.getDevice().toString() + "]"
            + colors.BackgroundBlack + colors.ForegroundRed + "[" + this.getFunctionCode().toString() + "]"
            + colors.BackgroundBlack + colors.ForegroundLightRed + "[" + this.getExceptionCode().toString() + "]"
            + colors.BackgroundDefault + colors.ForegroundDefault;
    }
}