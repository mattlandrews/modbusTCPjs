'use strict';

module.exports = function () {
    
    this.transaction = 0;
    this.protocol = 0;
    this.byteLength = 0;

    this.fromBuffer = function (buffer) {
        this.transaction = buffer.readUInt16BE(0);
        this.protocol = buffer.readUInt16BE(2);
        this.byteLength = buffer.readUInt16BE(4);
    }

    this.toBuffer = function (buffer) {
        this.byteLength = buffer.length - 6;
        buffer.writeUInt16BE(this.transaction, 0);
        buffer.writeUInt16BE(this.protocol, 2);
        buffer.writeUInt16BE(this.byteLength, 4);
    }

    return this;

}