"use strict";

module.exports = class Reply {

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

    replyToBuffer () {
        if (this.queryLength < 6) { throw new Error("Invalid query length"); return; }
        let buffer = Buffer.allocUnsafe(6 + this.queryLength);
        buffer.writeUInt16BE(this.transaction, 0);
        buffer.writeUInt16BE(this.protocol, 2);
        buffer.writeUInt16BE(this.queryLength, 4);
        buffer.writeUInt8(this.device, 6);
        buffer.writeUInt8(this.func, 7);
        switch (this.func) {
            case 3:
                buffer.writeUInt8(this.dataLength, 8);
                for (let i=0; i<this.data.length; i++) {
                    buffer.writeUInt16BE(this.data[i], (9+(i*2)) );
                }
                break;

            case 16:
                throw new Error("Not implemented");
                break;
        }
        return buffer;
    }

    replyFromBuffer (buffer) {
        if (buffer.length < 8) { throw new Error("Invalid reply length"); return; }
        this.transaction = buffer.readUInt16BE(0);
        this.protocol = buffer.readUInt16BE(2);
        this.queryLength = buffer.readUInt16BE(4);
        this.device = buffer.readUInt8(6);
        this.func = buffer.readUInt8(7);
        switch (this.func) {
            case 3:
                if (buffer.length <= 8) { throw new Error("Invalid reply length"); return; }
                this.dataLength = buffer.readUInt8(8);
                if (buffer.length != (9 + this.dataLength)) { throw new Error("Invalid reply length"); return; }
                this.data = [];
                for (let i=0; i<(this.dataLength/2); i++) {
                    this.data.push(buffer.readUInt16BE(9+(i*2)));
                }
                break;
            
            case 16:
                if (buffer.length != 12) { throw new Error("Invalid reply length"); return; }
                this.address = buffer.readUInt16BE(8);
                this.regCount = buffer.readUInt16BE(10);
                break;

            default:
                if (this.func > 128) {
                    throw new Error("Modbus exception");
                }
                else {
                    throw new Error("Invalid function");
                }
                break;
        }
        return;
    }

};