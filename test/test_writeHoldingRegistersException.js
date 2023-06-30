"use strict";

let assert = require("assert");
const MODBUS = require("../src/modbus.js");
const NUM_DYNAMIC_TESTS = 500;

describe("writeHoldingRegistersException", function () {

    describe("#constructor", function () {

        it ("is a valid function", function () {
            let modbus = new MODBUS();
            assert.strictEqual(typeof modbus.writeHoldingRegistersException, "function");
        });

        it ("is a valid function", function () {
            let modbus = new MODBUS();
            assert.strictEqual(typeof modbus.writeHoldingRegistersException, "function");
        });

        it ("transaction of null throws an exception", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.writeHoldingRegistersException(null,1,1); });
        });

        it ("transaction of -1 throws an exception", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.writeHoldingRegistersException(-1,1,1); });
        });

        it ("transaction of 65536 throws an exception", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.writeHoldingRegistersException(65536,1,1); });
        });

        it ("transaction of 0 does not throw an exception", function () {
            let modbus = new MODBUS();
            assert.doesNotThrow(() => { new modbus.writeHoldingRegistersException(0,1,1); });
        });

        it ("transaction of 65535 does not throw an exception", function () {
            let modbus = new MODBUS();
            assert.doesNotThrow(() => { new modbus.writeHoldingRegistersException(65535,1,1); });
        });

        it ("device of null throws an exception", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.writeHoldingRegistersException(0,null,1); });
        });

        it ("device of 0 throws an exception", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.writeHoldingRegistersException(0,0,1); });
        });

        it ("device of 1 does not throw an exception", function () {
            let modbus = new MODBUS();
            assert.doesNotThrow(() => { new modbus.writeHoldingRegistersException(0,1,1); });
        });

        it ("device of 255 does not throw an exception", function () {
            let modbus = new MODBUS();
            assert.doesNotThrow(() => { new modbus.writeHoldingRegistersException(0,255,1); });
        });

        it ("exceptionCode of null throws an exception", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.writeHoldingRegistersException(0,1,null); }, MODBUS.ModbusError);
        });

        it ("exceptionCode of 1 does not throw an exception", function () {
            let modbus = new MODBUS();
            assert.doesNotThrow(() => { new modbus.writeHoldingRegistersException(0,1,1); }, MODBUS.ModbusError);
        });

        for (let i=0; i<NUM_DYNAMIC_TESTS; i++) {
            let t = Math.floor(Math.random() * 65536);
            let d = Math.floor(Math.random() * 255) + 1;
            let exceptionCodes = [1,2,3,4,5,6,8,10,11];
            let exceptionTypes = [
                null,
                "illegal function",
                "illegal data address",
                "illegal data value",
                "slave device failure",
                "acknowledge",
                "slave device busy",
                null,
                "memory parity error",
                null,
                "gateway path unavailable",
                "gateway target failed to respond"
            ];
            let e = exceptionCodes[Math.floor(Math.random() * 9)];
            it ("writeHoldingRegistersException ( transaction: " + t + " device: " + d + " exceptionCode: " + e + " )", function () {
                let modbus = new MODBUS();
                let query = new modbus.writeHoldingRegistersException(t, d, e);
                assert.strictEqual(query.getTransaction(), t);
                assert.strictEqual(query.getQueryLength(), 3);
                assert.strictEqual(query.getDevice(), d);
                assert.strictEqual(query.getFunctionCode(), 144);
                assert.strictEqual(query.getType(), "writeHoldingRegistersException");
                assert.strictEqual(query.getExceptionCode(), e);
                assert.strictEqual(query.getExceptionType(), exceptionTypes[e]);
                let buffer = Buffer.allocUnsafe(9);
                buffer.writeUInt16BE(t, 0);
                buffer.writeUInt16BE(0, 2);
                buffer.writeUInt16BE(3, 4);
                buffer.writeUInt8(d, 6);
                buffer.writeUInt8(144, 7);
                buffer.writeUInt8(e, 8)
                assert.deepStrictEqual(query.getBuffer(), buffer);
            });
        }

    });

});