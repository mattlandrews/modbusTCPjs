"use strict";

module.exports = function modbusFrame () {
    
    let _transaction = 0;
    let _protocol = 0;
    let _byteLength = 2;
    let _device = 1;
    let _function = 1;
    let _buffer = new Buffer([0,0,0,0,0,2,1,1]);

    this.getTransaction = function () { return _transaction; };
    this.setTransaction = function (transaction) {
        if ((typeof transaction === "number") && (transaction >= 0) && (transaction <= 65535) && (Number.isInteger(transaction))) {
            _transaction = transaction;
            _buffer.writeUInt16BE(_transaction, 0);
        }
        else {
            throw new Error("Invalid Transaction ID");
        }
    };

    this.getByteLength = function () { return _byteLength; };
    this.setByteLength = function () {
        if ((_buffer != null) && (_buffer.length != null) && (_buffer.length >= 8)) {
            _byteLength = (_buffer.length - 6);
            _buffer.writeUInt16BE(_byteLength, 4);
        }
    }

    this.getDevice = function () { return _device; };
    this.setDevice = function (device) {
        if ((typeof device === "number") && (device >= 0) && (device <= 255) && (Number.isInteger(device))) {
            _device = device;
            _buffer.writeUInt8(_device,6);
        }
        else {
            throw new Error("Invalid Device ID");
        }
    };

    this.getFunction = function () { return _function; };
    this.setFunction = function (func) {
        if ((typeof func === "number") && (func >= 0) && (func <= 255) && (Number.isInteger(func))) {
            _function = func;
            _buffer.writeUInt8(_function,7);
        }
        else {
            throw new Error("Invalid Function ID");
        }
    };

    this.getBuffer = function () { return _buffer; };
    
    this.resizeBuffer = function (size) {
        let testBuffer = Buffer.allocUnsafe(size);
        testBuffer.fill(_buffer,0,8);
        _buffer = testBuffer;
        this.setByteLength();
        return _buffer;
    }

    this.mapFromBuffer = function (buffer) {
        if ((buffer == null) || (buffer.length == null)) { return false; }
        if (buffer.length < 2) { return false; }
        _transaction = buffer.readUInt16BE(0);
        if (buffer.length < 4) { return false; }
        _protocol = buffer.readUInt16BE(2);
        if (buffer.length < 6) { return false; }
        _byteLength = buffer.readUInt16BE(4);
        if (buffer.length < 7) { return false; }
        _device = buffer.readUInt8(6);
        if (buffer.length < 8) { return false; }
        _function = buffer.readUInt8(7);
        _buffer = buffer;
        return true;
    };

    return this;
}