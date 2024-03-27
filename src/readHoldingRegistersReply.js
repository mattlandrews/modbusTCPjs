"use strict";

const modbusQuery = require("./modbusQuery.js");
const { ModbusReadLengthError } = require("./modbusError.js");
const colors = require("./terminalColors.js");

module.exports = class readHoldingRegistersReply extends modbusQuery {

    constructor (transaction, device, data) {
        super(transaction, (3 + (data.length * 2)), device);
        this.functionCode = 3;
        this.type = "readHoldingRegistersReply";
        this.buffer.writeUInt8(this.functionCode, 7);
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

    toString () {
        let _data = "";
        this.data.forEach((d) => { _data += "[" + d.toString() + "]"; });
        return colors.AllOff
            + colors.BackgroundBlack + colors.ForegroundLightWhite + "[" + this.getTransaction().toString() + "]"
            + colors.BackgroundBlack + colors.ForegroundLightGray + "[0]"
            + colors.BackgroundBlack + colors.ForegroundLightGray + "[" + this.getQueryLength().toString() + "]"
            + colors.BackgroundBlack + colors.ForegroundLightWhite + "[" + this.getDevice().toString() + "]"
            + colors.BackgroundBlack + colors.ForegroundLightYellow + "[" + this.getFunctionCode().toString() + "]"
            + colors.BackgroundBlack + colors.ForegroundLightGreen + "[" + this.getDataLength().toString() + "]"
            + colors.BackgroundBlack + colors.ForegroundLightGray + _data;
    }

}