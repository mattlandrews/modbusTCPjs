"use strict";

let assert = require("assert");
const readHoldingRegistersReply = require("../src2/readHoldingRegistersReply.js");

describe("readHoldingRegistersReply", function () {
    describe ("#readHoldingRegistersReply()", function () {
        it("should return a valid readHoldingRegisters query (device 1, data [0])", function () {
            let query = new readHoldingRegistersReply(1, [0]);
            assert.strictEqual(query.transaction, 0);
            assert.strictEqual(query.byteLength, 5);
            assert.strictEqual(query.device, 1);
            assert.strictEqual(query.func, 3);
            assert.strictEqual(query.dataLength, 2);
            assert.deepEqual(query.buffer, Buffer.from([0,0,0,0,0,5,1,3,2,0,0]));
        });
        it("should return a valid readHoldingRegisters query (device 255, data [65533, 65534, 65535])", function () {
            let query = new readHoldingRegistersReply(15, [65533, 65534, 65535]);
            assert.strictEqual(query.transaction, 0);
            assert.strictEqual(query.byteLength, 9);
            assert.strictEqual(query.device, 15);
            assert.strictEqual(query.func, 3);
            assert.strictEqual(query.dataLength, 6);
            assert.deepEqual(query.buffer, Buffer.from([0,0,0,0,0,9,15,3,6,255,253,255,254,255,255]));
        });
        it("should throw an exception (device 0, data [0])", function () {
            assert.throws(() => {
                let query = new readHoldingRegistersReply(0,[0]);
            }, new Error("invalid device"));
        });
        it("should throw an exception (device null, data [0])", function () {
            assert.throws(() => {
                let query = new readHoldingRegistersReply(null,[0]);
            }, new Error("invalid device"));
        });
        it("should throw an exception (device [], data [0])", function () {
            assert.throws(() => {
                let query = new readHoldingRegistersReply([],[0]);
            }, new Error("invalid device"));
        });
        it("should throw an exception (device {}, data [0])", function () {
            assert.throws(() => {
                let query = new readHoldingRegistersReply({},[0]);
            }, new Error("invalid device"));
        });
        it("should throw an exception (device 1, 0)", function () {
            assert.throws(() => {
                let query = new readHoldingRegistersReply(1,0);
            }, new Error("invalid data"));
        });
        it("should throw an exception (device 1, null)", function () {
            assert.throws(() => {
                let query = new readHoldingRegistersReply(1,null);
            }, new Error("invalid data"));
        });
        it("should throw an exception (device 1, [])", function () {
            assert.throws(() => {
                let query = new readHoldingRegistersReply(1,[]);
            }, new Error("invalid data length"));
        });
        it("should throw an exception (device 1, data {})", function () {
            assert.throws(() => {
                let query = new readHoldingRegistersReply(1,{});
            }, new Error("invalid data"));
        });
    });
});