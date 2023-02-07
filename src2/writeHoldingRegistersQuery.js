"use strict";

let modbusFrame = require("./modbusFrame.js");

module.exports = class writeHoldingRegistersQuery extends modbusFrame {

    constructor (arg0, arg1, arg2) {
        if (typeof arg0 !== "number") {
            throw new Error("invalid device");
        }
        if (typeof arg1 !== "number") {
            throw new Error("invalid address");
        }
        if (!Array.isArray(arg2)) {
            throw new Error("invalid data");
        }
        super(Buffer.allocUnsafe(11 + (arg2.length * 2)));
        this.setDevice(arg0);
        this.setFunction(16);
        this.setAddress(arg1);
        this.setDataLength(arg2.length * 2);
        this.setData(arg2);
    }

    setAddress (address) {
        if ((typeof address !== "number") || (address < 0) || (address > 65535)) {
            throw new Error("invalid address");
        }
        else {
            this.address = address;
            this.buffer.writeUInt16BE(address, 8);
        }
    }

    getAddress () {
        return this.address;
    }

    setDataLength (dataLength) {
        if ((typeof dataLength !== "number") || (dataLength < 2) || (dataLength > 240)) {
            throw new Error("invalid data length");
            return;
        }
        else {   
            this.dataLength = dataLength;
            this.buffer.writeUint8(dataLength, 10);
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
                this.buffer.writeUint16BE(data[i], (11 + (i * 2)));
            }
        }
    }

    getData () {
        return this.data;
    }
}