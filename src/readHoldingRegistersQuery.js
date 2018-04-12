"use strict";

const modbusFrame = require("./modbusFrame.js");

const _register = Symbol("register");
const _registerCount = Symbol("registerCount");
const _buffer = Symbol("buffer");
const _map = Symbol("map");

module.exports = class readHoldingRegistersQuery extends modbusFrame {

    constructor () {
        super();
        this[_buffer] = new Buffer([0,0,0,0,0,6,1,3,0,0,0,1]);
        this.mapFromBuffer(this[_buffer]);
    }

    getRegister () { return this[_register]; }
    setRegister (register) {
        if ((typeof register === "number") && (register >= 0) && (register <= 65535) && (Number.isInteger(register))) {
            this[_register] = register;
            this[_buffer].writeUInt16BE(this[_register], 8);
        }
        else {
            throw new Error("Invalid Register");
        }
    }

    getRegisterCount () { return this[_registerCount]; }
    setRegisterCount (registerCount) {
        if ((typeof registerCount === "number") && (registerCount >= 1) && (registerCount <= 120) && (Number.isInteger(registerCount))) {
            this[_registerCount] = registerCount;
            this[_buffer].writeUInt16BE(this[_registerCount], 10);
        }
        else {
            throw new Error("Invalid Register Count");
        }
    }

    getBuffer () { return this[_buffer]; }

    mapFromBuffer (buffer) {
        if (super.mapFromBuffer.call(this, buffer) == false) {
            for (let i=8; i<buffer.length; i++) { this[_map].push({ "name": "unknown", "value": buffer[i], "length": 1 }); }
            return false;
        }
        this[_buffer] = buffer;
        this[_map] = super.getMap();
        if (buffer.length < 10) { return false; }
        this[_register] = buffer.readUInt16BE(8);
        this[_map]["8"] = { "name": "register", "value": this[_register], "length": 2 };
        if (buffer.length < 12) { return false; }
        this[_registerCount] = buffer.readUInt16BE(10);
        this[_map]["10"] = { "name": "registerCount", "value": this[_registerCount], "length": 2 };
        for (let i=12; i<buffer.length; i++) { this[_map].push({ "name": "unknown", "value": this[_buffer][i], "length": 1 }); }
        return true;
    }

    getMap () { return this[_map]; }

}