"use strict";

const MBAP = require("./mbap.js");

module.exports = function () {

    this.mbap = new MBAP();

    this.device = null;
    this.functionCode = null;
    this.type = null;

    this.fromBuffer = function (buffer) {
        this.mbap.fromBuffer(buffer);
        if (buffer.length < 9) { throw new Error("too short"); }
        this.device = buffer.readUInt8(6);
        this.functionCode = buffer.readUInt8(7);
        if (this.functionCode == 3) { // readHoldingRegisters
            if (buffer.length == 12) { // request
                this.type = "readHoldingRegistersRequest";
                this.address = buffer.readUInt16BE(8);
                this.numAddresses = buffer.readUInt16BE(10);
            }
            else { // response
                this.type = "readHoldingRegistersResponse";
                this.dataLength = buffer.readUInt8(8);
                if (this.dataLength > 240) { throw new Error("readHoldingRegisters: response too long"); return; }
                if ((this.dataLength % 2) !== 0) { throw new Error("readHoldingRegisters: data length cannot be odd"); return; }
                this.data = [];
                for (let i=0; i< this.dataLength; i+=2) {
                    this.data.push(buffer.readUInt16BE(9 + i));
                }
            }
        }
        else if (this.functionCode == 16) { // writeHoldingRegisters

        }
        else if (this.functionCode == 131) { // readHoldingRegisters exception
            
        }
        else { throw new Error("not recoginized"); }
    }

    this.toBuffer = function () {
        let buffer = this.mbap.toBuffer();
        buffer.writeUInt8(this.device, 6);
        buffer.writeUInt8(this.functionCode, 7);
        if (this.type === "readHoldingRegistersRequest") {
            buffer.writeUInt16BE(this.address, 8);
            buffer.writeUInt16BE(this.numAddresses, 10);
        }
        if (this.type === "readHoldingRegistersResponse") {
            buffer.writeUInt8(this.dataLength, 8);
            for (let i=0; i<this.data.length; i++) {
                buffer.writeUInt16BE(this.data[i], (9 + (i * 2)));
            }
        }
        return buffer;
    }

}