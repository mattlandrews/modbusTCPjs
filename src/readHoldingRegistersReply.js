"use strict";

const modbusFrame = require("./modbusFrame.js");

module.exports = readHoldingRegistersReply;

function readHoldingRegistersReply () {
    let _valuesByteCount = 2;
    let _values = [0];
    let _buffer = new Buffer([0,0,0,0,0,5,1,3,2,0,0]);

    modbusFrame.call(this);
    let baseMapFromBuffer = this.mapFromBuffer;
    baseMapFromBuffer(_buffer);
    this.setFunction(3);

    this.getValuesByteCount = function () { return _valuesByteCount; };
    
    this.getValues = function () { return _values; }
    this.setValues = function (values) {
        if ((Array.isArray(values)) && (values.length >= 1) && (values.length <= 120)) {
            let allNumbersValid = true;
            for (let i=0; i<values.length; i++) {
                if ((typeof values[i] !== "number") || (values[i] < 0) || (values[i] > 65535)) {
                    allNumbersValid = false;
                    break;
                }
            }
            if (allNumbersValid) {
                _values = values;
                _buffer = this.resizeBuffer(9 + (_values.length * 2));
                _valuesByteCount = (values.length * 2);
                _buffer.writeUInt8(_valuesByteCount, 8);
                for (let i=0; i<values.length; i++) { _buffer.writeUInt16BE(_values[i], (9+(i*2))); }
            }
            else {
                throw new Error("Invalid Values");
            }
        }
        else {
            throw new Error("Invalid Values");
        }
    }

    this.mapFromBuffer = function (buffer) {
        if (baseMapFromBuffer.call(this, buffer) == false) { return false; }
        if (buffer.length < 9) { return false; }
        _valuesByteCount = buffer.readUInt8(8);
        _values = [];
        let valuesLength = _valuesByteCount / 2;
        for (let i=0; i<valuesLength; i++) {
            if (buffer.length < (9+(i*2))) { return false; }
            _values.push(buffer.readUInt16BE(9+(i*2)));
        }
        _buffer = buffer;
        return true;
    };

    this.getBuffer = function () { return _buffer; };

    return this;
}

readHoldingRegistersReply.prototype = Object.create(modbusFrame.prototype);
readHoldingRegistersReply.prototype.constructor = readHoldingRegistersReply;