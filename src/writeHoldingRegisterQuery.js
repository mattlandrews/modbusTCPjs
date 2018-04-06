"use strict";

const modbusFrame = require("./modbusFrame.js");

module.exports = writeHoldingRegisterQuery;

function writeHoldingRegisterQuery () {
    let _register = 0;
    let _value = 1;
    let _buffer = new Buffer([0,0,0,0,0,6,1,3,0,0,0,1]);

    modbusFrame.call(this);
    let baseMapFromBuffer = this.mapFromBuffer;
    baseMapFromBuffer(_buffer);
    this.setFunction(3);

    this.getRegister = function () { return _register; };
    this.setRegister = function (register) {
        if ((typeof register === "number") && (register >= 0) && (register <= 65535) && (Number.isInteger(register))) {
            _register = register;
            _buffer.writeUInt16BE(_register, 8);
        }
        else {
            throw new Error("Invalid Register");
        }
    };

    this.getValue = function () { return _value; };
    this.setValue = function (value) {
        if ((typeof value === "number") && (value >= 0) && (value <= 65535) && (Number.isInteger(value))) {
            _value = value;
            _buffer.writeUInt16BE(_value, 10);
        }
        else {
            throw new Error("Invalid Register Count");
        }
    };

    this.mapFromBuffer = function (buffer) {
        if (baseMapFromBuffer.call(this, buffer) == false) { return false; }
        if (buffer.length < 10) { return false; }
        _register = buffer.readUInt16BE(8);
        if (buffer.length < 12) { return false; }
        _value = buffer.readUInt16BE(10);
        _buffer = buffer;
        return true;
    };

    this.getBuffer = function () { return _buffer; };

    return this;
}

writeHoldingRegisterQuery.prototype = Object.create(modbusFrame.prototype);
writeHoldingRegisterQuery.prototype.constructor = writeHoldingRegisterQuery;