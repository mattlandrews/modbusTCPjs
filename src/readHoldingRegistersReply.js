"use strict";

const MBAP = require("./mbap.js");

module.exports = class ReadHoldingRegistersReply extends MBAP {

    constructor () {
        super();
        this.setDevice(1);
        this._function = 3;
        this._buffer.writeUInt8(this._function, 7);
        this.setData([0]);
    }

    getFunction () {
        return this._function;
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
        this._byteLength = 3 + dataByteLength;
        this._buffer.writeUInt16BE(this._byteLength, 4);
        this._length = data.length;
        this._buffer.writeUInt8(dataByteLength, 8);
        this._data = data;
        for (let i=0; i<this._data.length; i++) {
            this._buffer.writeUInt16BE(this._data[i], (9 + (i * 2)));
        }
    }

    getData (data) {
        return this._data;
    }
}