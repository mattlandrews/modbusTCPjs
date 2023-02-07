"use strict";

let assert = require("assert");
const readHoldingRegistersQuery = require("../src2/readHoldingRegistersQuery.js");

describe("readHoldingRegistersQuery", function () {
    describe ("#readHoldingRegistersQuery()", function () {
        it("should return a valid readHoldingRegisters query (device 1, address 0, numAddresses 100)", function () {
            let query = new readHoldingRegistersQuery(1, 0, 100);
            assert.strictEqual(query.transaction, 0);
            assert.strictEqual(query.byteLength, 6);
            assert.strictEqual(query.device, 1);
            assert.strictEqual(query.func, 3);
            assert.strictEqual(query.address, 0);
            assert.strictEqual(query.numAddresses, 100);
            assert.deepEqual(query.buffer, Buffer.from([0,0,0,0,0,6,1,3,0,0,0,100]));
        });
        it("should return a valid readHoldingRegisters query (device 255, address 65535, numAddresses 1)", function () {
            let query = new readHoldingRegistersQuery(255, 65535, 1);
            assert.strictEqual(query.transaction, 0);
            assert.strictEqual(query.byteLength, 6);
            assert.strictEqual(query.device, 255);
            assert.strictEqual(query.func, 3);
            assert.strictEqual(query.address, 65535);
            assert.strictEqual(query.numAddresses, 1);
            assert.deepEqual(query.buffer, Buffer.from([0,0,0,0,0,6,255,3,255,255,0,1]));
        });
        it("should return a valid readHoldingRegisters query (device 78, address 40000, numAddresses 33)", function () {
            let query = new readHoldingRegistersQuery(78, 40000, 33);
            query.setTransaction(50000);
            assert.strictEqual(query.transaction, 50000);
            assert.strictEqual(query.byteLength, 6);
            assert.strictEqual(query.device, 78);
            assert.strictEqual(query.func, 3);
            assert.strictEqual(query.address, 40000);
            assert.strictEqual(query.numAddresses, 33);
            assert.deepEqual(query.buffer, Buffer.from([195,80,0,0,0,6,78,3,156,64,0,33]));
        });
        it("should throw an exception (device 0, address 0, numAddresses 1)", function () {
            assert.throws(() => {
                let query = new readHoldingRegistersQuery(0,0,1);
            }, new Error("invalid device"));
        });
        it("should throw an exception (device null, address 0, numAddresses 1)", function () {
            assert.throws(() => {
                let query = new readHoldingRegistersQuery(null,0,1);
            }, new Error("invalid device"));
        });
        it("should throw an exception (device 0, address 0, numAddresses 1)", function () {
            assert.throws(() => {
                let query = new readHoldingRegistersQuery([],0,1);
            }, new Error("invalid device"));
        });
        it("should throw an exception (device 0, address 0, numAddresses 1)", function () {
            assert.throws(() => {
                let query = new readHoldingRegistersQuery({},0,1);
            }, new Error("invalid device"));
        });
        it("should throw an exception (device 1, address -1, numAddresses 1)", function () {
            assert.throws(() => {
                let query = new readHoldingRegistersQuery(1,-1,1);
            }, new Error("invalid address"));
        });
        it("should throw an exception (device 1, address 65536, numAddresses 1)", function () {
            assert.throws(() => {
                let query = new readHoldingRegistersQuery(1,65536,1);
            }, new Error("invalid address"));
        });
        it("should throw an exception (device 1, address null, numAddresses 1)", function () {
            assert.throws(() => {
                let query = new readHoldingRegistersQuery(1,null,1);
            }, new Error("invalid address"));
        });
        it("should throw an exception (device 1, address [], numAddresses 1)", function () {
            assert.throws(() => {
                let query = new readHoldingRegistersQuery(1,[],1);
            }, new Error("invalid address"));
        });
        it("should throw an exception (device 1, address {}, numAddresses 1)", function () {
            assert.throws(() => {
                let query = new readHoldingRegistersQuery(1,{},1);
            }, new Error("invalid address"));
        });
        it("should throw an exception (device 1, address 0, numAddresses 0)", function () {
            assert.throws(() => {
                let query = new readHoldingRegistersQuery(1,0,0);
            }, new Error("invalid number of addresses"));
        });
        it("should throw an exception (device 1, address 0, numAddresses 121)", function () {
            assert.throws(() => {
                let query = new readHoldingRegistersQuery(1,0,121);
            }, new Error("invalid number of addresses"));
        });
        it("should throw an exception (device 1, address 0, numAddresses null)", function () {
            assert.throws(() => {
                let query = new readHoldingRegistersQuery(1,0,null);
            }, new Error("invalid number of addresses"));
        });
        it("should throw an exception (device 1, address 0, numAddresses [])", function () {
            assert.throws(() => {
                let query = new readHoldingRegistersQuery(1,0,[]);
            }, new Error("invalid number of addresses"));
        });
        it("should throw an exception (device 1, address 0, numAddresses {})", function () {
            assert.throws(() => {
                let query = new readHoldingRegistersQuery(1,0,{});
            }, new Error("invalid number of addresses"));
        });
    });
});