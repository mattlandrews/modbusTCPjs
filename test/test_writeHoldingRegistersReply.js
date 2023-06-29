"use strict";

let assert = require("assert");
const MODBUS = require("../src/modbus.js");
const NUM_DYNAMIC_TESTS = 50000;

describe("writeHoldingRegistersReply", function () {

    describe("#constructor", function () {

        it ("is a valid function", function () {
            let modbus = new MODBUS();
            assert.strictEqual(typeof modbus.writeHoldingRegistersReply, "function");
        });

        it ("transaction argument", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.writeHoldingRegistersReply(); }, null, "invalid transaction");
            assert.throws(() => { new modbus.writeHoldingRegistersReply(-1); }, null, "invalid transaction");
            assert.throws(() => { new modbus.writeHoldingRegistersReply(65536); }, null, "invalid transaction");
            assert.doesNotThrow(() => { new modbus.writeHoldingRegistersReply(0,1,0,1); });
        });

        it ("device argument", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.writeHoldingRegistersReply(0); }, null, "invalid device");
            assert.throws(() => { new modbus.writeHoldingRegistersReply(0,0); }, null, "invalid device");
            assert.throws(() => { new modbus.writeHoldingRegistersReply(0,256); }, null, "invalid device");
            assert.doesNotThrow(() => { new modbus.writeHoldingRegistersReply(0,1,0,1); });
        });

        it ("write address argument", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.writeHoldingRegistersReply(0,1); }, null, "invalid write address");
            assert.throws(() => { new modbus.writeHoldingRegistersReply(0,1,-1); }, null, "invalid write address");
            assert.throws(() => { new modbus.writeHoldingRegistersReply(0,1,65536); }, null, "invalid write address");
            assert.doesNotThrow(() => { new modbus.writeHoldingRegistersReply(0,1,0,1); });
        });

        it ("write length argument", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.writeHoldingRegistersReply(0,1,0); }, null, "invalid write length");
            assert.throws(() => { new modbus.writeHoldingRegistersReply(0,1,0,0); }, null, "invalid write length");
            assert.throws(() => { new modbus.writeHoldingRegistersReply(0,1,0,126); }, null, "invalid write length");
            assert.doesNotThrow(() => { new modbus.writeHoldingRegistersReply(0,1,0,1); });
        });

        for (let i=0; i<NUM_DYNAMIC_TESTS; i++) {
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
            });
        }

    });

});