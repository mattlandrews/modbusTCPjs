"use strict";

let assert = require("assert");
const MODBUS = require("../src/modbus.js");

describe("readHoldingRegistersRequest", function () {

    describe("#constructor", function () {

        it ("is a valid function", function () {
            let modbus = new MODBUS();
            assert.strictEqual(typeof modbus.readHoldingRegistersRequest, "function");
        });

        it ("transaction of null throws an exception", () => {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.readHoldingRegistersRequest(null, 1, 0, 1); }, MODBUS.ModbusError);
        });

        it ("transaction of -1 throws an exception", () => {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.readHoldingRegistersRequest(-1, 1, 0, 1); }, MODBUS.ModbusError);
        });

        it ("transaction of 65536 throws an exception", () => {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.readHoldingRegistersRequest(65536, 1, 0, 1); }, MODBUS.ModbusError);
        });

        it ("transaction of 0 does not throw an exception", () => {
            let modbus = new MODBUS();
            assert.doesNotThrow(() => { new modbus.readHoldingRegistersRequest(0, 1, 0, 1); });
        });

        it ("transaction of 65535 does not throw an exception", () => {
            let modbus = new MODBUS();
            assert.doesNotThrow(() => { new modbus.readHoldingRegistersRequest(65535, 1, 0, 1); });
        });

        it ("device of null throws an exception", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.readHoldingRegistersRequest(0, null, 0, 1); }, MODBUS.ModbusError);
        });

        it ("device of 0 throws an exception", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.readHoldingRegistersRequest(0, 0, 0, 1); }, MODBUS.ModbusError);
        });

        it ("device of 1 does not throw an exception", function () {
            let modbus = new MODBUS();
            assert.doesNotThrow(() => { new modbus.readHoldingRegistersRequest(0, 1, 0, 1); });
        });

        it ("device of 255 does not throw an exception", function () {
            let modbus = new MODBUS();
            assert.doesNotThrow(() => { new modbus.readHoldingRegistersRequest(0, 255, 0, 1); });
        });

        it ("readAddress of null throws an exception", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.readHoldingRegistersRequest(0, 1, null, 1); }, MODBUS.ModbusError);
        });

        it ("readAddress of -1 throws an exception", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.readHoldingRegistersRequest(0, 0, -1, 1); }, MODBUS.ModbusError);
        });

        it ("readAddress of 65536 throws an exception", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.readHoldingRegistersRequest(0, 0, 65536, 1); }, MODBUS.ModbusError);
        });

        it ("readAddress of 0 does not throw an exception", function () {
            let modbus = new MODBUS();
            assert.doesNotThrow(() => { new modbus.readHoldingRegistersRequest(0, 1, 0, 1); });
        });

        it ("readAddress of 65535 does not throw an exception", function () {
            let modbus = new MODBUS();
            assert.doesNotThrow(() => { new modbus.readHoldingRegistersRequest(0, 1, 65535, 1); });
        });

        it ("readLength of null throws an exception", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.readHoldingRegistersRequest(0, 1, 0, null); }, MODBUS.ModbusError);
        });

        it ("readLength of 0 throws an exception", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.readHoldingRegistersRequest(0, 0, 0, 0); }, MODBUS.ModbusError);
        });

        it ("readLength of 126 throws an exception", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.readHoldingRegistersRequest(0, 0, 0, 126); }, MODBUS.ModbusError);
        });

        it ("readLength of 1 does not throw an exception", function () {
            let modbus = new MODBUS();
            assert.doesNotThrow(() => { new modbus.readHoldingRegistersRequest(0, 1, 0, 1); });
        });

        it ("readLength of 125 does not throw an exception", function () {
            let modbus = new MODBUS();
            assert.doesNotThrow(() => { new modbus.readHoldingRegistersRequest(0, 1, 0, 125); });
        });

        for (let i=0; i<global.NUM_DYNAMIC_TESTS; i++) {
            let t = Math.floor(Math.random() * 65536);
            let d = Math.floor(Math.random() * 255) + 1;
            let ra = Math.floor(Math.random() * 65536);
            let rl = Math.floor(Math.random() * 125) + 1;
            it ("readHoldingRegistersRequest (transaction: " + t + " device: " + d + " readAddress: " + ra + " readLength: " + rl + ")", function () {
                let modbus = new MODBUS();
                let query = new modbus.readHoldingRegistersRequest(t, d, ra, rl);
                assert.strictEqual(query.getTransaction(), t);
                assert.strictEqual(query.getQueryLength(), 6);
                assert.strictEqual(query.getDevice(), d);
                assert.strictEqual(query.getFunctionCode(), 3);
                assert.strictEqual(query.getReadAddress(), ra);
                assert.strictEqual(query.getReadLength(), rl);
                assert.strictEqual(query.getType(), "readHoldingRegistersRequest");
                let buffer = Buffer.allocUnsafe(12);
                buffer.writeUInt16BE(t, 0);
                buffer.writeUInt16BE(0, 2);
                buffer.writeUInt16BE(6, 4);
                buffer.writeUInt8(d, 6);
                buffer.writeUInt8(3, 7);
                buffer.writeUInt16BE(ra, 8);
                buffer.writeUInt16BE(rl, 10);
                assert.deepStrictEqual(query.getBuffer(), buffer);
            });
        }

    });

});