"use strict";

module.exports = class MBAP {
    
    constructor (data) {

        this.transaction = null;
        this.protocol = null;
        this.length = null;
        this.message = null;
        if (Array.isArray(data)) {
            this.readMBAPFromBuffer(Buffer.from(data));
        }
        else if (Buffer.isBuffer(data)) {
            this.readMBAPFromBuffer(data);
        }
        else if (data != null) {
            throw new Error("Constructor type not recognized");
        }
        return;

    };

    toBuffer () {

        let buffer = Buffer.allocUnsafe(6 + this.length);
        buffer.writeUInt16BE(this.transaction, 0);
        buffer.writeUInt16BE(this.protocol, 2);
        buffer.writeUInt16BE(this.length, 4);
        return buffer;

    }

    readMBAPFromBuffer (buffer) {
        
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