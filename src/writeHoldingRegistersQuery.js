'use strict';

const MBAP = require("./mbap");

module.exports = function () {

    this.type = "writeHoldingRegistersQuery";
    this.mbap = new MBAP();
    this.modbus = {
        device: 1,
        function: 16,
        address: 0,
        length: 1,
        dataByteLength: 2,
        data: [0]
    };

    this.toBuffer = function () {
        let buffer = Buffer.allocUnsafe(13 + (this.modbus.data.length * 2));
        buffer.writeUInt8(this.modbus.device, 6);
        buffer.writeUInt8(this.modbus.function, 7);
        buffer.writeUInt16BE(this.modbus.address, 8);
        buffer.writeUInt16BE(this.modbus.length, 10);
        buffer.writeUInt8(this.modbus.dataByteLength, 12);
        for (let i=0; i<this.modbus.data.length; i++) {
            buffer.writeUInt16BE(this.modbus.data[i], (13 + (i * 2)));
        }
        this.mbap.toBuffer(buffer);
        return buffer;
    }

    return this;
}