"use strict";

let assert = require("assert");
const MODBUS = require("../src/modbus.js");
const NUM_DYNAMIC_TESTS = 50000;

describe("modbus", function () {

    describe("#readHoldingRegistersRequest", function () {

        it ("is a valid function", function () {
            let modbus = new MODBUS();
            assert.strictEqual(typeof modbus.readHoldingRegistersRequest, "function");
        });

    });
    
    describe("#readHoldingRegistersReply", function () {

        it ("is a valid function", function () {
            let modbus = new MODBUS();
            assert.strictEqual(typeof modbus.readHoldingRegistersReply, "function");
        });

    });

    describe("#modbusException", function () {

        it ("is a valid function", function () {
            let modbus = new MODBUS();
            assert.strictEqual(typeof modbus.readHoldingRegistersException, "function");
        });

    });

    describe("#fromBuffer()", function () {

        it ("fromBuffer (type: readHoldingRegistersRequest, transaction: 0, device: 0, readAddress: 101, readLength: 10)", function (){
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,0,0,0,0,6,0,3,0,100,0,10]);
            let query;
            assert.throws(()=>{ query = modbus.fromBuffer(buffer); }, null, "invalid device");
        });

        it ("fromBuffer (type: readHoldingRegistersRequest, transaction: 1, device: 1, readAddress: 102, readLength: 0)", function (){
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,1,0,0,0,6,1,3,0,101,0,0]);
            let query;
            assert.throws(()=>{ query = modbus.fromBuffer(buffer); }, null, "Read Length: 0 is less than 1");
        });

        it ("fromBuffer (type: readHoldingRegistersRequest, transaction: 2, device: 1, readAddress: 103, readLength: 126)", function (){
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,2,0,0,0,6,1,3,0,102,0,126]);
            let query;
            assert.throws(()=>{ query = modbus.fromBuffer(buffer); }, null, "Read Length: 126 is greater than 125");
        });

        for (let i=0; i<NUM_DYNAMIC_TESTS; i++) {
            let t = Math.floor(Math.random() * 65536);
            let d = Math.floor(Math.random() * 255) + 1;
            let ra = Math.floor(Math.random() * 65536);
            let rl = Math.floor(Math.random() * 125) + 1;
            it ("fromBuffer (type: readHoldingRegistersRequest, transaction: " + t + " device: " + d + " readAddress: " + ra + " readLength: " + rl + ")", function () {
                let modbus = new MODBUS();
                let buffer = Buffer.from([0,0,0,0,0,6,d,3,0,0,0,rl]);
                buffer.writeUint16BE(t, 0);
                buffer.writeUint16BE(ra, 8);
                let query = modbus.fromBuffer(buffer);
                assert.strictEqual(query.getTransaction(), t);
                assert.strictEqual(query.getQueryLength(), 6);
                assert.strictEqual(query.getDevice(), d);
                assert.strictEqual(query.getFunctionCode(), 3);
                assert.strictEqual(query.getReadAddress(), ra);
                assert.strictEqual(query.getReadLength(), rl);
                assert.strictEqual(query.getType(), "readHoldingRegistersRequest");
            });
        }

        it ("fromBuffer (type: readHoldingRegistersReply, transaction: 0, device: 0, dataLength: 1)", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,0,0,0,0,5,0,3,2,0,0]);
            let query;
            assert.throws(()=>{ query = modbus.fromBuffer(buffer); }, null, "Device ID: 0 is less than 1");
        });

        it ("fromBuffer (type: readHoldingRegistersReply, transaction: 1, device: 1, dataLength: 0)", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,1,0,0,0,3,1,3,0]);
            let query;
            assert.throws(()=>{ query = modbus.fromBuffer(buffer); }, null, "Data Length: 0 is less than 2");
        });

        it ("fromBuffer (type: readHoldingRegistersReply, transaction: 1, device: 1, dataLength: 126)", function () {
            let modbus = new MODBUS();
            let array = [0,1,0,0,1,0,1,3,252];
            for (let i=0; i<121; i++) { array.push(0); array.push(0); }
            let buffer = Buffer.from(array);
            let query;
            assert.throws(()=>{ query = modbus.fromBuffer(buffer); }, null, "Data Length: 252 is greater than 250");
        });

        for (let i=0; i<NUM_DYNAMIC_TESTS; i++) {
            let t = Math.floor(Math.random() * 65536);
            let d = Math.floor(Math.random() * 255) + 1;
            let dl = Math.floor(Math.random() * 125) + 1;
            let data = [];
            for (let i=0; i<dl; i++) { data.push(Math.floor(Math.random() * 65535) - 32768); }
            it ("fromBuffer (type: readHoldingRegistersReply, transaction: " + t + " device: " + d + " dataLength: " + dl + ")", function () {
                let modbus = new MODBUS();
                let buffer = Buffer.allocUnsafe(9 + (dl*2));
                buffer.writeUInt16BE(t, 0);
                buffer.writeUInt16BE(0, 2);
                buffer.writeUInt16BE((3 + (dl*2)), 4);
                buffer.writeUInt8(d, 6);
                buffer.writeUInt8(3, 7);
                buffer.writeUInt8((dl * 2), 8);
                data.forEach((d, i) => { buffer.writeInt16BE(d, (9 + (i * 2))); });
                let query = modbus.fromBuffer(buffer);
                assert.strictEqual(query.getTransaction(), t);
                assert.strictEqual(query.getQueryLength(), (3 + (dl * 2)));
                assert.strictEqual(query.getDevice(), d);
                assert.strictEqual(query.getFunctionCode(), 3);
                assert.deepEqual(query.getData(), data);
                assert.strictEqual(query.getType(), "readHoldingRegistersReply");
            });
        }

        it ("fromBuffer (type: readHoldingRegistersException, transaction: 1, device: 1, exceptionCode: 1)", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,1,0,0,0,3,1,131,1]);
            let query = modbus.fromBuffer(buffer);
            assert.strictEqual(query.getTransaction(), 1);
            assert.strictEqual(query.getQueryLength(), 3);
            assert.strictEqual(query.getDevice(), 1);
            assert.strictEqual(query.getFunctionCode(), 131);
            assert.strictEqual(query.getType(), "readHoldingRegistersException");
            assert.strictEqual(query.getExceptionCode(), 1);
            assert.strictEqual(query.getExceptionType(), "illegal function");
        });

        it ("fromBuffer (type: readHoldingRegistersException, transaction: 2, device: 3, exceptionCode: 2)", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,2,0,0,0,3,3,131,2]);
            let query = modbus.fromBuffer(buffer);
            assert.strictEqual(query.getTransaction(), 2);
            assert.strictEqual(query.getQueryLength(), 3);
            assert.strictEqual(query.getDevice(), 3);
            assert.strictEqual(query.getFunctionCode(), 131);
            assert.strictEqual(query.getType(), "readHoldingRegistersException");
            assert.strictEqual(query.getExceptionCode(), 2);
            assert.strictEqual(query.getExceptionType(), "illegal data address");
        });

        it ("fromBuffer (type: readHoldingRegistersException, transaction: 3, device: 5, exceptionCode: 3)", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,3,0,0,0,3,5,131,3]);
            let query = modbus.fromBuffer(buffer);
            assert.strictEqual(query.getTransaction(), 3);
            assert.strictEqual(query.getQueryLength(), 3);
            assert.strictEqual(query.getDevice(), 5);
            assert.strictEqual(query.getFunctionCode(), 131);
            assert.strictEqual(query.getType(), "readHoldingRegistersException");
            assert.strictEqual(query.getExceptionCode(), 3);
            assert.strictEqual(query.getExceptionType(), "illegal data value");
        });

        it ("fromBuffer (type: readHoldingRegistersException, transaction: 4, device: 7, exceptionCode: 4)", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,4,0,0,0,3,7,131,4]);
            let query = modbus.fromBuffer(buffer);
            assert.strictEqual(query.getTransaction(), 4);
            assert.strictEqual(query.getQueryLength(), 3);
            assert.strictEqual(query.getDevice(), 7);
            assert.strictEqual(query.getFunctionCode(), 131);
            assert.strictEqual(query.getType(), "readHoldingRegistersException");
            assert.strictEqual(query.getExceptionCode(), 4);
            assert.strictEqual(query.getExceptionType(), "slave device failure");
        });

        it ("fromBuffer (type: readHoldingRegistersException, transaction: 5, device: 9, exceptionCode: 5)", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,5,0,0,0,3,9,131,5]);
            let query = modbus.fromBuffer(buffer);
            assert.strictEqual(query.getTransaction(), 5);
            assert.strictEqual(query.getQueryLength(), 3);
            assert.strictEqual(query.getDevice(), 9);
            assert.strictEqual(query.getFunctionCode(), 131);
            assert.strictEqual(query.getType(), "readHoldingRegistersException");
            assert.strictEqual(query.getExceptionCode(), 5);
            assert.strictEqual(query.getExceptionType(), "acknowledge");
        });

        it ("fromBuffer (type: readHoldingRegistersException, transaction: 6, device: 11, exceptionCode: 6)", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,6,0,0,0,3,11,131,6]);
            let query = modbus.fromBuffer(buffer);
            assert.strictEqual(query.getTransaction(), 6);
            assert.strictEqual(query.getQueryLength(), 3);
            assert.strictEqual(query.getDevice(), 11);
            assert.strictEqual(query.getFunctionCode(), 131);
            assert.strictEqual(query.getType(), "readHoldingRegistersException");
            assert.strictEqual(query.getExceptionCode(), 6);
            assert.strictEqual(query.getExceptionType(), "slave device busy");
        });

        it ("fromBuffer (type: readHoldingRegistersException, transaction: 7, device: 13, exceptionCode: 8)", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,7,0,0,0,3,13,131,8]);
            let query = modbus.fromBuffer(buffer);
            assert.strictEqual(query.getTransaction(), 7);
            assert.strictEqual(query.getQueryLength(), 3);
            assert.strictEqual(query.getDevice(), 13);
            assert.strictEqual(query.getFunctionCode(), 131);
            assert.strictEqual(query.getType(), "readHoldingRegistersException");
            assert.strictEqual(query.getExceptionCode(), 8);
            assert.strictEqual(query.getExceptionType(), "memory parity error");
        });

        it ("fromBuffer (type: readHoldingRegistersException, transaction: 8, device: 15, exceptionCode: 10)", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,8,0,0,0,3,15,131,10]);
            let query = modbus.fromBuffer(buffer);
            assert.strictEqual(query.getTransaction(), 8);
            assert.strictEqual(query.getQueryLength(), 3);
            assert.strictEqual(query.getDevice(), 15);
            assert.strictEqual(query.getFunctionCode(), 131);
            assert.strictEqual(query.getType(), "readHoldingRegistersException");
            assert.strictEqual(query.getExceptionCode(), 10);
            assert.strictEqual(query.getExceptionType(), "gateway path unavailable");
        });

        it ("fromBuffer (type: readHoldingRegistersException, transaction: 9, device: 17, exceptionCode: 11)", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,9,0,0,0,3,17,131,11]);
            let query = modbus.fromBuffer(buffer);
            assert.strictEqual(query.getTransaction(), 9);
            assert.strictEqual(query.getQueryLength(), 3);
            assert.strictEqual(query.getDevice(), 17);
            assert.strictEqual(query.getFunctionCode(), 131);
            assert.strictEqual(query.getType(), "readHoldingRegistersException");
            assert.strictEqual(query.getExceptionCode(), 11);
            assert.strictEqual(query.getExceptionType(), "gateway target failed to respond");
        });

        it ("fromBuffer (type: readHoldingRegistersException, transaction: 9, device: 19, exceptionCode: 0)", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,9,0,0,0,3,19,131,0]);
            let query;
            assert.throws(() => { query = modbus.fromBuffer(buffer); }, null, "invalid exception code");
        });

        it ("fromBuffer (type: readHoldingRegistersException, transaction: 11, device: 21, exceptionCode: 7)", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,9,0,0,0,3,21,131,7]);
            let query;
            assert.throws(() => { query = modbus.fromBuffer(buffer); }, null, "invalid exception code");
        });

    });

});