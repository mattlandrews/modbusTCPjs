'use strict';

const MBAP = require("./mbap");

module.exports = function () {

    this.type = "readHoldingRegistersReply";
    this.mbap = new MBAP();
    this.modbus = {
        device: 1,
        function: 3,
        dataByteLength: 2,
        data: [0]
    };

    this.fromBuffer = function (buffer) {
        this.mbap.fromBuffer(buffer);
        this.modbus.device = buffer.readUInt8(6);
        this.modbus.function = buffer.readUInt8(7);
        if (this.modbus.function === 3) {
            this.modbus.dataByteLength = buffer.readUInt8(8);
            this.modbus.data = [];
            for (let i=0; i<(this.modbus.dataByteLength / 2); i++) {
                this.modbus.data.push(buffer.readUInt16BE((9 + (i*2))));
            }
        }
        else if (this.modbus.function === 131) {
            throw new Error("Modbus Exception: " + buffer.readUInt8(8));
        }
        else {
            throw new Error("unrecognized reply");
        }
        
    }

    return this;
}