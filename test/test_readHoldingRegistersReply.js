"use strict";

let assert = require("assert");
const MODBUS = require("../src3/modbus.js");
const NUM_DYNAMIC_TESTS = 500;

describe("readHoldingRegistersReply", function () {

    describe("#constructor", function () {

        it ("is a valid function", function () {
            let modbus = new MODBUS();
            assert.strictEqual(typeof modbus.readHoldingRegistersReply, "function");
        });

        it ("transaction argument", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.readHoldingRegistersReply(); }, null, "invalid transaction");
            assert.throws(() => { new modbus.readHoldingRegistersReply(-1); }, null, "invalid transaction");
            assert.throws(() => { new modbus.readHoldingRegistersReply(65536); }, null, "invalid transaction");
            assert.doesNotThrow(() => { new modbus.readHoldingRegistersReply(0,1,[0]); });
        });

        it ("device argument", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.readHoldingRegistersReply(0); }, null, "invalid device");
            assert.throws(() => { new modbus.readHoldingRegistersReply(0,0); }, null, "invalid device");
            assert.throws(() => { new modbus.readHoldingRegistersReply(0,256); }, null, "invalid device");
            assert.doesNotThrow(() => { new modbus.readHoldingRegistersReply(0,1,[0]); });
        });

        it ("data argument", function () {
            let modbus = new MODBUS();
            let data = [];
            assert.throws(() => { new modbus.readHoldingRegistersReply(0,1); }, null, "invalid device");
            assert.throws(() => { new modbus.readHoldingRegistersReply(0,1,data); }, null, "invalid device");
            data.fill(0, 0, 126);
            assert.throws(() => { new modbus.readHoldingRegistersReply(0,1,data); }, null, "invalid device");
            assert.doesNotThrow(() => { new modbus.readHoldingRegistersReply(0,1,[0,0,0]); });
        });

        for (let i=0; i<NUM_DYNAMIC_TESTS; i++) {
            let t = Math.floor(Math.random() * 65536);
            let d = Math.floor(Math.random() * 255) + 1;
            let data = new Array(Math.floor(Math.random() * 125) + 1).fill(0);
            it ("readHoldingRegistersReply (transaction: " + t + " device: " + d + " data(" + data.length + ") )", function () {
                let modbus = new MODBUS();
                let query = new modbus.readHoldingRegistersReply(t, d, data);
                assert.strictEqual(query.getTransaction(), t);
                assert.strictEqual(query.getQueryLength(), 3 + (data.length * 2));
                assert.strictEqual(query.getDevice(), d);
                assert.strictEqual(query.getFunctionCode(), 3);
                assert.strictEqual(query.getDataLength(), data.length);
                assert.deepStrictEqual(query.getData(), data);
                assert.strictEqual(query.getType(), "readHoldingRegistersReply");
            });
        }

    });

});