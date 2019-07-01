"use strict";

module.exports = class ModbusMBAP {

    constructor (data) {
        if (data == null) { data = {}; }
        if (Array.isArray(data)) {
            this._constructMBAPFromBuffer(Buffer.from(data));
        }
        else if (Buffer.isBuffer(data)) {
            this._constructMBAPFromBuffer(data);
        }
        else if (typeof data === "object") {
            this._constructMBAPFromObject(data);
        }
    };

    _constructMBAPFromObject (obj) {
        let type = "readHoldingRegisters";
        this.transaction = (obj.transaction == null) ? 0 : obj.transaction;
        this.protocol = 0;
        this.byteLength = 2;
        this.device = (obj.device == null) ? 1 : obj.device;
        if (obj.type != null) { type = obj.type; }
        if (type.toLowerCase() === "readholdingregisters") { this.func = 3; }
        this.buffer = Buffer.allocUnsafe(512);
        this.buffer.writeUInt16BE(this.transaction,0);
        this.buffer.writeUInt16BE(this.protocol,2);
        this.buffer.writeUInt16BE(this.byteLength,4);
        this.buffer.writeUInt8(this.device,6);
        this.buffer.writeUInt8(this.func, 7);
    };

    _constructMBAPFromBuffer (buffer) {
        this.transaction = buffer.readUInt16BE(0);
        this.protocol = buffer.readUInt16BE(2);
        this.byteLength = buffer.readUInt16BE(4);
        this.device = buffer.readUInt8(6);
        this.func = buffer.readUInt8(7);
        this.buffer = buffer;
    }

    getBuffer () {
        return this.buffer.slice(0, (6 + this.byteLength));
    };

};