module.exports = function modbusQuery() {

    let _transaction = 0;
    let _protocol = 0;
    let _byteLength = null;
    let _device = 1;
    let _func = null;
    let _register = null;
    let _length = null;
    let _data = null;
    let _dataByteLength = null;
    let _buffer = null;

    this.getTransaction = function () { return _transaction; };
    this.setTransaction = function (transaction) {
        if (typeof transaction === "number") {
            _transaction = range(transaction, 0, 65535);
            if ((_buffer != null) && (_buffer.length >= 2)) { _buffer.writeUInt16BE(_transaction, 0); }
        }
    }

    this.getDevice = function () { return _device; };
    this.setDevice = function (device) {
        if (typeof device === "number") {
            _device = range(device, 0, 255);
            if ((_buffer != null) && (_buffer.length >= 7)) { _buffer.writeUInt8(_device, 6); }
        }
    }

    this.getFunction = function () { return _func; };

    this.getRegister = function () { return _register; };
    
    this.getLength = function () { return _length; };
    
    this.getData = function () { return _data; };
    this.setData = function (data) {
        if (Array.isArray(data) == false) {
            if (typeof data !== "number") { throw new Error("Invalid data type"); }
            data = [data];
        }
        _data = data;
    }

    this.getBuffer = function () { return _buffer; };
    this.setBuffer = function (buffer) {
        _transaction = buffer.readUInt16BE(0);
        _protocol = buffer.readUInt16BE(2);
        _byteLength = buffer.readUInt16BE(4);
        _device = buffer.readUInt8(6);
        _func = buffer.readUInt8(7);
        switch (_func) {
            case 3:
                _register = buffer.readUInt16BE(8);
                _length = buffer.readUInt16BE(10);
                break;
        }
    }

    this.readHoldingRegisters = function (register, length) {
        if (typeof register !== "number") { throw new Error("Invalid holding register"); }
        if (typeof length !== "number") { throw new Error("Invalid length"); }
        _func = 3;
        _register = range(register, 0, 65535);
        _length = range(length, 0, 127);
        _byteLength = 6;
        standardQueryToBuffer();
        _buffer.writeUInt16BE(_register, 8);
        _buffer.writeUInt16BE(_length, 10);
    }

    this.toString = function () {
        return JSON.stringify({
            transaction: _transaction,
            protocol: _protocol,
            byteLength: _byteLength,
            device: _device,
            func: _func,
            register: _register,
            length: _length,
            data: _data,
            dataByteLength: _dataByteLength
        });
    }

    function range(value, min, max) {
        return (value < min) ? min : (value > max) ? max : value;
    }

    function standardQueryToBuffer() {
        _buffer = Buffer.allocUnsafe(6 + _byteLength);
        _buffer.writeUInt16BE(_transaction, 0);
        _buffer.writeUInt16BE(_protocol, 2);
        _buffer.writeUInt16BE(_byteLength, 4);
        _buffer.writeUInt8(_device, 6);
        _buffer.writeUInt8(_func, 7);
    }

    return this;
}