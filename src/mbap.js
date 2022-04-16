"use strict";

module.exports = function () {

    this.transaction = null;
    this.protocol = null;
    this.byteLength = null;

    this.fromBuffer = function (buffer) {
        if (buffer.length < 6) { throw new Error("mbap too short"); return; }
        this.transaction = buffer.readUInt16BE(0);
        this.protocol = buffer.readUInt16BE(2);
        this.byteLength = buffer.readUInt16BE(4);
    }

    this.toBuffer = function () {
        let buffer = Buffer.allocUnsafe(6 + this.byteLength);
        buffer.writeUInt16BE(this.transaction, 0);
        buffer.writeUInt16BE(this.protocol, 2);
        buffer.writeUInt16BE(this.byteLength, 4);
        return buffer;
    }

    return this;

}