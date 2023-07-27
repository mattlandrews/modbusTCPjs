"use strict";

let assert = require("assert");
const MODBUS = require("../src/modbus.js");
const { ModbusTransactionError, ModbusDeviceError, ModbusReadAddressError, ModbusReadLengthError, ModbusWriteAddressError } = require("../src/modbusError.js");

describe("readWriteHoldingRegistersRequest", function () {

    describe("#constructor", function () {

        it ("is a valid function", function () {
            let modbus = new MODBUS();
            assert.strictEqual(typeof modbus.readWriteHoldingRegistersRequest, "function");
        });

        it ("transaction of null throws an exception", () => {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.readWriteHoldingRegistersRequest(null, 1, 0, 1, 1, [0]); }, ModbusTransactionError);
        });

        it ("transaction of -1 throws an exception", () => {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.readWriteHoldingRegistersRequest(-1, 1, 0, 1, 1, [0]); }, ModbusTransactionError);
        });

        it ("transaction of 65536 throws an exception", () => {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.readWriteHoldingRegistersRequest(65536, 1, 0, 1, 1, [0]); }, ModbusTransactionError);
        });

        it ("transaction of 0 does not throw an exception", () => {
            let modbus = new MODBUS();
            assert.doesNotThrow(() => { new modbus.readWriteHoldingRegistersRequest(0, 1, 0, 1, 1, [0]); });
        });

        it ("transaction of 65535 does not throw an exception", () => {
            let modbus = new MODBUS();
            assert.doesNotThrow(() => { new modbus.readWriteHoldingRegistersRequest(65535, 1, 0, 1, 1, [0]); });
        });

        it ("device of null throws an exception", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.readWriteHoldingRegistersRequest(0, null, 0, 1, 1, [0]); }, ModbusDeviceError);
        });

        it ("device of 0 throws an exception", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.readWriteHoldingRegistersRequest(0, 0, 0, 1, 1, [0]); }, ModbusDeviceError);
        });

        it ("device of 1 does not throw an exception", function () {
            let modbus = new MODBUS();
            assert.doesNotThrow(() => { new modbus.readWriteHoldingRegistersRequest(0, 1, 0, 1, 1, [0]); });
        });

        it ("device of 255 does not throw an exception", function () {
            let modbus = new MODBUS();
            assert.doesNotThrow(() => { new modbus.readWriteHoldingRegistersRequest(0, 255, 0, 1, 1, [0]); });
        });

        it ("readAddress of null throws an exception", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.readWriteHoldingRegistersRequest(0, 1, null, 1, 1, [0]); }, ModbusReadAddressError);
        });

        it ("readAddress of -1 throws an exception", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.readWriteHoldingRegistersRequest(0, 1, -1, 1, 1, [0]); }, ModbusReadAddressError);
        });

        it ("readAddress of 65536 throws an exception", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.readWriteHoldingRegistersRequest(0, 1, 65536, 1, 1, [0]); }, ModbusReadAddressError);
        });

        it ("readAddress of 0 does not throw an exception", function () {
            let modbus = new MODBUS();
            assert.doesNotThrow(() => { new modbus.readWriteHoldingRegistersRequest(0, 1, 0, 1, 1, [0]); });
        });

        it ("readAddress of 65535 does not throw an exception", function () {
            let modbus = new MODBUS();
            assert.doesNotThrow(() => { new modbus.readWriteHoldingRegistersRequest(0, 1, 65535, 1, 1, [0]); });
        });

        it ("readLength of null throws an exception", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.readWriteHoldingRegistersRequest(0, 1, 0, null, 1, [0]); }, ModbusReadLengthError);
        });

        it ("readLength of 0 throws an exception", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.readWriteHoldingRegistersRequest(0, 1, 0, 0, 1, [0]); }, ModbusReadLengthError);
        });

        it ("readLength of 126 throws an exception", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.readWriteHoldingRegistersRequest(0, 1, 0, 126, 1, [0]); }, ModbusReadLengthError);
        });

        it ("readLength of 1 does not throw an exception", function () {
            let modbus = new MODBUS();
            assert.doesNotThrow(() => { new modbus.readWriteHoldingRegistersRequest(0, 1, 0, 1, 1, [0]); });
        });

        it ("readLength of 125 does not throw an exception", function () {
            let modbus = new MODBUS();
            assert.doesNotThrow(() => { new modbus.readWriteHoldingRegistersRequest(0, 1, 0, 125, 1, [0]); });
        });

        it ("writeAddress of null throws an exception", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.readWriteHoldingRegistersRequest(0, 1, 0, 1, null, [0]); }, ModbusWriteAddressError);
        });

        it ("writeAddress of -1 throws an exception", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.readWriteHoldingRegistersRequest(0, 1, 0, 1, -1, [0]); }, ModbusWriteAddressError);
        });

        it ("writeAddress of 65536 throws an exception", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.readWriteHoldingRegistersRequest(0, 1, 0, 1, 65536, [0]); }, ModbusWriteAddressError);
        });

        it ("writeAddress of 0 does not throw an exception", function () {
            let modbus = new MODBUS();
            assert.doesNotThrow(() => { new modbus.readWriteHoldingRegistersRequest(0, 1, 0, 1, 0, [0]); });
        });

        it ("writeAddress of 65535 does not throw an exception", function () {
            let modbus = new MODBUS();
            assert.doesNotThrow(() => { new modbus.readWriteHoldingRegistersRequest(0, 1, 0, 1, 65535, [0]); });
        });

        it ("data of null throws an exception", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.readWriteHoldingRegistersRequest(0, 1, 0, 1, 1, null); }, MODBUS.ModbusError);
        });

        it ("empty data throws an exception", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.readWriteHoldingRegistersRequest(0, 1, 0, 1, 1, []); }, MODBUS.ModbusError);
        });

        it ("data of length 126 throws an exception", function () {
            let modbus = new MODBUS();
            let data = new Array(126).fill(0);
            assert.throws(() => { new modbus.readWriteHoldingRegistersRequest(0, 1, 0, 1, 1, data); }, MODBUS.ModbusError);
        });

        it ("data of length 1 does not throw an exception", function () {
            let modbus = new MODBUS();
            assert.doesNotThrow(() => { new modbus.readWriteHoldingRegistersRequest(0, 1, 0, 1, 1, [0]); });
        });

        it ("data of length 125 does not throw an exception", function () {
            let modbus = new MODBUS();
            let data = new Array(125).fill(0);
            assert.doesNotThrow(() => { new modbus.readWriteHoldingRegistersRequest(0, 1, 0, 1, 1, data); });
        });

        for (let i=0; i<global.NUM_DYNAMIC_TESTS; i++) {
            let t = Math.floor(Math.random() * 65536);
            let d = Math.floor(Math.random() * 255) + 1;
            let ra = Math.floor(Math.random() * 65536);
            let rl = Math.floor(Math.random() * 125) + 1;
            let wa = Math.floor(Math.random() * 65536);
            let data = new Array(Math.floor(Math.random() * 125) + 1).fill(0);
            it ("readWriteHoldingRegistersRequest (transaction: " + t + " device: " + d + " readAddress: " + ra + " readLength: " + rl + " writeAddress: " + wa + " data(" + data.length + ") )", function () {
                let modbus = new MODBUS();
                let query = new modbus.readWriteHoldingRegistersRequest(t, d, ra, rl, wa, data);
                assert.strictEqual(query.getTransaction(), t);
                assert.strictEqual(query.getQueryLength(), (11 + (data.length * 2)));
                assert.strictEqual(query.getDevice(), d);
                assert.strictEqual(query.getFunctionCode(), 23);
                assert.strictEqual(query.getReadAddress(), ra);
                assert.strictEqual(query.getReadLength(), rl);
                assert.strictEqual(query.getWriteAddress(), wa);
                assert.strictEqual(query.getWriteLength(), data.length);
                assert.strictEqual(query.getDataLength(), data.length * 2);
                assert.deepStrictEqual(query.getData(), data);
                assert.strictEqual(query.getType(), "readWriteHoldingRegistersRequest");
                let buffer = Buffer.allocUnsafe(17 + (data.length * 2));
                buffer.writeUInt16BE(t, 0);
                buffer.writeUInt16BE(0, 2);
                buffer.writeUInt16BE(11 + (data.length * 2), 4);
                buffer.writeUInt8(d, 6);
                buffer.writeUInt8(23, 7);
                buffer.writeUInt16BE(ra, 8);
                buffer.writeUInt16BE(rl, 10);
                buffer.writeUInt16BE(wa, 12);
                buffer.writeUInt16BE(data.length, 14);
                buffer.writeUInt8((data.length * 2), 16);
                for (let i=17; i<buffer.length; i++) { buffer.writeUInt8(0, i); }
                assert.deepStrictEqual(query.getBuffer(), buffer);
            });
        }

    });

});