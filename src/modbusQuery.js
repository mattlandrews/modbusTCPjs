"use strict";

module.exports = class Query {

    constructor () {
        this.transaction = 0;
        this.protocol = 0;
        this.queryLength = 6;
        this.device = 1;
        this.func = 3;
        this.address = 0;
        this.regCount = 1;
        this.dataLength = 0;
        this.data = [];
        return;
    }

    queryToBuffer () {
        if (this.queryLength < 5) { throw new Error("Invalid query length"); return; }
        let buffer = Buffer.allocUnsafe(6 + this.queryLength);
        buffer.writeUInt16BE(this.transaction, 0);
        buffer.writeUInt16BE(this.protocol, 2);
        buffer.writeUInt16BE(this.queryLength, 4);
        buffer.writeUInt8(this.device, 6);
        buffer.writeUInt8(this.func, 7);
        switch (this.func) {
            case 3:
                buffer.writeUInt16BE(this.address, 8);
                buffer.writeUInt16BE(this.regcount, 10);
                break;

            case 16:
                buffer.writeUInt16BE(this.address, 8);
                this.regCount = this.data.length;
                buffer.writeUInt16BE(this.regCount, 10);
                this.dataLength = (this.data.length * 2);
                buffer.writeUInt8(this.dataLength, 12);
                for (let i=0; i<this.data.length; i++) {
                    buffer.writeUInt16BE(this.data[i], (13 + (i * 2)));
                }
                break;

            default:
                throw new Error("Invalid function");
                return;
        }
        return buffer;
    }

    queryFromBuffer (buffer) {
        if (buffer.length < 8) { throw new Error("Invalid query length"); return; }
        this.transaction = buffer.readUInt16BE(0);
        this.protocol = buffer.readUInt16BE(2);
        this.queryLength = buffer.readUInt16BE(4);
        this.device = buffer.readUInt8(6);
        this.func = buffer.readUInt8(7);
        switch (this.func) {
            case 3:
                if (buffer.length != 12) { throw new Error("Invalid query length"); return; }
                this.address = buffer.readUInt16BE(8);
                this.regcount = buffer.readUInt16BE(10);
                break;
            
            case 16:
                throw new Error ("Not implemented");
                break;
        }
        return;
    }

};