module.exports = function modbusReply() {

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
        if (typeof transaction === "number") { _transaction = range(transaction, 0, 65535); }
    }

    this.getDevice = function () { return _device; };
    this.setDevice = function (device) {
        if (typeof device === "number") { _device = range(device, 0, 255); }
    }

    this.getFunction = function () { return _func; };

    this.getRegister = function () { return _register; };

    this.getLength = function () { return _length; };

    this.getData = function () { return _data; };    

    this.getBuffer = function () { return _buffer; };
    this.setBuffer = function (buffer) {
        _transaction = buffer.readUInt16BE(0);
        _protocol = buffer.readUInt16BE(2);
        _byteLength = buffer.readUInt16BE(4);
        _device = buffer.readUInt8(6);
        _func = buffer.readUInt8(7);
        switch (_func) {
            case 3:
                _dataByteLength = buffer.readUInt8(8);
                _data = [];
                for (i = 9; i < (9 + _dataByteLength); i += 2) {
                    _data.push(buffer.readUInt16BE(i));
                }
                break;
        }
    }

    this.readHoldingRegisters = function (data) {
        if (typeof data === "number") { data = [data]; }
        if (Array.isArray(data) == false) { throw new Error("Invalid data"); }
        _func = 3;
        _byteLength = 3 + (data.length * 2);
        _dataByteLength = (data.length * 2);
        _data = data;
        standardQueryToBuffer();
        _buffer.writeUInt8(_dataByteLength, 8);
        for (let i = 0; i < _data.length; i++) { _buffer.writeUInt16BE(_data[i], (9 + (i * 2))); }
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