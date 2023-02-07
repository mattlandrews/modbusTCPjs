"use strict";

let modbusFrame = require("./modbusFrame.js");

module.exports = class readHoldingRegistersReply extends modbusFrame {

    constructor (arg0, arg1) {
        if (typeof arg0 !== "number") {
            throw new Error("invalid device");
        }
        if (!Array.isArray(arg1)) {
            throw new Error("invalid data");
        }
        super(Buffer.allocUnsafe(9 + (arg1.length * 2)));
        this.setDevice(arg0);
        this.setFunction(3);
        this.buffer.writeUInt8(3, 7);
        this.setDataLength(arg1.length * 2);
        this.setData(arg1);
    }

    setDataLength (dataLength) {
        if ((typeof dataLength !== "number") || (dataLength < 2) || (dataLength > 240)) {
            throw new Error("invalid data length");
            return;
        }
        else {   
            this.dataLength = dataLength;
            this.buffer.writeUint8(dataLength, 8);
        }
    }

    getDataLength () {
        return this.dataLength;
    }

    setData (data) {
        if ((Array.isArray(data) == false) || (data.length < 1) || (data.length > 120)) {
            throw new Error("invalid data"); 
            return;
        }
        else {
            this.data = data;
            for (let i=0; i<data.length; i++) {
                this.buffer.writeUint16BE(data[i], (9 + (i * 2)));
            }
        }
    }

    getData () {
        return this.data;
    }
}