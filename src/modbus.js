"use strict";

module.exports = function () {

    this.type = null;
    this.transaction = null;
    this.queryLength = null;
    this.device = null;
    this.functionCode = null;
    this.readAddress = null;
    this.readLength = null;
    this.data = null;
    this.writeAddress = null;
    this.writeLength = null;
    this.exceptionCode = null;

    function testRange (value, valueName, min, max) {
        if (value < min) { throw new Error(valueName + ": " + value + " is less than " + min); return min; }
        if (value > max) { throw new Error(valueName + ": " + value + " is greater than " + max); return max; }
        return value;
    }

    this.readHoldingRegistersRequest = function (transaction, device, readAddress, readLength) {
        this.type = "readHoldingRegistersRequest";
        this.transaction = testRange( transaction, "Transaction ID", 0, 65535 );
        this.queryLength = 6;
        this.device = testRange( device, "Device ID", 1, 255 );
        this.functionCode = 3;
        this.readAddress = testRange( readAddress, "Read Address", 0, 65535 );
        this.readLength = testRange( readLength, "Read Length", 1, 125 );
    }

    this.readHoldingRegistersReply = function (transaction, device, data) {
        this.type = "readHoldingRegistersReply";
        if (Array.isArray(data) === false) { throw new Error("Data is not an array"); return; }
        if (data.length < 1) { throw new Error("Data array too short"); return; }
        if (data.length > 125) { throw new Error("Data array too long"); return; }
        this.transaction = testRange( transaction, "Transaction ID", 0, 65535 );
        this.queryLength = (3 + (data.length * 2));
        this.device = testRange( device, "Device ID", 1, 255 );
        this.functionCode = 3;
        this.data = new Array(data.length);
        data.forEach((d, i) => {
            this.data[i] = testRange( d, "data element", -32768, 32767 );
        });
    }

    this.readHoldingRegistersException = function ( transaction, device, exceptionCode ) {
        this.type = "readHoldingRegistersException";
        this.transaction = testRange( transaction, "Transaction ID", 0, 65535 );
        this.queryLength = 3;
        this.device = testRange( device, "Device ID", 1, 255 );
        this.functionCode = 131;
        this.exceptionCode = testRange( exceptionCode, "Exception Code", 1, 4 );
    }

    this.writeHoldingRegistersRequest = function (transaction, device, writeAddress, data) {
        this.type = "writeHoldingRegistersRequest";
        if (Array.isArray(data) === false) { throw new Error("Data is not an array"); return; }
        if (data.length < 1) { throw new Error("Data array too short"); return; }
        if (data.length > 125) { throw new Error("Data array too long"); return; }
        this.transaction = testRange( transaction, "Transaction ID", 0, 65535 );
        this.queryLength = (5 + (data.length * 2));
        this.device = testRange( device, "Device ID", 1, 255 );
        this.functionCode = 16;
        this.writeAddress = testRange( writeAddress, "Read Address", 0, 65535 );
        this.writeLength = data.length;
        this.data = new Array(data.length);
        data.forEach((d, i) => {
            this.data[i] = testRange( d, "data element", -32768, 32767 );
        });
    }

    this.writeHoldingRegistersReply = function (transaction, device, writeAddress, writeLength ) {
        this.type = "writeHoldingRegistersReply";
        this.transaction = testRange( transaction, "Transaction ID", 0, 65535 );
        this.queryLength = 6;
        this.device = testRange( device, "Device ID", 1, 255 );
        this.functionCode = 16;
        this.writeAddress = testRange( writeAddress, "Write Address", 0, 65535 );
        this.writeLength = testRange( writeLength, "Write Address", 1, 125);
    }

    this.writeHoldingRegistersException = function ( transaction, device, exceptionCode ) {
        this.type = "readHoldingRegistersException";
        this.transaction = testRange( transaction, "Transaction ID", 0, 65535 );
        this.queryLength = 3;
        this.device = testRange( device, "Device ID", 1, 255 );
        this.functionCode = 144;
        this.exceptionCode = testRange( exceptionCode, "Exception Code", 1, 4 );
    }

    this.fromBuffer = function (buffer) {
        this.transaction = buffer.readUInt16BE(0);
        this.queryLength = buffer.readUInt16BE(4);
        this.device = buffer.readUInt8(6);
        this.functionCode = buffer.readUInt8(7);
        if (this.functionCode === 3) {
            if (this.queryLength === 6) {
                this.type = "readHoldingRegistersRequest";
                this.readAddress = buffer.readUInt16BE(8);
                this.readLength = buffer.readUInt16BE(10);
            }
            else {
                this.type = "readHoldingRegistersReply";
                let dataLength = buffer.readUInt8(8);
                this.data = [];
                for (let i=0; i<dataLength; i+=2) {
                    this.data.push(buffer.readInt16BE(9 + i));
                }
            }
        }
        else if (this.functionCode === 16) {
            if (this.queryLength >= 9) {
                this.type = "writeHoldingRegistersRequest";
                this.writeAddress = buffer.readUInt16BE(8);
                this.writeLength = buffer.readUInt16BE(10);
                let dataLength = buffer.readUInt8(12);
                this.data = [];
                for (let i=0; i<dataLength; i+=2) {
                    this.data.push(buffer.readInt16BE(13 + i));
                }
            }
            else {
                this.type = "writeHoldingRegistersReply";
                this.writeAddress = buffer.readUInt16BE(8);
                this.writeLength = buffer.readUInt16BE(10);
            }
        }
        else if (this.functionCode === 23) {
            let dataLength = buffer.readUInt8(8);
            if ((dataLength > 0) && (dataLength <= 240) && (dataLength === (this.queryLength - 2))) {
                this.type = "readWriteHoldingRegistersReply";
                this.data = [];
                for (let i=0; i<dataLength; i+=2) {
                    this.data.push(buffer.readInt16BE(9 + i));
                }
            }
            else {
                this.type = "readWriteHoldingRegistersRequest";
                this.readAddress = buffer.readUInt16BE(8);
                this.readLength = buffer.readUInt16BE(10);
                this.writeAddress = buffer.readUInt16BE(12);
                this.writeLength = buffer.readUInt16BE(14);
                this.data = [];
                let dataLength = buffer.readUInt8(16);
                for (let i=0; i<dataLength; i+=2) {
                    this.data.push(buffer.readInt16BE(17 + i));
                }
            }
        }
        else if (this.functionCode === 131) {
            this.type = "readHoldingRegistersException";
            this.exceptionCode = buffer.readUInt8(8);
        }
        else if (this.functionCode === 144) {
            this.type = "writeHoldingRegistersException";
            this.exceptionCode = buffer.readUInt8(8);
        }
        else if (this.functionCode === 151) {
            this.type = "readWriteHoldingRegistersException";
            this.exceptionCode = buffer.readUInt8(8);
        }
    }

    this.toBuffer = function () {
        let buffer = Buffer.allocUnsafe(6 + this.queryLength);
        buffer.writeUInt16BE(this.transaction, 0);
        buffer.writeUInt16BE(0, 2);
        buffer.writeUInt16BE(this.queryLength, 4);
        buffer.writeUInt8(this.device, 6);
        buffer.writeUInt8(this.functionCode, 7);
        if (this.type === "readHoldingRegistersRequest") {
            buffer.writeUInt16BE(this.readAddress, 8);
            buffer.writeUInt16BE(this.readLength, 10);
        }
        else if (this.type === "readHoldingRegistersReply") {
            buffer.writeUInt8((this.data.length * 2), 8);
            for (let i=0; i<this.data.length; i++) {
                buffer.writeInt16BE(this.data[i], (9 + (i * 2)));
            }
        }
        else if (this.type === "readHoldingRegistersException") {
            buffer.writeUInt8(this.exceptionCode, 8);
        }
        else if (this.type === "writeHoldingRegistersRequest") {
            buffer.writeUInt16BE(this.writeAddress, 8);
            buffer.writeUInt16BE(this.writeLength, 10);
            buffer.writeUInt8((this.data.length * 2), 12);
            for (let i=0; i<this.data.length; i++) {
                buffer.writeInt16BE(this.data[i], (13 + (i * 2)));
            }
        }
        else if (this.type === "writeHoldingRegistersReply") {
            buffer.writeUInt16BE(this.writeAddress, 8);
            buffer.writeUInt16BE(this.writeLength, 10);
        }
        else if (this.type === "writeHoldingRegistersException") {
            buffer.writeUInt8(this.exceptionCode, 8);
        }
        else if (this.type === "readWriteHoldingRegistersRequest") {
            buffer.writeUInt16BE(this.readAddress, 8);
            buffer.writeUInt16BE(this.readLength, 10);
            buffer.writeUInt16BE(this.writeAddress, 12);
            buffer.writeUInt16BE(this.writeLength, 14);
            buffer.writeUInt8(this.data.length * 2, 16);
            for (let i=0; i<this.data.length; i++) {
                buffer.writeInt16BE(this.data[i], (17 + (i * 2)));
            }
        }
        else if (this.type === "readWriteHoldingRegistersReply") {
            buffer.writeUInt8(this.data.length * 2, 8);
            for (let i=0; i<this.data.length; i++) {
                buffer.writeInt16BE(this.data[i], (9 + (i * 2)));
            }
        }
        else if (this.type === "readWriteHoldingRegistersException") {
            buffer.writeUInt8(this.exceptionCode, 8);
        }
        return buffer;
    }

    return this;

}
