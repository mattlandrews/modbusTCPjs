"use strict";

const modbusQuery = require("./modbusQuery.js");

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
        if ((typeof writeAddress !== "number") || (writeAddress < 0) || (writeAddress > 65535)) { throw new Error("invalid write address"); }
        this.writeAddress = writeAddress;
        this.buffer.writeUInt16BE(this.writeAddress, 8);
    }

    getWriteAddress () {
        return this.writeAddress;
    }

    setWriteLength (writeLength) {
        if ((typeof writeLength !== "number") || (writeLength < 1) || (writeLength > 125)) { throw new Error("invalid write address"); }
        this.writeLength = writeLength;
        this.buffer.writeUInt16BE(this.writeLength, 10);
    }

    getWriteLength () {
        return this.writeLength;
    }

}