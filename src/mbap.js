"use strict";

module.exports = class MBAP {

    constructor () {
        this._transaction = 0;
        this._protocol = 0;
        this._byteLength = 1;
        this._device = 1;
        this._buffer = Buffer.alloc(245);
        this._buffer.fill(0);
        this._buffer[5] = 1;
        this._buffer[6] = 1;
    }

    setTransaction (transaction) {
        this._transaction = transaction;
        this._buffer.writeUInt16BE(this._transaction, 0);
    }

    getTransaction () {
        return this._transaction;
    }

    setDevice (device) {
        this._device = device;
        this._buffer.writeUInt8(this._device, 6);
    }

    getDevice () {
        return this._device;
    }

    getBuffer () {
        return this._buffer.slice(0, (this._byteLength + 6));
    }

    parseMBAP (mbap) {
        if (mbap.readUInt16BE(0) !== this._transaction) { return false; }
        if (mbap.readUInt16BE(2) !== this._protocol) { return false; }
        if (mbap.readUInt8(6) !== this._device) { return false; }
        return true;
    }
};