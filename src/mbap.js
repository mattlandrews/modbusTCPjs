"use strict";

module.exports = class MBAP {
    
    constructor () {

        this.transaction = 0;
        this.protocol = 0;
        this.length = 0;
        return;

    };

    toBuffer (length) {
        this.length = length;
        let buffer = Buffer.allocUnsafe(6 + this.length);
        buffer.writeUInt16BE(this.transaction, 0);
        buffer.writeUInt16BE(this.protocol, 2);
        buffer.writeUInt16BE(this.length, 4);
        return buffer;

    }

    fromBuffer (buffer) {
        
        this.transaction = buffer.readUInt16BE(0);
        this.protocol = buffer.readUInt16BE(2);
        this.length = buffer.readUInt16BE(4);
        if ((buffer.length < 8) || (buffer.length !== this.length + 6)) {
            throw new Error("MBAP length invalid");
            return;
        }
        return;

    }

}