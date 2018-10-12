"use strict";

module.exports = class MBAP {

    constructor () {
        this._transaction = 0;
        this._protocol = 0;
        this._byteLength = 0;
        this._buffer = new Buffer(245);
        this._buffer.fill(0);
    }

    setTransaction (transaction) {
        this._transaction = transaction;
        this._buffer.writeUInt16BE(this._transaction, 0);
    }

    getTransaction (transaction) {
        return this._transaction;
    }

    getBuffer () {
        return this._buffer.slice(0, (this._byteLength + 6));
    }
};