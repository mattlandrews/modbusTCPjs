"use strict";

let assert = require("assert");
const MODBUS = require("../src3/modbus.js");
const NUM_DYNAMIC_TESTS = 500;

describe("modbusException", function () {

    describe("#constructor", function () {

        it ("is a valid function", function () {
            let modbus = new MODBUS();
            assert.strictEqual(typeof modbus.readHoldingRegistersReply, "function");
        });

        it ("transaction argument", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.modbusException(); }, null, "invalid transaction");
            assert.throws(() => { new modbus.modbusException(-1); }, null, "invalid transaction");
            assert.throws(() => { new modbus.modbusException(65536); }, null, "invalid transaction");
            assert.doesNotThrow(() => { new modbus.modbusException(0,1,131,1); });
        });

        it ("device argument", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.modbusException(0); }, null, "invalid device");
            assert.throws(() => { new modbus.modbusException(0,0); }, null, "invalid device");
            assert.throws(() => { new modbus.modbusException(0,256); }, null, "invalid device");
            assert.doesNotThrow(() => { new modbus.modbusException(0,1,131,1); });
        });

        it ("functionCode argument", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.modbusException(0,1); }, null, "invalid functionCode");
            assert.throws(() => { new modbus.modbusException(0,1,0); }, null, "invalid functionCode");
            assert.throws(() => { new modbus.modbusException(0,1,256); }, null, "invalid functionCode");
            assert.doesNotThrow(() => { new modbus.modbusException(0,1,131,1); });
        });

        it ("exceptionCode argument", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.modbusException(0,1,131); }, null, "invalid exceptionCode");
            assert.throws(() => { new modbus.modbusException(0,1,131,0); }, null, "invalid exceptionCode");
            assert.throws(() => { new modbus.modbusException(0,1,131,12); }, null, "invalid exceptionCode");
            assert.doesNotThrow(() => { new modbus.modbusException(0,1,131,1); });
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
            it ("readHoldingRegistersReply (transaction: " + t + " device: " + d + " exceptionCode: " + e + " )", function () {
                let modbus = new MODBUS();
                let query = new modbus.modbusException(t, d, 131, e);
                assert.strictEqual(query.getTransaction(), t);
                assert.strictEqual(query.getQueryLength(), 3);
                assert.strictEqual(query.getDevice(), d);
                assert.strictEqual(query.getFunctionCode(), 131);
                assert.strictEqual(query.getType(), "readHoldingRegistersException");
                assert.strictEqual(query.getExceptionCode(), e);
                assert.strictEqual(query.getExceptionType(), exceptionTypes[e]);
            });
        }

    });

});