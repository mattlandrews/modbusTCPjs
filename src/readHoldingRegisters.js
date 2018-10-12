"use strict";

const MBAP = require("./mbap.js");

module.exports = class ReadHoldingRegisters extends MBAP {

    constructor () {
        super();
        this._function = 3;
        this._register = 0;
        this._length = 1;
        this._byteLength = 5;
        this._buffer.writeUInt8(this._function, 6);
        this._buffer.writeUInt16BE(this._register, 7);
        this._buffer.writeUInt16BE(this._length, 9);
    }

    getFunction () {
        return this._function;
    }

    setRegister (register) {
        this._register = register;
        this._buffer.writeUInt16BE(this._register, 7);
    }

    getRegister () {
        return this._register;
    }

    setLength (length) {
        this._length = length;
        this._buffer.writeUInt16BE(this._length, 9);
    }

    getLength () {
        return this._length;
    }
}