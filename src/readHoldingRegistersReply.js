"use strict";

const modbusQuery = require("./modbusQuery.js");
const modbusError = require("./modbusError.js");

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
        if ((typeof dataLength !== "number") || (dataLength < 1) || (dataLength > 125)) { throw new modbusError("invalid data length"); }
        this.dataLength = dataLength;
        this.buffer.writeUInt8(this.dataLength * 2, 8);
    }

    getDataLength () {
        return this.dataLength;
    }

    setData (data) {
        if ((!Array.isArray(data)) || (data.length < 0) || (data.length > 125)) { throw new modbusError("invalid data"); }
        this.data = data;
        this.data.forEach((d,i) => {
            this.buffer.writeInt16BE(d, (9 + (i * 2)));
        });
    }

    getData () {
        return this.data;
    }

}