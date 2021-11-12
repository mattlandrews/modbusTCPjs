'use strict';

const MBAP = require("./mbap");

module.exports = function () {

    this.type = "deviceIdentificationQuery";
    this.mbap = new MBAP();
    this.modbus = {
        device: 1,
        function: 43,
        meiType: 14,
        readDeviceId: 1,
        objectType: 0,
        dataByteLength: 5
    };

    this.toBuffer = function () {
        let buffer = Buffer.allocUnsafe(11);
        buffer.writeUInt8(this.modbus.device, 6);
        buffer.writeUInt8(this.modbus.function, 7);
        buffer.writeUInt8(this.modbus.meiType, 8);
        buffer.writeUInt8(this.modbus.readDeviceId, 9);
        buffer.writeUInt8(this.modbus.objectType, 10);
        this.mbap.toBuffer(buffer);
        return buffer;
    }

    return this;
}