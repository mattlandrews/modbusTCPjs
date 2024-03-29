"use strict";

const readHoldingRegistersRequest = require("./readHoldingRegistersRequest.js");
const readHoldingRegistersReply = require("./readHoldingRegistersReply.js");
const readHoldingRegistersException = require("./readHoldingRegistersException.js");
const writeHoldingRegistersRequest = require("./writeHoldingRegistersRequest.js");
const writeHoldingRegistersReply = require("./writeHoldingRegistersReply.js");
const writeHoldingRegistersException = require("./writeHoldingRegistersException.js");
const readWriteHoldingRegistersRequest = require("./readWriteHoldingRegistersRequest.js");
const readWriteHoldingRegistersReply = require("./readWriteHoldingRegistersReply.js");
const readWriteHoldingRegistersException = require("./readWriteHoldingRegistersException.js");
const { ModbusError } = require("./modbusError.js");

module.exports = function () {
    
    this.readHoldingRegistersRequest = readHoldingRegistersRequest;

    this.readHoldingRegistersReply = readHoldingRegistersReply;

    this.readHoldingRegistersException = readHoldingRegistersException;

    this.writeHoldingRegistersRequest = writeHoldingRegistersRequest;

    this.writeHoldingRegistersReply = writeHoldingRegistersReply;

    this.writeHoldingRegistersException = writeHoldingRegistersException;

    this.readWriteHoldingRegistersRequest = readWriteHoldingRegistersRequest;
    
    this.readWriteHoldingRegistersReply = readWriteHoldingRegistersReply;

    this.readWriteHoldingRegistersException = readWriteHoldingRegistersException;

    this.requestFromBuffer = function (buffer) {
        if (buffer.length < 9) { throw new ModbusError("buffer too short for valid query"); return; }
        let queryLength = buffer.readUInt16BE(4);
        let functionCode = buffer.readUInt8(7);
        if (functionCode === 3) {
            return (new this.readHoldingRegistersRequest(buffer.readUInt16BE(0), buffer.readUInt8(6), buffer.readUInt16BE(8), buffer.readUInt16BE(10)));
        }
        else if (functionCode === 16) {
            let data = [];
            for (let i=13; i<buffer.length; i+=2) { data.push(buffer.readInt16BE(i)); }
            return (new this.writeHoldingRegistersRequest(buffer.readUInt16BE(0), buffer.readUInt8(6), buffer.readUInt16BE(8), data, buffer.readUInt16BE(10), buffer.readUInt8(12)));
        }
        else if (functionCode === 23) {
            let data = [];
            for (let i=17; i<buffer.length; i+=2) { data.push(buffer.readInt16BE(i)); }
            return (new this.readWriteHoldingRegistersRequest(
                buffer.readUInt16BE(0),
                buffer.readUInt8(6),
                buffer.readUInt16BE(8),
                buffer.readUInt16BE(10),
                buffer.readUInt16BE(12),
                data,
                buffer.readUInt16BE(14),
                buffer.readUInt8(16)
            ));
        }
        else {
            throw new ModbusError("invalid function code");
        }
    }

    this.replyFromBuffer = function (buffer) {
        if (buffer.length < 9) { throw new ModbusError("buffer too short for valid query"); return; }
        let queryLength = buffer.readUInt16BE(4);
        let functionCode = buffer.readUInt8(7);
        if (functionCode === 3) {
            let data = [];
            for (let i=9; i<buffer.length; i+=2) { data.push(buffer.readInt16BE(i)); }
            return new this.readHoldingRegistersReply(buffer.readUInt16BE(0), buffer.readUInt8(6), data);
        }
        else if (functionCode === 16) {
            return (new this.writeHoldingRegistersReply(buffer.readUInt16BE(0), buffer.readUInt8(6), buffer.readUInt16BE(8), buffer.readUInt16BE(10)));
        }
        else if (functionCode === 23) {
            let data = [];
            for (let i=9; i<buffer.length; i+=2) { data.push(buffer.readInt16BE(i)); }
            return (new this.readWriteHoldingRegistersReply(
                buffer.readUInt16BE(0),
                buffer.readUInt8(6),
                data,
                buffer.readUInt8(8)
            ));
        }
        else if (functionCode === 131) {
            return new this.readHoldingRegistersException(buffer.readUInt16BE(0), buffer.readUInt8(6), buffer.readUInt8(8));
        }
        else if (functionCode === 144) {
            return new this.writeHoldingRegistersException(buffer.readUInt16BE(0), buffer.readUInt8(6), buffer.readUInt8(8));
        }
        else if (functionCode === 151) {
            return new this.readWriteHoldingRegistersException(buffer.readUInt16BE(0), buffer.readUInt8(6), buffer.readUInt8(8));
        }
        else {
            throw new ModbusError("invalid function code");
        }
    }
    
}