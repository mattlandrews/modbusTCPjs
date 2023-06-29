"use strict";

let assert = require("assert");
const MODBUS = require("../src/modbus.js");
const NUM_DYNAMIC_TESTS = 1000;

describe("writeHoldingRegistersRequest", function () {

    describe("#constructor", function () {

        it ("is a valid function", function () {
            let modbus = new MODBUS();
            assert.strictEqual(typeof modbus.writeHoldingRegistersRequest, "function");
        });

        it ("transaction argument", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.writeHoldingRegistersRequest(); }, null, "invalid transaction");
            assert.throws(() => { new modbus.writeHoldingRegistersRequest(-1); }, null, "invalid transaction");
            assert.throws(() => { new modbus.writeHoldingRegistersRequest(65536); }, null, "invalid transaction");
            assert.doesNotThrow(() => { new modbus.writeHoldingRegistersRequest(0,1,0,[0]); });
        });

        it ("device argument", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.writeHoldingRegistersRequest(0); }, null, "invalid device");
            assert.throws(() => { new modbus.writeHoldingRegistersRequest(0,0); }, null, "invalid device");
            assert.throws(() => { new modbus.writeHoldingRegistersRequest(0,256); }, null, "invalid device");
            assert.doesNotThrow(() => { new modbus.writeHoldingRegistersRequest(0,1,0,[0,0]); });
        });

        it ("write address argument", function () {
            let modbus = new MODBUS();
            assert.throws(() => { new modbus.writeHoldingRegistersRequest(0,1); }, null, "invalid write address");
            assert.throws(() => { new modbus.writeHoldingRegistersRequest(0,1,-1); }, null, "invalid write address");
            assert.throws(() => { new modbus.writeHoldingRegistersRequest(0,1,65536); }, null, "invalid write address");
            assert.doesNotThrow(() => { new modbus.writeHoldingRegistersRequest(0,1,0,[0,0,0]); });
        });

        it ("write data argument", function () {
            let modbus = new MODBUS();
            let data = [];
            assert.throws(() => { new modbus.writeHoldingRegistersRequest(0,1,0); }, null, "invalid write data");
            assert.throws(() => { new modbus.writeHoldingRegistersRequest(0,1,0,data); }, null, "invalid write data");
            for (let i=0; i<126; i++) { data.push(0); }
            assert.throws(() => { new modbus.writeHoldingRegistersRequest(0,1,0,data); }, null, "invalid write data");
            assert.doesNotThrow(() => { new modbus.writeHoldingRegistersRequest(0,1,0,[0,0,0,0,0]); });
        });

        for (let i=0; i<NUM_DYNAMIC_TESTS; i++) {
            let t = Math.floor(Math.random() * 65536);
            let d = Math.floor(Math.random() * 255) + 1;
            let wa = Math.floor(Math.random() * 65536);
            let data = new Array(Math.floor(Math.random() * 125) + 1).fill(0);
            it ("writeHoldingRegistersRequest (transaction: " + t + " device: " + d + " writeAddress: " + wa + " data (" + data.length + ") )", function () {
                let modbus = new MODBUS();
                let query = new modbus.writeHoldingRegistersRequest(t, d, wa, data);
                assert.strictEqual(query.getTransaction(), t);
                assert.strictEqual(query.getQueryLength(), (7 + (data.length * 2)));
                assert.strictEqual(query.getDevice(), d);
                assert.strictEqual(query.getFunctionCode(), 16);
                assert.strictEqual(query.getWriteAddress(), wa);
                assert.strictEqual(query.getWriteLength(), data.length);
                assert.strictEqual(query.getDataLength(), data.length * 2);
                assert.deepStrictEqual(query.getData(), data);
                assert.strictEqual(query.getType(), "writeHoldingRegistersRequest");
                let buffer = Buffer.allocUnsafe(13 + (data.length * 2));
                buffer.writeUInt16BE(t, 0);
                buffer.writeUInt16BE(0, 2);
                buffer.writeUInt16BE(7 + (data.length * 2), 4);
                buffer.writeUInt8(d, 6);
                buffer.writeUInt8(16, 7);
                buffer.writeUInt16BE(wa, 8);
                buffer.writeUInt16BE(data.length, 10);
                buffer.writeUInt8((data.length * 2), 12);
                for (let i=13; i<buffer.length; i++) { buffer.writeUInt8(0, i); }
                assert.deepStrictEqual(query.getBuffer(), buffer);
            });
        }

    });

});