"use strict";

let assert = require("assert");
const MODBUS = require("../src/modbus.js");
const NUM_DYNAMIC_TESTS = 1000;

describe("readHoldingRegistersException", function () {

    describe("#constructor", function () {

        it ("is a valid function", function () {
            let modbus = new MODBUS();
            assert.strictEqual(typeof modbus.readHoldingRegistersReply, "function");
        });

        it ("transaction argument", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.readHoldingRegistersException(); }, null, "invalid transaction");
            assert.throws(() => { new modbus.readHoldingRegistersException(-1); }, null, "invalid transaction");
            assert.throws(() => { new modbus.readHoldingRegistersException(65536); }, null, "invalid transaction");
            assert.doesNotThrow(() => { new modbus.readHoldingRegistersException(0,1,1); });
        });

        it ("device argument", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.readHoldingRegistersException(0); }, null, "invalid device");
            assert.throws(() => { new modbus.readHoldingRegistersException(0,0); }, null, "invalid device");
            assert.throws(() => { new modbus.readHoldingRegistersException(0,256); }, null, "invalid device");
            assert.doesNotThrow(() => { new modbus.readHoldingRegistersException(0,1,1); });
        });

        it ("functionCode argument", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.readHoldingRegistersException(0,1); }, null, "invalid functionCode");
            assert.throws(() => { new modbus.readHoldingRegistersException(0,1,0); }, null, "invalid functionCode");
            assert.throws(() => { new modbus.readHoldingRegistersException(0,1,256); }, null, "invalid functionCode");
            assert.doesNotThrow(() => { new modbus.readHoldingRegistersException(0,1,1); });
        });

        it ("exceptionCode argument", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.readHoldingRegistersException(0,1,131); }, null, "invalid exceptionCode");
            assert.throws(() => { new modbus.readHoldingRegistersException(0,1,131,0); }, null, "invalid exceptionCode");
            assert.throws(() => { new modbus.readHoldingRegistersException(0,1,131,12); }, null, "invalid exceptionCode");
            assert.doesNotThrow(() => { new modbus.readHoldingRegistersException(0,1,1); });
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
            it ("readHoldingRegistersException ( transaction: " + t + " device: " + d + " exceptionCode: " + e + " )", function () {
                let modbus = new MODBUS();
                let query = new modbus.readHoldingRegistersException(t, d, e);
                assert.strictEqual(query.getTransaction(), t);
                assert.strictEqual(query.getQueryLength(), 3);
                assert.strictEqual(query.getDevice(), d);
                assert.strictEqual(query.getFunctionCode(), 131);
                assert.strictEqual(query.getType(), "readHoldingRegistersException");
                assert.strictEqual(query.getExceptionCode(), e);
                assert.strictEqual(query.getExceptionType(), exceptionTypes[e]);
                let buffer = Buffer.allocUnsafe(9);
                buffer.writeUInt16BE(t, 0);
                buffer.writeUInt16BE(0, 2);
                buffer.writeUInt16BE(3, 4);
                buffer.writeUInt8(d, 6);
                buffer.writeUInt8(131, 7);
                buffer.writeUInt8(e, 8);
                assert.deepStrictEqual(query.getBuffer(), buffer);
            });
        }

    });

});