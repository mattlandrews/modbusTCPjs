"use strict";

const MBAP = require("./mbap.js");

module.exports = class ReadHoldingRegisters extends MBAP {

    constructor () {
        super();
        this._byteLength = 6;
        this._buffer.writeUInt16BE(this._byteLength, 4);
        this.setDevice(1);
        this._function = 3;
        this._buffer.writeUInt8(this._function, 7);
        this.setRegister(0);
        this.setLength(1);
    }

    getFunction () {
        return this._function;
    }

    setRegister (register) {
        this._register = register;
        this._buffer.writeUInt16BE(this._register, 8);
    }

    getRegister () {
        return this._register;
    }

    setLength (length) {
        this._length = length;
        this._buffer.writeUInt16BE(this._length, 10);
    }

    getLength () {
        return this._length;
    }

    parseReply (data) {
        if (this.parseMBAP(data) == false) { return null; }
        if (data.readUInt8(7) != this._function) { return null; }
        let dataByteLength = data.readUInt8(8);
        if (dataByteLength != (this._length * 2)) { return null; }
        let d = [];
        for (let i=0; i<dataByteLength; i+=2) {
            d.push(data.readUInt16BE(9 + i));
        }
        return d;
    }
}