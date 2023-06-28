"use strict";

const readHoldingRegistersRequest = require("./readHoldingRegistersRequest.js");
const readHoldingRegistersReply = require("./readHoldingRegistersReply.js");
const modbusException = require("./modbusException.js");

module.exports = function () {
    
    this.readHoldingRegistersRequest = readHoldingRegistersRequest;

    this.readHoldingRegistersReply = readHoldingRegistersReply;

    this.readHoldingRegistersException = function (transaction, device, exceptionCode) { return new modbusException(transaction, device, 131, exceptionCode); }

    this.fromBuffer = function (buffer) {
        if (buffer.length < 9) { throw new Error("buffer too short for valid query"); return; }
        let queryLength = buffer.readUInt16BE(4);
        let functionCode = buffer.readUInt8(7);
        if (functionCode === 3) {
            if ((queryLength % 2) === 0) {
                return (new this.readHoldingRegistersRequest(buffer.readUInt16BE(0), buffer.readUInt8(6), buffer.readUInt16BE(8), buffer.readUInt16BE(10)));
            }
            else {
                let data = [];
                for (let i=9; i<buffer.length; i+=2) { data.push(buffer.readInt16BE(i)); }
                return new this.readHoldingRegistersReply(buffer.readUInt16BE(0), buffer.readUInt8(6), data);
            }
        }
        else if (functionCode === 131) {
            return this.readHoldingRegistersException(buffer.readUInt16BE(0), buffer.readUInt8(6), buffer.readUInt8(8));
        }
    }

}