"use strict";

module.exports = class modbusFrame {

    constructor (buffer) {
        if (buffer.length < 9) {
            throw new Error("buffer too short for valid modbus query/reply");
            return;
        }
        else {
            this.buffer = buffer;
            this.setTransaction(0);
            this.setProtocol(0);
            this.setByteLength(buffer.length - 6);
            this.setDevice(1);
            this.setFunction(3);
        }
        return;
    }

    setTransaction (transaction) {
        if ((typeof transaction !== "number") || (transaction < 0) || (transaction > 65535)) {
            throw new Error("invalid transaction");
            return;
        }
        else {
            this.transaction = transaction;
            this.buffer.writeUInt16BE(transaction, 0);
        }
    }

    getTransaction () {
        return this.transaction;
    }

    setProtocol (protocol) {
        if ((typeof protocol !== "number") || (protocol < 0) || (protocol > 65535)) {
            throw new Error("invalid protocol");
            return;
        }
        else {
            this.protocol = protocol;
            this.buffer.writeUInt16BE(protocol, 2);
        }
    }

    getProtocol () {
        return this.protocol;
    }

    setByteLength (byteLength) {
        if ((typeof byteLength !== "number") || (byteLength < 0) || (byteLength > 247)) {
            throw new Error("invalid byteLength");
            return;
        }
        else {
            this.byteLength = byteLength;
            this.buffer.writeUInt16BE(byteLength, 4);
        }
    }

    getByteLength () {
        return this.byteLength;
    }

    setDevice (device) {
        if ((typeof device !== "number") || (device < 1) || (device > 255)) {
            throw new Error ("invalid device");
            return;
        }
        else {
            this.device = device;
            this.buffer.writeUInt8(device, 6);
        }
    }

    getDevice () {
        return this.device;
    }

    setFunction (func) {
        if ((typeof func !== "number") || (
            (func !== 3) && (func !== 131)
            && (func !== 16) && (func !== 144)
            )) {
            throw new Error("invalid function");
            return;
        }
        else {
            this.func = func;
            this.buffer.writeUInt8(func, 7);
        }
    }

    getFunction () {
        return this.func;
    }
}