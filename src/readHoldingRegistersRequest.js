"use strict";

const modbusQuery = require("./modbusQuery.js");
const { ModbusReadAddressError, ModbusReadLengthError } = require("./modbusError.js");
const colors = require("./terminalColors.js");

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

    toString () {
        return colors.BackgroundWhite
            + colors.ForegroundBlack + "[ " + this.getTransaction().toString() + " ]"
            + "[ 0 ]"
            + "[ " + this.getQueryLength().toString() + " ]"
            + colors.BackgroundLightGreen + colors.ForegroundBlack + "[" + this.getDevice().toString() + "]"
            + colors.BackgroundLightYellow + colors.ForegroundBlack + "[" + this.getFunctionCode().toString() + "]"
            + colors.BackgroundLightMagenta + colors.ForegroundBlack + "[ " + this.getReadAddress().toString() + " ]"
            + colors.BackgroundLightBlue + colors.ForegroundBlack + "[ " + this.getReadLength().toString() + " ]"
            + colors.BackgroundDefault + colors.ForegroundDefault;
        /*return colors.AllOff
            + colors.BackgroundLightWhite + colors.ForegroundBlack + "[" + this.getTransaction().toString() + "]"
            + colors.BackgroundWhite + colors.ForegroundBlack + "[0]"
            + colors.BackgroundWhite + colors.ForegroundBlack + "[" + this.getQueryLength().toString() + "]"
            + colors.BackgroundLightWhite + colors.ForegroundBlack + "[" + this.getDevice().toString() + "]"
            + colors.BackgroundLightYellow + colors.ForegroundBlack + "[" + this.getFunctionCode().toString() + "]"
            + colors.BackgroundBlue + colors.ForegroundWhite + "[" + this.getReadAddress().toString() + "]"
            + colors.BackgroundGreen + colors.ForegroundBlack + "[" + this.getReadLength().toString() + "]"
            + colors.AllOff + colors.ForegroundDefault + colors.BackgroundDefault;*/
    }

}