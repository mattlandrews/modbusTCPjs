"use strict";

const modbusFrame = require("./modbusFrame.js");

module.exports = readHoldingRegistersReply;

function readHoldingRegistersReply () {
    let _dataByteCount = 2;
    let _data = [0];
    let _buffer = new Buffer([0,0,0,0,0,5,1,3,2,0,0]);

    modbusFrame.call(this);
    let baseMapFromBuffer = this.mapFromBuffer;
    baseMapFromBuffer(_buffer);
    this.setFunction(3);

    this.getDataByteCount = function () { return _dataByteCount; };
    
    this.getData = function () { return _data; }
    this.setData = function (data) {
        if ((Array.isArray(data)) && (data.length >= 1) && (data.length <= 120)) {
            let allNumbersValid = true;
            for (let i=0; i<data.length; i++) {
                if ((typeof data[i] !== "number") || (data[i] < 0) || (data[i] > 65535)) {
                    allNumbersValid = false;
                    break;
                }
            }
            if (allNumbersValid) {
                _data = data;
                _buffer = this.resizeBuffer(9 + (_data.length * 2));
                _dataByteCount = (data.length * 2);
                _buffer.writeUInt8(_dataByteCount, 8);
                for (let i=0; i<data.length; i++) { _buffer.writeUInt16BE(_data[i], (9+(i*2))); }
            }
            else {
                throw new Error("Invalid Data");
            }
        }
        else {
            throw new Error("Invalid Data");
        }
    }

    this.mapFromBuffer = function (buffer) {
        if (baseMapFromBuffer.call(this, buffer) == false) { return false; }
        if (buffer.length < 9) { return false; }
        _dataByteCount = buffer.readUInt8(8);
        _data = [];
        let dataLength = _dataByteCount / 2;
        for (let i=0; i<dataLength; i++) {
            if (buffer.length < (9+(i*2))) { return false; }
            _data.push(buffer.readUInt16BE(9+(i*2)));
        }
        _buffer = buffer;
        return true;
    };

    this.getBuffer = function () { return _buffer; };

    return this;
}

readHoldingRegistersReply.prototype = Object.create(modbusFrame.prototype);
readHoldingRegistersReply.prototype.constructor = readHoldingRegistersReply;