const modbusFrame = require("./modbusFrame.js");

module.exports = readHoldingRegistersQuery;

function readHoldingRegistersQuery () {
    let _register = 0;
    let _registerCount = 1;
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

    this.getRegisterCount = function () { return _registerCount; };
    this.setRegisterCount = function (registerCount) {
        if ((typeof registerCount === "number") && (registerCount >= 1) && (registerCount <= 120) && (Number.isInteger(registerCount))) {
            _registerCount = registerCount;
            _buffer.writeUInt16BE(_registerCount, 10);
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
        _registerCount = buffer.readUInt16BE(10);
        _buffer = buffer;
        return true;
    };

    this.getBuffer = function () { return _buffer; };

    return this;
}

readHoldingRegistersQuery.prototype = Object.create(modbusFrame.prototype);
readHoldingRegistersQuery.prototype.constructor = readHoldingRegistersQuery;