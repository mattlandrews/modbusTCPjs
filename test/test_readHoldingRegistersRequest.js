"use strict";

let assert = require("assert");
const MODBUS = require("../src/modbus.js");
const NUM_DYNAMIC_TESTS = 50000;

describe("readHoldingRegistersRequest", function () {

    describe("#constructor", function () {

        it ("is a valid function", function () {
            let modbus = new MODBUS();
            assert.strictEqual(typeof modbus.readHoldingRegistersRequest, "function");
        });

        it ("transaction argument", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.readHoldingRegistersRequest(); }, null, "invalid transaction");
            assert.throws(() => { new modbus.readHoldingRegistersRequest(-1); }, null, "invalid transaction");
            assert.throws(() => { new modbus.readHoldingRegistersRequest(65536); }, null, "invalid transaction");
            assert.doesNotThrow(() => { new modbus.readHoldingRegistersRequest(0,1,0,1); });
        });

        it ("device argument", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.readHoldingRegistersRequest(0); }, null, "invalid device");
            assert.throws(() => { new modbus.readHoldingRegistersRequest(0,0); }, null, "invalid device");
            assert.throws(() => { new modbus.readHoldingRegistersRequest(0,256); }, null, "invalid device");
            assert.doesNotThrow(() => { new modbus.readHoldingRegistersRequest(0,1,0,1); });
        });

        it ("read address argument", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.readHoldingRegistersRequest(0,1); }, null, "invalid read address");
            assert.throws(() => { new modbus.readHoldingRegistersRequest(0,1,-1); }, null, "invalid read address");
            assert.throws(() => { new modbus.readHoldingRegistersRequest(0,1,65536); }, null, "invalid read address");
            assert.doesNotThrow(() => { new modbus.readHoldingRegistersRequest(0,1,0,1); });
        });

        it ("read length argument", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.readHoldingRegistersRequest(0,1,0); }, null, "invalid read length");
            assert.throws(() => { new modbus.readHoldingRegistersRequest(0,1,0,0); }, null, "invalid read length");
            assert.throws(() => { new modbus.readHoldingRegistersRequest(0,1,0,126); }, null, "invalid read length");
            assert.doesNotThrow(() => { new modbus.readHoldingRegistersRequest(0,1,0,1); });
        });

        for (let i=0; i<NUM_DYNAMIC_TESTS; i++) {
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
            });
        }

    });

});