"use strict";

let modbusFrame = require("./modbusFrame.js");

module.exports = class readHoldingRegistersQuery extends modbusFrame {

    constructor (arg0, arg1, arg2) {

        super(Buffer.allocUnsafe(12));
        this.setDevice(arg0);
        this.setFunction(3);
        this.buffer.writeUInt8(3, 7);
        this.setAddress(arg1);
        this.setNumAddresses(arg2);
    }

    setAddress (address) {
        if ((typeof address !== "number") || (address < 0) || (address > 65535)) {
            throw new Error("invalid address");
            return;
        }
        else {
            this.address = address;
            this.buffer.writeUInt16BE(address, 8);
        }
    }

    getAddress () {
        return this.address;
    }

    setNumAddresses (numAddresses) {
        if ((typeof numAddresses !== "number") || (numAddresses < 1) || (numAddresses > 120)) {
            throw new Error("invalid number of addresses");
            return;
        }
        else {
            this.numAddresses = numAddresses;
            this.buffer.writeUInt16BE(numAddresses, 10);
        }
    }

}