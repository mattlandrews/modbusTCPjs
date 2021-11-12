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
        conformityLevel: 1,
        moreFollows: 0,
        nextObjectId: 0,
        numObjects: 1,
        objects:[
            {
                objectId: 0,
                objectLength: 1,
                objectValue: 0
            }
        ],
        dataByteLength: 11
    };

    this.fromBuffer = function (buffer) {
        this.mbap.fromBuffer(buffer);
        this.modbus.device = buffer.readUInt8(6);
        this.modbus.function = buffer.readUInt8(7);
        if (this.modbus.function === 43) {
            this.modbus.meiType = buffer.readUInt8(8);
            this.modbus.modbusreadDeviceId = buffer.readUInt8(9);
            this.modbus.conformityLevel = buffer.readUInt8(10);
            this.modbus.moreFollows = buffer.readUInt8(11);
            this.modbus.nextObjectId = buffer.readUInt8(12);
            this.modbus.numObjects = buffer.readUInt8(13);
            this.modbus.objects = [];
            let offset = 14;
            for (let i=0; i<(this.modbus.numObjects); i++) {
                let obj = {
                    objectId: buffer.readUInt8(offset),
                    objectLength: buffer.readUInt8(offset + 1)
                };
                if ((obj.objectId >= 0) && (obj.objectId <= 2) && ((this.modbus.conformityLevel === 0x1) || (this.modbus.conformityLevel === 0x81))) {
                    obj["objectValue"] = buffer.toString('utf8', (offset + 2), (offset + 2 + obj.objectLength));
                }
                else {
                    obj["objectValue"] = buffer.slice((offset + 2), (offset + 2 + obj.objectLength));
                }
                offset += (obj.objectLength + 2);
                this.modbus.objects.push(obj);
            }
        }
        else if (this.modbus.function === 171) {
            throw new Error("Modbus Exception: " + buffer.readUInt8(8));
        }
        else {
            throw new Error("unrecognized reply");
        }
        
    }

    return this;
}