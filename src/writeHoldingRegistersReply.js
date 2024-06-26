"use strict";

const modbusQuery = require("./modbusQuery.js");
const { ModbusWriteAddressError, ModbusWriteLengthError } = require("./modbusError.js");
const colors = require("./terminalColors.js");

module.exports = class writeHoldingRegistersReply extends modbusQuery {

    constructor (transaction, device, writeAddress, writeLength) {
        super(transaction, 6, device);
        this.functionCode = 16;
        this.type = "writeHoldingRegistersReply";
        this.buffer.writeUInt8(this.functionCode, 7);
        this.setWriteAddress(writeAddress);
        this.setWriteLength(writeLength);
    }

    getFunctionCode () {
        return this.functionCode;
    }

    getType () {
        return this.type;
    }

    setWriteAddress (writeAddress) {
        if ((typeof writeAddress !== "number") || (writeAddress < 0) || (writeAddress > 65535)) { throw new ModbusWriteAddressError("invalid write address"); }
        this.writeAddress = writeAddress;
        this.buffer.writeUInt16BE(this.writeAddress, 8);
    }

    getWriteAddress () {
        return this.writeAddress;
    }

    setWriteLength (writeLength) {
        if ((typeof writeLength !== "number") || (writeLength < 1) || (writeLength > 125)) { throw new ModbusWriteLengthError("invalid write address"); }
        this.writeLength = writeLength;
        this.buffer.writeUInt16BE(this.writeLength, 10);
    }

    getWriteLength () {
        return this.writeLength;
    }

    toString () {
        return colors.AllOff
            + colors.BackgroundBlack + colors.ForegroundLightWhite + "[ " + this.getTransaction().toString() + " ]"
            + colors.BackgroundBlack + colors.ForegroundLightWhite + "[ 0]"
            + colors.BackgroundBlack + colors.ForegroundLightWhite + "[ " + this.getQueryLength().toString() + " ]"
            + colors.BackgroundBlack + colors.ForegroundLightGreen + "[" + this.getDevice().toString() + "]"
            + colors.BackgroundBlack + colors.ForegroundLightYellow + "[" + this.getFunctionCode().toString() + "]"
            + colors.BackgroundBlack + colors.ForegroundLightMagenta + "[ " + this.getWriteAddress().toString() + " ]"
            + colors.BackgroundBlack + colors.ForegroundLightBlue + "[ " + this.getWriteLength().toString() + " ]"
            + colors.BackgroundDefault + colors.ForegroundDefault;
    }

}