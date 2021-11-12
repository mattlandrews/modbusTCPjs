'use strict';

const MBAP = require("./mbap");

module.exports = function () {

    this.type = "readHoldingRegistersQuery";
    this.mbap = new MBAP();
    this.modbus = {
        device: 1,
        function: 3,
        address: 0,
        length: 1
    };

    this.toBuffer = function () {
        let buffer = Buffer.allocUnsafe(12);
        buffer.writeUInt8(this.modbus.device, 6);
        buffer.writeUInt8(this.modbus.function, 7);
        buffer.writeUInt16BE(this.modbus.address, 8);
        buffer.writeUInt16BE(this.modbus.length, 10);
        this.mbap.toBuffer(buffer);
        return buffer;
    }

    return this;
}