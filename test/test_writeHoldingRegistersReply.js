"use strict";

let assert = require("assert");
const MODBUS = require("../src/modbus.js");

describe("writeHoldingRegistersReply", function () {

    describe("#constructor", function () {

        it ("is a valid function", function () {
            let modbus = new MODBUS();
            assert.strictEqual(typeof modbus.writeHoldingRegistersReply, "function");
        });
        
        it ("transaction of null throws an exception", () => {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.writeHoldingRegistersReply(null, 1, 0, 1); }, MODBUS.ModbusError);
        });

        it ("transaction of -1 throws an exception", () => {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.writeHoldingRegistersReply(-1, 1, 0, 1); }, MODBUS.ModbusError);
        });

        it ("transaction of 65536 throws an exception", () => {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.writeHoldingRegistersReply(65536, 1, 0, 1); }, MODBUS.ModbusError);
        });

        it ("transaction of 0 does not throw an exception", () => {
            let modbus = new MODBUS();
            assert.doesNotThrow(() => { new modbus.writeHoldingRegistersReply(0, 1, 0, 1); });
        });

        it ("transaction of 65535 does not throw an exception", () => {
            let modbus = new MODBUS();
            assert.doesNotThrow(() => { new modbus.writeHoldingRegistersReply(65535, 1, 0, 1); });
        });

        it ("device of null throws an exception", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.writeHoldingRegistersReply(0, null, 0, 1); }, MODBUS.ModbusError);
        });

        it ("device of 0 throws an exception", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.writeHoldingRegistersReply(0, 0, 0, 1); }, MODBUS.ModbusError);
        });

        it ("device of 1 does not throw an exception", function () {
            let modbus = new MODBUS();
            assert.doesNotThrow(() => { new modbus.writeHoldingRegistersReply(0, 1, 0, 1); });
        });

        it ("device of 255 does not throw an exception", function () {
            let modbus = new MODBUS();
            assert.doesNotThrow(() => { new modbus.writeHoldingRegistersReply(0, 255, 0, 1); });
        });

        it ("writeAddress of null throws an exception", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.readHoldingRegistersRequest(0, 1, null, 1); }, MODBUS.ModbusError);
        });

        it ("writeAddress of -1 throws an exception", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.readHoldingRegistersRequest(0, 0, -1, 1); }, MODBUS.ModbusError);
        });

        it ("writeAddress of 65536 throws an exception", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.readHoldingRegistersRequest(0, 0, 65536, 1); }, MODBUS.ModbusError);
        });

        it ("writeAddress of 0 does not throw an exception", function () {
            let modbus = new MODBUS();
            assert.doesNotThrow(() => { new modbus.readHoldingRegistersRequest(0, 1, 0, 1); });
        });

        it ("writeAddress of 65535 does not throw an exception", function () {
            let modbus = new MODBUS();
            assert.doesNotThrow(() => { new modbus.readHoldingRegistersRequest(0, 1, 65535, 1); });
        });

        it ("writeLength of null throws an exception", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.readHoldingRegistersRequest(0, 1, 0, null); }, MODBUS.ModbusError);
        });

        it ("writeLength of 0 throws an exception", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.readHoldingRegistersRequest(0, 0, 0, 0); }, MODBUS.ModbusError);
        });

        it ("writeLength of 126 throws an exception", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.readHoldingRegistersRequest(0, 0, 0, 126); }, MODBUS.ModbusError);
        });

        it ("writeLength of 1 does not throw an exception", function () {
            let modbus = new MODBUS();
            assert.doesNotThrow(() => { new modbus.readHoldingRegistersRequest(0, 1, 0, 1); });
        });

        it ("writeLength of 125 does not throw an exception", function () {
            let modbus = new MODBUS();
            assert.doesNotThrow(() => { new modbus.readHoldingRegistersRequest(0, 1, 0, 125); });
        });

        for (let i=0; i<global.NUM_DYNAMIC_TESTS; i++) {
            let t = Math.floor(Math.random() * 65536);
            let d = Math.floor(Math.random() * 255) + 1;
            let wa = Math.floor(Math.random() * 65536);
            let wl = Math.floor(Math.random() * 125) + 1;
            it ("writeHoldingRegistersReply (transaction: " + t + " device: " + d + " writeAddress: " + wa + " writeLength: " + wl + ")", function () {
                let modbus = new MODBUS();
                let query = new modbus.writeHoldingRegistersReply(t, d, wa, wl);
                assert.strictEqual(query.getTransaction(), t);
                assert.strictEqual(query.getQueryLength(), 6);
                assert.strictEqual(query.getDevice(), d);
                assert.strictEqual(query.getFunctionCode(), 16);
                assert.strictEqual(query.getWriteAddress(), wa);
                assert.strictEqual(query.getWriteLength(), wl);
                assert.strictEqual(query.getType(), "writeHoldingRegistersReply");
                let buffer = Buffer.allocUnsafe(12);
                buffer.writeUInt16BE(t, 0);
                buffer.writeUInt16BE(0, 2);
                buffer.writeUInt16BE(6, 4);
                buffer.writeUInt8(d, 6);
                buffer.writeUInt8(16, 7);
                buffer.writeUInt16BE(wa, 8);
                buffer.writeUInt16BE(wl, 10);
                assert.deepStrictEqual(query.getBuffer(), buffer);
            });
        }

    });

});