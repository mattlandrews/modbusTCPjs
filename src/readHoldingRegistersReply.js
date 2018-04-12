"use strict";

const modbusFrame = require("./modbusFrame.js");

module.exports = class readHoldingRegistersReply extends modbusFrame {

    constructor () {
        super();
        this._byteLength = 5;
        this._function = 3;
        this._valuesByteCount = 2;
        this._values = [0];
        this._buffer = new Buffer([0,0,0,0,0,5,1,3,2,0,0]);
    }

    get valuesByteCount () { return this._valuesByteCount; }
    
    get values () { return this._values; }
    set values (values) {
        if ((Array.isArray(values)) && (values.length >= 1) && (values.length <= 120)) {
            let allNumbersValid = true;
            for (let i=0; i<values.length; i++) {
                if ((typeof values[i] !== "number") || (values[i] < 0) || (values[i] > 65535)) {
                    allNumbersValid = false;
                    break;
                }
            }
            if (allNumbersValid) {
                this._values = values;
                this._buffer = this.resizeBuffer(9 + (this._values.length * 2));
                this._valuesByteCount = (this._values.length * 2);
                this._buffer.writeUInt8(this._valuesByteCount, 8);
                for (let i=0; i<this._values.length; i++) { this._buffer.writeUInt16BE(this._values[i], (9+(i*2))); }
            }
            else {
                throw new Error("Invalid Values");
            }
        }
        else {
            throw new Error("Invalid Values");
        }
    }

    mapFromBuffer (buffer) {
        if (super.mapFromBuffer.call(this, buffer) == false) {
            for (let i=8; i<buffer.length; i++) { this._map.push({ "name": "unknown", "value": buffer[i], "length": 1 }); }
            return false;
        }
        if (buffer.length < 9) { return false; }
        this._valuesByteCount = buffer.readUInt8(8);
        this._values = [];
        let valuesLength = this._valuesByteCount / 2;
        for (let i=0; i<valuesLength; i++) {
            if (buffer.length < (9+(i*2))) { return false; }
            this._values.push(buffer.readUInt16BE(9+(i*2)));
        }
        this._buffer = buffer;
        return true;
    };

    get buffer () { return this._buffer; };
}