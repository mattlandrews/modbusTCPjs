"use strict";

const _transaction = Symbol("transaction");
const _protocol = Symbol("protocol");
const _byteLength = Symbol("byteLength");
const _device = Symbol("device");
const _function = Symbol("function");
const _buffer = Symbol("buffer");
const _map = Symbol("map");

module.exports = class modbusFrame {

    constructor () {
        this._transaction = 0;
        this._protocol = 0;
        this._byteLength = 2;
        this._device = 1;
        this._function = 1;
        this._buffer = new Buffer([0,0,0,0,0,2,1,1]);
        this._map = {
            "0": { "name": "transaction", "value": 0, "length": 2 },
            "2": { "name": "protocol", "value": 0, "length": 2 },
            "4": { "name": "byteLength", "value": 6, "length": 2 },
            "6": { "name": "device", "value": 1, "length": 1 },
            "7": { "name": "function", "value": 3, "length": 1 }
        };
    }

    get transaction () { return this._transaction; }
    set transaction (transaction) {
        if ((typeof transaction === "number") && (transaction >= 0) && (transaction <= 65535) && (Number.isInteger(transaction))) {
            this._transaction = transaction;
            this._buffer.writeUInt16BE(this._transaction, 0);
        }
        else {
            throw new Error("Invalid Transaction ID");
        }
    }

    get byteLength () { return this._byteLength; }

    get device () { return this._device; }
    set device (device) {
        if ((typeof device === "number") && (device >= 0) && (device <= 255) && (Number.isInteger(device))) {
            this._device = device;
            this._buffer.writeUInt8(this._device,6);
        }
        else {
            throw new Error("Invalid Device ID");
        }
    }

    get function () { return this._function; }
    set function (func) {
        if ((typeof func === "number") && (func >= 0) && (func <= 255) && (Number.isInteger(func))) {
            this._function = func;
            this._buffer.writeUInt8(this._function,7);
        }
        else {
            throw new Error("Invalid Function ID");
        }
    }

    get buffer () { return this._buffer; }

    mapFromBuffer (buffer) {
        if ((buffer == null) || (buffer.length == null) || (buffer.length < 2)) { return false; }
        this._buffer = buffer;
        this._transaction = buffer.readUInt16BE(0);
        if (buffer.length < 4) { return false; }
        this._protocol = buffer.readUInt16BE(2);
        if (buffer.length < 6) { return false; }
        this._byteLength = buffer.readUInt16BE(4);
        if (buffer.length < 7) { return false; }
        this._device = buffer.readUInt8(6);
        if (buffer.length < 8) { return false; }
        this._function = buffer.readUInt8(7);
        return true;
    };

}