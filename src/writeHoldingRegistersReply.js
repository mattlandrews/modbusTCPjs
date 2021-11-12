'use strict';

const MBAP = require("./mbap");

module.exports = function () {

    this.type = "writeHoldingRegistersReply";
    this.mbap = new MBAP();
    this.modbus = {
        device: 1,
        function: 16,
        address: 0,
        length: 1
    };

    this.fromBuffer = function (buffer) {
        this.mbap.fromBuffer(buffer);
        this.modbus.device = buffer.readUInt8(6);
        this.modbus.function = buffer.readUInt8(7);
        if (this.modbus.function === 16) {
            this.modbus.address = buffer.readUInt16BE(8);
            this.modbus.length = buffer.readUInt16BE(10);
        }
        else if (this.modbus.function === 144) {
            throw new Error("Modbus Exception: " + buffer.readUInt8(8));
        }
        else {
            throw new Error("unrecognized reply");
        }
    }

    return this;
}