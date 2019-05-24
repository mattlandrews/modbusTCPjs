"use strict";

const MBAP = require("./mbap.js");

module.exports = class WriteHoldingRegistersQuery extends MBAP {

    constructor () {
        super();
        this._byteLength = 9;
        this._buffer.writeUInt16BE(this._byteLength, 4);
        this.setDevice(1);
        this._function = 16;
        this._buffer.writeUInt8(this._function, 7);
        this.setRegister(0);
        this.setData([0]);
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

    getLength () {
        return this._length;
    }

    setData (data) {
        if (Array.isArray(data) == false) {
            if (typeof data === "number") { data = [data]; }
            else {
                throw new Error("Data is of invalid type.");
                return;
            }
        }
        else if ((data.length < 1) || (data.length > 120)) {
            throw new Error("Data is of invalid length");
            return;
        }
        let dataByteLength = (data.length * 2);
        this._byteLength = 7 + dataByteLength;
        this._buffer.writeUInt16BE(this._byteLength, 4);
        this._length = data.length;
        this._buffer.writeUInt16BE(this._length, 10);
        this._buffer.writeUInt8(dataByteLength, 12);
        this._data = data;
        for (let i=0; i<this._data.length; i++) {
            this._buffer.writeUInt16BE(this._data[i], (13 + (i * 2)));
        }
    }

    getData (data) {
        return this._data;
    }

    parseReply (data) {
        if (this.parseMBAP(data) == false) { return null; }
        if (data.readUInt8(7) != this._function) { return null; }
        if (data.readUInt16BE(8) != this._register) { return null; }
        if (data.readUInt16BE(10) != this._length) { return null; }
        return [];
    }
}