"use strict";

const modbusFrame = require("./modbusFrame.js");

module.exports = class readHoldingRegistersQuery extends modbusFrame {

    constructor () {
        super();
        this._byteLength = 6;
        this._function = 3;
        this._register = 0;
        this._registerCount = 1;
        this._buffer = new Buffer([0,0,0,0,0,6,1,3,0,0,0,1]);
    }

    get register () { return this._register; }
    set register (register) {
        if ((typeof register === "number") && (register >= 0) && (register <= 65535) && (Number.isInteger(register))) {
            this._register = register;
            this._buffer.writeUInt16BE(this._register, 8);
        }
        else {
            throw new Error("Invalid Register");
        }
    }

    get registerCount () { return this._registerCount; }
    set registerCount (registerCount) {
        if ((typeof registerCount === "number") && (registerCount >= 1) && (registerCount <= 120) && (Number.isInteger(registerCount))) {
            this._registerCount = registerCount;
            this._buffer.writeUInt16BE(this._registerCount, 10);
        }
        else {
            throw new Error("Invalid Register Count");
        }
    }

    get buffer () { return this._buffer; }

    mapFromBuffer (buffer) {
        if (super.mapFromBuffer.call(this, buffer) == false) {
            for (let i=8; i<buffer.length; i++) { this._map.push({ "name": "unknown", "value": buffer[i], "length": 1 }); }
            return false;
        }
        this._buffer = buffer;
        if (buffer.length < 10) { return false; }
        this._register = buffer.readUInt16BE(8);
        if (buffer.length < 12) { return false; }
        this._registerCount = buffer.readUInt16BE(10);
        return true;
    }

}