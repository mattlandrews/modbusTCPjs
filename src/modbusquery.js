"use strict";

module.exports = class ModbusQuery {

    constructor (query) {
        if (typeof query === "object") {
            constructFromObject(query);
        }
    }

    constructFromObject (query) {

        this.buffer = Buffer.alloc(512);
        this.buffer.fill(0);
        
        if (query.transaction != null) {
            this.transaction = toByte(query.transaction);
            this.buffer.writeUInt16BE(this.transaction, 0);
        }
        else {
            this.transaction = 0;
        }

        this.protocol = 0;

        this.byteLength = 1;
        this.buffer[5] = 1;
        
        if (query.device != null) {
            this.device = toByte(query.device);
        }
        else {
            this.device = 1;
        }
        this.buffer.writeUInt8(this.device, 6);

        if (query.type.toLowerCase() === "readholdingregisters") {
            this.function = 3;
            this.buffer.writeUInt8(this.function, 7);
            this.address = query.address;
            this.buffer.writeUInt16BE(this.address, 8);
            this.length = query.length;
            this.buffer.writeUInt16BE(this.length, 10);
            this.byteLength = 6;
            this.buffer.writeUInt16BE(this.byteLength, 4);
        }
    }

    getBuffer () {
        return this.buffer.slice( 6 + this.byteLength );
    }

};