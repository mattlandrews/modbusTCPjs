"use strict";

let assert = require("assert");
const MODBUS = require("../src/modbus.js");
const { ModbusTransactionError, ModbusDeviceError, ModbusReadAddressError, ModbusReadLengthError, ModbusWriteAddressError } = require("../src/modbusError.js");

describe("readWriteHoldingRegistersReply", function () {

    describe("#constructor", function () {

        it ("is a valid function", function () {
            let modbus = new MODBUS();
            assert.strictEqual(typeof modbus.readWriteHoldingRegistersReply, "function");
        });

        it ("transaction of null throws an exception", () => {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.readWriteHoldingRegistersReply(null, 1, [0]); }, ModbusTransactionError);
        });

        it ("transaction of -1 throws an exception", () => {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.readWriteHoldingRegistersReply(-1, 1, [0]); }, ModbusTransactionError);
        });

        it ("transaction of 65536 throws an exception", () => {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.readWriteHoldingRegistersReply(65536, 1, [0]); }, ModbusTransactionError);
        });

        it ("transaction of 0 does not throw an exception", () => {
            let modbus = new MODBUS();
            assert.doesNotThrow(() => { new modbus.readWriteHoldingRegistersReply(0, 1, [0]); });
        });

        it ("transaction of 65535 does not throw an exception", () => {
            let modbus = new MODBUS();
            assert.doesNotThrow(() => { new modbus.readWriteHoldingRegistersReply(65535, 1, [0]); });
        });

        it ("device of null throws an exception", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.readWriteHoldingRegistersReply(0, null, [0]); }, ModbusDeviceError);
        });

        it ("device of 0 throws an exception", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.readWriteHoldingRegistersReply(0, 0, [0]); }, ModbusDeviceError);
        });

        it ("device of 1 does not throw an exception", function () {
            let modbus = new MODBUS();
            assert.doesNotThrow(() => { new modbus.readWriteHoldingRegistersReply(0, 1, [0]); });
        });

        it ("device of 255 does not throw an exception", function () {
            let modbus = new MODBUS();
            assert.doesNotThrow(() => { new modbus.readWriteHoldingRegistersReply(0, 255, [0]); });
        });

        it ("data of null throws an exception", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.readWriteHoldingRegistersReply(0, 1, null); }, modbus.ModbusError);
        });

        it ("empty data throws an exception", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.readWriteHoldingRegistersReply(0, 1, []); }, modbus.ModbusError);
        });

        it ("data of length 126 throws an exception", function () {
            let modbus = new MODBUS();
            let data = new Array(126).fill(0);
            assert.throws(() => { new modbus.readWriteHoldingRegistersReply(0, 1, data); }, modbus.ModbusError);
        });

        it ("data of length 1 does not throw an exception", function () {
            let modbus = new MODBUS();
            assert.doesNotThrow(() => { new modbus.readWriteHoldingRegistersReply(0, 1, [0]); });
        });

        it ("data of length 125 does not throw an exception", function () {
            let modbus = new MODBUS();
            let data = new Array(125).fill(0);
            assert.doesNotThrow(() => { new modbus.readWriteHoldingRegistersReply(0, 1, data); });
        });

        for (let i=0; i<global.NUM_DYNAMIC_TESTS; i++) {
            let t = Math.floor(Math.random() * 65536);
            let d = Math.floor(Math.random() * 255) + 1;
            let data = new Array(Math.floor(Math.random() * 125) + 1).fill(0);
            it ("readWriteHoldingRegistersReply (transaction: " + t + " device: " + d + " data(" + data.length + ") )", function () {
                let modbus = new MODBUS();
                let query = new modbus.readWriteHoldingRegistersReply(t, d, data);
                assert.strictEqual(query.getTransaction(), t);
                assert.strictEqual(query.getQueryLength(), (3 + (data.length * 2)));
                assert.strictEqual(query.getDevice(), d);
                assert.strictEqual(query.getFunctionCode(), 23);
                assert.strictEqual(query.getDataLength(), data.length * 2);
                assert.deepStrictEqual(query.getData(), data);
                assert.strictEqual(query.getType(), "readWriteHoldingRegistersReply");
                let buffer = Buffer.allocUnsafe(9 + (data.length * 2));
                buffer.writeUInt16BE(t, 0);
                buffer.writeUInt16BE(0, 2);
                buffer.writeUInt16BE(3 + (data.length * 2), 4);
                buffer.writeUInt8(d, 6);
                buffer.writeUInt8(23, 7);
                buffer.writeUInt8((data.length * 2), 8);
                for (let i=9; i<buffer.length; i++) { buffer.writeUInt8(0, i); }
                assert.deepStrictEqual(query.getBuffer(), buffer);
            });
        }

    });

});