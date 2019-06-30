"use strict";

module.exports = class ModbusQuery {

    constructor (query) {
        if (typeof query === "object") {
            this._constructMBAP(query);
        }
        else {
            this._constructMBAP({});
        }
    };

    _constructMBAP (query) {
        this.transaction = (query.transaction == null) ? 0 : query.transaction;
        this.protocol = 0;
        this.byteLength = null;
        this.device = (query.device == null) ? 1 : query.device;
        this.type = (query.type == null) ? "readHoldingRegisters" : query.type;
        this.buffer = Buffer.allocUnsafe(512);
        this.buffer.writeUInt16BE(this.transaction,0);
        this.buffer.writeUInt16BE(this.protocol,2);
        this.buffer.writeUInt8(this.device,6);
        if (this.type.toLowerCase() == "readholdingregisters") { this._constructReadHoldingRegisters(query); }
    };

    _constructReadHoldingRegisters (query) {
        this.byteLength = 6;
        this.buffer.writeUInt16BE(this.byteLength,4);
        this.func = 3;
        this.address = (query.address == null) ? 0 : query.address;
        this.length = (query.length == null) ? 1 : query.length;
        this.buffer.writeUInt8(this.func,7);
        this.buffer.writeUInt16BE(this.address,8);
        this.buffer.writeUInt16BE(this.length,10);
    };

    getBuffer () {
        return this.buffer.slice(0, (6 + this.byteLength));
    };

};