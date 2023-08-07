"use strict";

let assert = require("assert");
const MODBUS = require("../src/modbus.js");
const { ModbusTransactionError, ModbusQueryLengthError, ModbusDeviceError, ModbusReadLengthError, ModbusWriteAddressError, ModbusWriteLengthError, ModbusExceptionCodeError } = require("../src/modbusError.js");
global["NUM_DYNAMIC_TESTS"] = 20000;

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

    describe("#readHoldingRegistersException", function () {

        it ("is a valid function", function () {
            let modbus = new MODBUS();
            assert.strictEqual(typeof modbus.readHoldingRegistersException, "function");
        });

    });

    describe("#writeHoldingRegistersRequest", function () {

        it ("is a valid function", function () {
            let modbus = new MODBUS();
            assert.strictEqual(typeof modbus.writeHoldingRegistersRequest, "function");
        });

    });
    
    describe("#writeHoldingRegistersReply", function () {

        it ("is a valid function", function () {
            let modbus = new MODBUS();
            assert.strictEqual(typeof modbus.writeHoldingRegistersReply, "function");
        });

    });

    describe("#writeHoldingRegistersException", function () {

        it ("is a valid function", function () {
            let modbus = new MODBUS();
            assert.strictEqual(typeof modbus.writeHoldingRegistersException, "function");
        });

    });

    describe("#readWriteHoldingRegistersRequest", function () {

        it ("is a valid function", function () {
            let modbus = new MODBUS();
            assert.strictEqual(typeof modbus.readWriteHoldingRegistersRequest, "function");
        });

    });
    
    describe("#readWriteHoldingRegistersReply", function () {

        it ("is a valid function", function () {
            let modbus = new MODBUS();
            assert.strictEqual(typeof modbus.readWriteHoldingRegistersReply, "function");
        });

    });

    describe("#readWriteHoldingRegistersException", function () {

        it ("is a valid function", function () {
            let modbus = new MODBUS();
            assert.strictEqual(typeof modbus.readWriteHoldingRegistersException, "function");
        });

    });

    describe("#requestFromBuffer() - readHoldingRegistersRequest", function () {

        it ("device of 0 throws an exception", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,0,0,0,0,6,0,3,0,100,0,10]);
            let query;
            assert.throws(()=>{ query = modbus.requestFromBuffer(buffer); }, ModbusDeviceError);
        });

        it ("readLength of 0 throws an exception", function (){
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,1,0,0,0,6,1,3,0,101,0,0]);
            let query;
            assert.throws(()=>{ query = modbus.requestFromBuffer(buffer); }, ModbusReadLengthError);
        });

        it ("readLength of 126 throws an exception", function (){
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,2,0,0,0,6,1,3,0,102,0,126]);
            let query;
            assert.throws(()=>{ query = modbus.requestFromBuffer(buffer); }, ModbusReadLengthError);
        });

        for (let i=0; i<global.NUM_DYNAMIC_TESTS; i++) {
            let t = Math.floor(Math.random() * 65536);
            let d = Math.floor(Math.random() * 255) + 1;
            let ra = Math.floor(Math.random() * 65536);
            let rl = Math.floor(Math.random() * 125) + 1;
            it ("transaction: " + t + " device: " + d + " readAddress: " + ra + " readLength: " + rl, function () {
                let modbus = new MODBUS();
                let buffer = Buffer.from([0,0,0,0,0,6,d,3,0,0,0,rl]);
                buffer.writeUint16BE(t, 0);
                buffer.writeUint16BE(ra, 8);
                let query = modbus.requestFromBuffer(buffer);
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

    describe("#replyFromBuffer() - readHoldingRegistersReply", function () {

        it ("device of 0 throws an exception", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,0,0,0,0,5,0,3,2,0,0]);
            let query;
            assert.throws(()=>{ query = modbus.replyFromBuffer(buffer); }, ModbusDeviceError);
        });

        it ("dataLength of 0 throws an exception", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,1,0,0,0,3,1,3,0]);
            let query;
            assert.throws(()=>{ query = modbus.replyFromBuffer(buffer); }, ModbusReadLengthError);
        });

        it ("dataLength of 252 throws an exception", function () {
            let modbus = new MODBUS();
            let array = [0,1,0,0,1,0,1,3,252];
            for (let i=0; i<126; i++) { array.push(0); array.push(0); }
            let buffer = Buffer.from(array);
            let query;
            assert.throws(()=>{ query = modbus.replyFromBuffer(buffer); }, ModbusReadLengthError);
        });

        for (let i=0; i<global.NUM_DYNAMIC_TESTS; i++) {
            let t = Math.floor(Math.random() * 65536);
            let d = Math.floor(Math.random() * 255) + 1;
            let dl = Math.floor(Math.random() * 125) + 1;
            let data = [];
            for (let i=0; i<dl; i++) { data.push(Math.floor(Math.random() * 65535) - 32768); }
            it ("transaction: " + t + " device: " + d + " dataLength: " + dl, function () {
                let modbus = new MODBUS();
                let buffer = Buffer.allocUnsafe(9 + (dl*2));
                buffer.writeUInt16BE(t, 0);
                buffer.writeUInt16BE(0, 2);
                buffer.writeUInt16BE((3 + (dl*2)), 4);
                buffer.writeUInt8(d, 6);
                buffer.writeUInt8(3, 7);
                buffer.writeUInt8((dl * 2), 8);
                data.forEach((d, i) => { buffer.writeInt16BE(d, (9 + (i * 2))); });
                let query = modbus.replyFromBuffer(buffer);
                assert.strictEqual(query.getTransaction(), t);
                assert.strictEqual(query.getQueryLength(), (3 + (dl * 2)));
                assert.strictEqual(query.getDevice(), d);
                assert.strictEqual(query.getFunctionCode(), 3);
                assert.deepEqual(query.getData(), data);
                assert.strictEqual(query.getType(), "readHoldingRegistersReply");
            });
        }

    });

    describe("#exceptionFromBuffer() - readHoldingRegistersException", function () {

        it ("exceptionCode 0 throws an exception", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,9,0,0,0,3,19,131,0]);
            let query;
            assert.throws(() => { query = modbus.exceptionFromBuffer(buffer); }, ModbusExceptionCodeError);
        });
        
        it ("exceptionCode 1 (illegal function)", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,1,0,0,0,3,1,131,1]);
            let query = modbus.exceptionFromBuffer(buffer);
            assert.strictEqual(query.getTransaction(), 1);
            assert.strictEqual(query.getQueryLength(), 3);
            assert.strictEqual(query.getDevice(), 1);
            assert.strictEqual(query.getFunctionCode(), 131);
            assert.strictEqual(query.getType(), "readHoldingRegistersException");
            assert.strictEqual(query.getExceptionCode(), 1);
            assert.strictEqual(query.getExceptionType(), "illegal function");
        });

        it ("exceptionCode 2 (illegal data address)", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,2,0,0,0,3,3,131,2]);
            let query = modbus.exceptionFromBuffer(buffer);
            assert.strictEqual(query.getTransaction(), 2);
            assert.strictEqual(query.getQueryLength(), 3);
            assert.strictEqual(query.getDevice(), 3);
            assert.strictEqual(query.getFunctionCode(), 131);
            assert.strictEqual(query.getType(), "readHoldingRegistersException");
            assert.strictEqual(query.getExceptionCode(), 2);
            assert.strictEqual(query.getExceptionType(), "illegal data address");
        });

        it ("exceptionCode 3 (illegal data value)", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,3,0,0,0,3,5,131,3]);
            let query = modbus.exceptionFromBuffer(buffer);
            assert.strictEqual(query.getTransaction(), 3);
            assert.strictEqual(query.getQueryLength(), 3);
            assert.strictEqual(query.getDevice(), 5);
            assert.strictEqual(query.getFunctionCode(), 131);
            assert.strictEqual(query.getType(), "readHoldingRegistersException");
            assert.strictEqual(query.getExceptionCode(), 3);
            assert.strictEqual(query.getExceptionType(), "illegal data value");
        });

        it ("exceptionCode 4 (slave device failure)", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,4,0,0,0,3,7,131,4]);
            let query = modbus.exceptionFromBuffer(buffer);
            assert.strictEqual(query.getTransaction(), 4);
            assert.strictEqual(query.getQueryLength(), 3);
            assert.strictEqual(query.getDevice(), 7);
            assert.strictEqual(query.getFunctionCode(), 131);
            assert.strictEqual(query.getType(), "readHoldingRegistersException");
            assert.strictEqual(query.getExceptionCode(), 4);
            assert.strictEqual(query.getExceptionType(), "slave device failure");
        });

        it ("exceptionCode 5 (acknowledge)", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,5,0,0,0,3,9,131,5]);
            let query = modbus.exceptionFromBuffer(buffer);
            assert.strictEqual(query.getTransaction(), 5);
            assert.strictEqual(query.getQueryLength(), 3);
            assert.strictEqual(query.getDevice(), 9);
            assert.strictEqual(query.getFunctionCode(), 131);
            assert.strictEqual(query.getType(), "readHoldingRegistersException");
            assert.strictEqual(query.getExceptionCode(), 5);
            assert.strictEqual(query.getExceptionType(), "acknowledge");
        });

        it ("exceptionCode 6 (slave device busy)", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,6,0,0,0,3,11,131,6]);
            let query = modbus.exceptionFromBuffer(buffer);
            assert.strictEqual(query.getTransaction(), 6);
            assert.strictEqual(query.getQueryLength(), 3);
            assert.strictEqual(query.getDevice(), 11);
            assert.strictEqual(query.getFunctionCode(), 131);
            assert.strictEqual(query.getType(), "readHoldingRegistersException");
            assert.strictEqual(query.getExceptionCode(), 6);
            assert.strictEqual(query.getExceptionType(), "slave device busy");
        });

        it ("exceptionCode 7 throws an exception", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,9,0,0,0,3,21,131,7]);
            let query;
            assert.throws(() => { query = modbus.exceptionFromBuffer(buffer); }, ModbusExceptionCodeError);
        });

        it ("exceptionCode 8 (memory parity error)", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,7,0,0,0,3,13,131,8]);
            let query = modbus.exceptionFromBuffer(buffer);
            assert.strictEqual(query.getTransaction(), 7);
            assert.strictEqual(query.getQueryLength(), 3);
            assert.strictEqual(query.getDevice(), 13);
            assert.strictEqual(query.getFunctionCode(), 131);
            assert.strictEqual(query.getType(), "readHoldingRegistersException");
            assert.strictEqual(query.getExceptionCode(), 8);
            assert.strictEqual(query.getExceptionType(), "memory parity error");
        });

        it ("exceptionCode 9 throws an exception", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,9,0,0,0,3,21,131,9]);
            let query;
            assert.throws(() => { query = modbus.exceptionFromBuffer(buffer); }, ModbusExceptionCodeError);
        });

        it ("exceptionCode 10 (gateway path unavailable)", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,8,0,0,0,3,15,131,10]);
            let query = modbus.exceptionFromBuffer(buffer);
            assert.strictEqual(query.getTransaction(), 8);
            assert.strictEqual(query.getQueryLength(), 3);
            assert.strictEqual(query.getDevice(), 15);
            assert.strictEqual(query.getFunctionCode(), 131);
            assert.strictEqual(query.getType(), "readHoldingRegistersException");
            assert.strictEqual(query.getExceptionCode(), 10);
            assert.strictEqual(query.getExceptionType(), "gateway path unavailable");
        });

        it ("exceptionCode 11 (gateway target failed to respond)", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,9,0,0,0,3,17,131,11]);
            let query = modbus.exceptionFromBuffer(buffer);
            assert.strictEqual(query.getTransaction(), 9);
            assert.strictEqual(query.getQueryLength(), 3);
            assert.strictEqual(query.getDevice(), 17);
            assert.strictEqual(query.getFunctionCode(), 131);
            assert.strictEqual(query.getType(), "readHoldingRegistersException");
            assert.strictEqual(query.getExceptionCode(), 11);
            assert.strictEqual(query.getExceptionType(), "gateway target failed to respond");
        });

        it ("exceptionCode 12 throws an exception", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,9,0,0,0,3,21,131,12]);
            let query;
            assert.throws(() => { query = modbus.exceptionFromBuffer(buffer); }, ModbusExceptionCodeError);
        });

    });
    
    describe("#requestFromBuffer() - writeHoldingRegistersRequest", function () {

        it ("device of 0 throws an exception", function (){
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,0,0,0,0,9,0,16,0,100,0,1,2,0,0]);
            let query;
            assert.throws(()=>{ query = modbus.requestFromBuffer(buffer); }, ModbusDeviceError);
        });

        it ("writeLength of 0 throws an exception", function (){
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,0,0,0,0,9,1,16,0,100,0,0,2,0,0]);
            let query;
            assert.throws(()=>{ query = modbus.requestFromBuffer(buffer); }, ModbusWriteLengthError);
        });

        it ("writeLength of 126 throws an exception", function (){
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,0,0,0,0,9,1,16,0,100,0,126,2,0,0]);
            let query;
            assert.throws(()=>{ query = modbus.requestFromBuffer(buffer); }, ModbusWriteLengthError);
        });

        it ("dataLength of 0 throws an exception", function (){
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,0,0,0,0,7,1,16,0,100,0,1,0]);
            let query;
            assert.throws(()=>{ query = modbus.requestFromBuffer(buffer); }, ModbusWriteLengthError);
        });

        it ("dataLength of 252 throws an exception", function (){
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,0,0,0,0,7,1,16,0,100,0,1,252]);
            let query;
            assert.throws(()=>{ query = modbus.requestFromBuffer(buffer); }, ModbusWriteLengthError);
        });

        for (let i=0; i<global.NUM_DYNAMIC_TESTS; i++) {
            let t = Math.floor(Math.random() * 65536);
            let d = Math.floor(Math.random() * 255) + 1;
            let wa = Math.floor(Math.random() * 65536);
            let wl = Math.floor(Math.random() * 125) + 1;
            let data = [];
            for (let i=0; i<wl; i++) { data.push(Math.floor(Math.random() * 65535) - 32768); }
            it ("transaction: " + t + " device: " + d + " writeAddress: " + wa + " writeLength: " + wl, function () {
                let modbus = new MODBUS();
                let buffer = Buffer.allocUnsafe(13 + (wl*2));
                buffer.writeUInt16BE(t, 0);
                buffer.writeUInt16BE(0, 2);
                buffer.writeUInt16BE((7 + (wl*2)), 4);
                buffer.writeUInt8(d, 6);
                buffer.writeUInt8(16, 7);
                buffer.writeUInt16BE(wa, 8);
                buffer.writeUInt16BE(wl, 10);
                buffer.writeUInt8((wl * 2), 12);
                data.forEach((d, i) => { buffer.writeInt16BE(d, (13 + (i * 2))); });
                let query = modbus.requestFromBuffer(buffer);
                assert.strictEqual(query.getTransaction(), t);
                assert.strictEqual(query.getQueryLength(), (7 + (wl * 2)));
                assert.strictEqual(query.getDevice(), d);
                assert.strictEqual(query.getFunctionCode(), 16);
                assert.strictEqual(query.getWriteAddress(), wa);
                assert.strictEqual(query.getWriteLength(), wl);
                assert.strictEqual(query.getDataLength(), (wl * 2));
                assert.deepEqual(query.getData(), data);
                assert.strictEqual(query.getType(), "writeHoldingRegistersRequest");
            });
        }
    });

    describe("#replyFromBuffer() - writeHoldingRegistersReply", function () {

        it ("device of 0 throws an exception", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,0,0,0,0,6,0,16,0,0,0,1]);
            let query;
            assert.throws(()=>{ query = modbus.replyFromBuffer(buffer); }, ModbusDeviceError);
        });

        it ("writeLength of 0 throws an exception", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,0,0,0,0,6,1,16,0,0,0,0]);
            let query;
            assert.throws(()=>{ query = modbus.replyFromBuffer(buffer); }, ModbusWriteLengthError);
        });

        it ("writeLength of 126 throws an exception", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,0,0,0,0,6,1,16,0,0,0,126]);
            let query;
            assert.throws(()=>{ query = modbus.replyFromBuffer(buffer); }, ModbusWriteLengthError);
        });

        for (let i=0; i<global.NUM_DYNAMIC_TESTS; i++) {
            let t = Math.floor(Math.random() * 65536);
            let d = Math.floor(Math.random() * 255) + 1;
            let dl = Math.floor(Math.random() * 125) + 1;
            let data = [];
            for (let i=0; i<dl; i++) { data.push(Math.floor(Math.random() * 65535) - 32768); }
            it ("transaction: " + t + " device: " + d + " dataLength: " + dl, function () {
                let modbus = new MODBUS();
                let buffer = Buffer.allocUnsafe(9 + (dl*2));
                buffer.writeUInt16BE(t, 0);
                buffer.writeUInt16BE(0, 2);
                buffer.writeUInt16BE((3 + (dl*2)), 4);
                buffer.writeUInt8(d, 6);
                buffer.writeUInt8(3, 7);
                buffer.writeUInt8((dl * 2), 8);
                data.forEach((d, i) => { buffer.writeInt16BE(d, (9 + (i * 2))); });
                let query = modbus.replyFromBuffer(buffer);
                assert.strictEqual(query.getTransaction(), t);
                assert.strictEqual(query.getQueryLength(), (3 + (dl * 2)));
                assert.strictEqual(query.getDevice(), d);
                assert.strictEqual(query.getFunctionCode(), 3);
                assert.deepEqual(query.getData(), data);
                assert.strictEqual(query.getType(), "readHoldingRegistersReply");
            });
        }

    });

    describe("#exceptionFromBuffer() - writeHoldingRegistersException", function () {

        it ("exceptionCode 0 throws an exception", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,9,0,0,0,3,19,144,0]);
            let query;
            assert.throws(() => { query = modbus.exceptionFromBuffer(buffer); }, ModbusExceptionCodeError);
        });
        
        it ("exceptionCode 1 (illegal function)", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,1,0,0,0,3,1,144,1]);
            let query = modbus.exceptionFromBuffer(buffer);
            assert.strictEqual(query.getTransaction(), 1);
            assert.strictEqual(query.getQueryLength(), 3);
            assert.strictEqual(query.getDevice(), 1);
            assert.strictEqual(query.getFunctionCode(), 144);
            assert.strictEqual(query.getType(), "writeHoldingRegistersException");
            assert.strictEqual(query.getExceptionCode(), 1);
            assert.strictEqual(query.getExceptionType(), "illegal function");
        });

        it ("exceptionCode 2 (illegal data address)", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,2,0,0,0,3,3,144,2]);
            let query = modbus.exceptionFromBuffer(buffer);
            assert.strictEqual(query.getTransaction(), 2);
            assert.strictEqual(query.getQueryLength(), 3);
            assert.strictEqual(query.getDevice(), 3);
            assert.strictEqual(query.getFunctionCode(), 144);
            assert.strictEqual(query.getType(), "writeHoldingRegistersException");
            assert.strictEqual(query.getExceptionCode(), 2);
            assert.strictEqual(query.getExceptionType(), "illegal data address");
        });

        it ("exceptionCode 3 (illegal data value)", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,3,0,0,0,3,5,144,3]);
            let query = modbus.exceptionFromBuffer(buffer);
            assert.strictEqual(query.getTransaction(), 3);
            assert.strictEqual(query.getQueryLength(), 3);
            assert.strictEqual(query.getDevice(), 5);
            assert.strictEqual(query.getFunctionCode(), 144);
            assert.strictEqual(query.getType(), "writeHoldingRegistersException");
            assert.strictEqual(query.getExceptionCode(), 3);
            assert.strictEqual(query.getExceptionType(), "illegal data value");
        });

        it ("exceptionCode 4 (slave device failure)", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,4,0,0,0,3,7,144,4]);
            let query = modbus.exceptionFromBuffer(buffer);
            assert.strictEqual(query.getTransaction(), 4);
            assert.strictEqual(query.getQueryLength(), 3);
            assert.strictEqual(query.getDevice(), 7);
            assert.strictEqual(query.getFunctionCode(), 144);
            assert.strictEqual(query.getType(), "writeHoldingRegistersException");
            assert.strictEqual(query.getExceptionCode(), 4);
            assert.strictEqual(query.getExceptionType(), "slave device failure");
        });

        it ("exceptionCode 5 (acknowledge)", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,5,0,0,0,3,9,144,5]);
            let query = modbus.exceptionFromBuffer(buffer);
            assert.strictEqual(query.getTransaction(), 5);
            assert.strictEqual(query.getQueryLength(), 3);
            assert.strictEqual(query.getDevice(), 9);
            assert.strictEqual(query.getFunctionCode(), 144);
            assert.strictEqual(query.getType(), "writeHoldingRegistersException");
            assert.strictEqual(query.getExceptionCode(), 5);
            assert.strictEqual(query.getExceptionType(), "acknowledge");
        });

        it ("exceptionCode 6 (slave device busy)", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,6,0,0,0,3,11,144,6]);
            let query = modbus.exceptionFromBuffer(buffer);
            assert.strictEqual(query.getTransaction(), 6);
            assert.strictEqual(query.getQueryLength(), 3);
            assert.strictEqual(query.getDevice(), 11);
            assert.strictEqual(query.getFunctionCode(), 144);
            assert.strictEqual(query.getType(), "writeHoldingRegistersException");
            assert.strictEqual(query.getExceptionCode(), 6);
            assert.strictEqual(query.getExceptionType(), "slave device busy");
        });

        it ("exceptionCode 7 throws an exception", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,9,0,0,0,3,21,144,7]);
            let query;
            assert.throws(() => { query = modbus.exceptionFromBuffer(buffer); }, ModbusExceptionCodeError);
        });

        it ("exceptionCode 8 (memory parity error)", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,7,0,0,0,3,13,144,8]);
            let query = modbus.exceptionFromBuffer(buffer);
            assert.strictEqual(query.getTransaction(), 7);
            assert.strictEqual(query.getQueryLength(), 3);
            assert.strictEqual(query.getDevice(), 13);
            assert.strictEqual(query.getFunctionCode(), 144);
            assert.strictEqual(query.getType(), "writeHoldingRegistersException");
            assert.strictEqual(query.getExceptionCode(), 8);
            assert.strictEqual(query.getExceptionType(), "memory parity error");
        });

        it ("exceptionCode 9 throws an exception", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,9,0,0,0,3,21,144,9]);
            let query;
            assert.throws(() => { query = modbus.exceptionFromBuffer(buffer); }, ModbusExceptionCodeError);
        });

        it ("exceptionCode 10 (gateway path unavailable)", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,8,0,0,0,3,15,144,10]);
            let query = modbus.exceptionFromBuffer(buffer);
            assert.strictEqual(query.getTransaction(), 8);
            assert.strictEqual(query.getQueryLength(), 3);
            assert.strictEqual(query.getDevice(), 15);
            assert.strictEqual(query.getFunctionCode(), 144);
            assert.strictEqual(query.getType(), "writeHoldingRegistersException");
            assert.strictEqual(query.getExceptionCode(), 10);
            assert.strictEqual(query.getExceptionType(), "gateway path unavailable");
        });

        it ("exceptionCode 11 (gateway target failed to respond)", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,9,0,0,0,3,17,144,11]);
            let query = modbus.exceptionFromBuffer(buffer);
            assert.strictEqual(query.getTransaction(), 9);
            assert.strictEqual(query.getQueryLength(), 3);
            assert.strictEqual(query.getDevice(), 17);
            assert.strictEqual(query.getFunctionCode(), 144);
            assert.strictEqual(query.getType(), "writeHoldingRegistersException");
            assert.strictEqual(query.getExceptionCode(), 11);
            assert.strictEqual(query.getExceptionType(), "gateway target failed to respond");
        });

        it ("exceptionCode 12 throws an exception", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,9,0,0,0,3,21,144,12]);
            let query;
            assert.throws(() => { query = modbus.exceptionFromBuffer(buffer); }, ModbusExceptionCodeError);
        });

    });

    describe("#requestFromBuffer() - readWriteHoldingRegistersRequest", function () {

        it ("device of 0 throws an exception", function (){
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,0,0,0,0,13,0,23,0,100,0,1,0,101,0,1,2,0,0]);
            let query;
            assert.throws(()=>{ query = modbus.requestFromBuffer(buffer); }, ModbusDeviceError);
        });

        it ("readLength of 0 throws an exception", function (){
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,0,0,0,0,13,1,23,0,100,0,0,0,101,0,1,2,0,0]);
            let query;
            assert.throws(()=>{ query = modbus.requestFromBuffer(buffer); }, ModbusReadLengthError);
        });

        it ("readLength of 126 throws an exception", function (){
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,0,0,0,0,13,1,23,0,100,0,126,0,101,0,1,2,0,0]);
            let query;
            assert.throws(()=>{ query = modbus.requestFromBuffer(buffer); }, ModbusReadLengthError);
        });

        it ("writeLength of 0 throws an exception", function (){
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,0,0,0,0,13,1,23,0,100,0,1,0,101,0,0,2,0,0]);
            let query;
            assert.throws(()=>{ query = modbus.requestFromBuffer(buffer); }, ModbusWriteLengthError);
        });

        it ("writeLength of 126 throws an exception", function (){
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,0,0,0,0,13,1,23,0,100,0,1,0,101,0,126,2,0,0]);
            let query;
            assert.throws(()=>{ query = modbus.requestFromBuffer(buffer); }, ModbusWriteLengthError);
        });

        it ("dataLength of 0 throws an exception", function (){
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,0,0,0,0,11,1,23,0,100,0,1,0,101,0,1,0,0,0]);
            let query;
            assert.throws(()=>{ query = modbus.requestFromBuffer(buffer); }, ModbusWriteLengthError);
        });

        it ("dataLength of 252 throws an exception", function (){
            let modbus = new MODBUS();
            let array = [0,0,0,0,0,11,1,23,0,100,0,1,0,101,0,1,252];
            for (let i=0; i<252; i++) { array.push(0); }
            let buffer = Buffer.from(array);
            let query;
            assert.throws(()=>{ query = modbus.requestFromBuffer(buffer); }, ModbusWriteLengthError);
        });

        for (let i=0; i<global.NUM_DYNAMIC_TESTS; i++) {
            let t = Math.floor(Math.random() * 65536);
            let d = Math.floor(Math.random() * 255) + 1;
            let ra = Math.floor(Math.random() * 65536);
            let rl = Math.floor(Math.random() * 125) + 1;
            let wa = Math.floor(Math.random() * 65536);
            let wl = Math.floor(Math.random() * 125) + 1;
            let data = [];
            for (let i=0; i<wl; i++) { data.push(Math.floor(Math.random() * 65535) - 32768); }
            it ("transaction: " + t + " device: " + d + " readAddress: " + ra + " readLength: " + rl + " writeAddress: " + wa + " writeLength: " + wl, function () {
                let query;                
                let modbus = new MODBUS();
                let buffer = Buffer.allocUnsafe(17 + (wl*2));
                buffer.writeUInt16BE(t, 0);
                buffer.writeUInt16BE(0, 2);
                buffer.writeUInt16BE((11 + (wl*2)), 4);
                buffer.writeUInt8(d, 6);
                buffer.writeUInt8(23, 7);
                buffer.writeUInt16BE(ra, 8);
                buffer.writeUInt16BE(rl, 10);
                buffer.writeUInt16BE(wa, 12);
                buffer.writeUInt16BE(wl, 14);
                buffer.writeUInt8((wl * 2), 16);
                data.forEach((d, i) => { buffer.writeInt16BE(d, (17 + (i * 2))); });
                query = modbus.requestFromBuffer(buffer);
                assert.strictEqual(query.getType(), "readWriteHoldingRegistersRequest");
                assert.strictEqual(query.getTransaction(), t);
                assert.strictEqual(query.getQueryLength(), (11 + (wl * 2)));
                assert.strictEqual(query.getDevice(), d);
                assert.strictEqual(query.getFunctionCode(), 23);
                assert.strictEqual(query.getReadAddress(), ra);
                assert.strictEqual(query.getReadLength(), rl);
                assert.strictEqual(query.getWriteAddress(), wa);
                assert.strictEqual(query.getWriteLength(), wl);
                assert.strictEqual(query.getDataLength(), (wl * 2));
                assert.deepEqual(query.getData(), data);
            });
        }
    });

    describe("#replyFromBuffer() - readWriteHoldingRegistersReply", function () {

        it ("device of 0 throws an exception", function (){
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,0,0,0,0,5,0,23,2,0,0]);
            let query;
            assert.throws(()=>{ query = modbus.replyFromBuffer(buffer); }, ModbusDeviceError);
        });

        it ("dataLength of 0 throws an exception", function (){
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,0,0,0,0,5,1,23,0,0,0]);
            let query;
            assert.throws(()=>{ query = modbus.replyFromBuffer(buffer); }, ModbusWriteLengthError);
        });

        it ("dataLength of 252 throws an exception", function (){
            let modbus = new MODBUS();
            let array = [0,0,0,0,0,5,1,23,252];
            for (let i=0; i<252; i++) { array.push(0); }
            let buffer = Buffer.from(array);
            let query;
            assert.throws(()=>{ query = modbus.replyFromBuffer(buffer); }, ModbusWriteLengthError);
        });

        for (let i=0; i<global.NUM_DYNAMIC_TESTS; i++) {
            let t = Math.floor(Math.random() * 65536);
            let d = Math.floor(Math.random() * 255) + 1;
            let wl = Math.floor(Math.random() * 125) + 1;
            let data = [];
            for (let i=0; i<wl; i++) { data.push(Math.floor(Math.random() * 65535) - 32768); }
            it ("transaction: " + t + " device: " + d + " dataLength: (" + data.length + ")", function () {
                let query;
                let modbus = new MODBUS();
                let buffer = Buffer.allocUnsafe(9 + (wl*2));
                buffer.writeUInt16BE(t, 0);
                buffer.writeUInt16BE(0, 2);
                buffer.writeUInt16BE((3 + (wl*2)), 4);
                buffer.writeUInt8(d, 6);
                buffer.writeUInt8(23, 7);
                buffer.writeUInt8((wl * 2), 8);
                data.forEach((d, i) => { buffer.writeInt16BE(d, (9 + (i * 2))); });
                query = modbus.replyFromBuffer(buffer);
                assert.strictEqual(query.getTransaction(), t);
                assert.strictEqual(query.getQueryLength(), (3 + (wl * 2)));
                assert.strictEqual(query.getDevice(), d);
                assert.strictEqual(query.getFunctionCode(), 23);
                assert.strictEqual(query.getDataLength(), (wl * 2));
                assert.deepEqual(query.getData(), data);
                assert.strictEqual(query.getType(), "readWriteHoldingRegistersReply");
            });
        }
    });

    describe("#exceptionFromBuffer() - readWriteHoldingRegistersException", function () {

        it ("exceptionCode 0 throws an exception", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,9,0,0,0,3,19,151,0]);
            let query;
            assert.throws(() => { query = modbus.exceptionFromBuffer(buffer); }, ModbusExceptionCodeError);
        });
        
        it ("exceptionCode 1 (illegal function)", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,1,0,0,0,3,1,151,1]);
            let query = modbus.exceptionFromBuffer(buffer);
            assert.strictEqual(query.getTransaction(), 1);
            assert.strictEqual(query.getQueryLength(), 3);
            assert.strictEqual(query.getDevice(), 1);
            assert.strictEqual(query.getFunctionCode(), 151);
            assert.strictEqual(query.getType(), "readWriteHoldingRegistersException");
            assert.strictEqual(query.getExceptionCode(), 1);
            assert.strictEqual(query.getExceptionType(), "illegal function");
        });

        it ("exceptionCode 2 (illegal data address)", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,2,0,0,0,3,3,151,2]);
            let query = modbus.exceptionFromBuffer(buffer);
            assert.strictEqual(query.getTransaction(), 2);
            assert.strictEqual(query.getQueryLength(), 3);
            assert.strictEqual(query.getDevice(), 3);
            assert.strictEqual(query.getFunctionCode(), 151);
            assert.strictEqual(query.getType(), "readWriteHoldingRegistersException");
            assert.strictEqual(query.getExceptionCode(), 2);
            assert.strictEqual(query.getExceptionType(), "illegal data address");
        });

        it ("exceptionCode 3 (illegal data value)", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,3,0,0,0,3,5,151,3]);
            let query = modbus.exceptionFromBuffer(buffer);
            assert.strictEqual(query.getTransaction(), 3);
            assert.strictEqual(query.getQueryLength(), 3);
            assert.strictEqual(query.getDevice(), 5);
            assert.strictEqual(query.getFunctionCode(), 151);
            assert.strictEqual(query.getType(), "readWriteHoldingRegistersException");
            assert.strictEqual(query.getExceptionCode(), 3);
            assert.strictEqual(query.getExceptionType(), "illegal data value");
        });

        it ("exceptionCode 4 (slave device failure)", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,4,0,0,0,3,7,151,4]);
            let query = modbus.exceptionFromBuffer(buffer);
            assert.strictEqual(query.getTransaction(), 4);
            assert.strictEqual(query.getQueryLength(), 3);
            assert.strictEqual(query.getDevice(), 7);
            assert.strictEqual(query.getFunctionCode(), 151);
            assert.strictEqual(query.getType(), "readWriteHoldingRegistersException");
            assert.strictEqual(query.getExceptionCode(), 4);
            assert.strictEqual(query.getExceptionType(), "slave device failure");
        });

        it ("exceptionCode 5 (acknowledge)", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,5,0,0,0,3,9,151,5]);
            let query = modbus.exceptionFromBuffer(buffer);
            assert.strictEqual(query.getTransaction(), 5);
            assert.strictEqual(query.getQueryLength(), 3);
            assert.strictEqual(query.getDevice(), 9);
            assert.strictEqual(query.getFunctionCode(), 151);
            assert.strictEqual(query.getType(), "readWriteHoldingRegistersException");
            assert.strictEqual(query.getExceptionCode(), 5);
            assert.strictEqual(query.getExceptionType(), "acknowledge");
        });

        it ("exceptionCode 6 (slave device busy)", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,6,0,0,0,3,11,151,6]);
            let query = modbus.exceptionFromBuffer(buffer);
            assert.strictEqual(query.getTransaction(), 6);
            assert.strictEqual(query.getQueryLength(), 3);
            assert.strictEqual(query.getDevice(), 11);
            assert.strictEqual(query.getFunctionCode(), 151);
            assert.strictEqual(query.getType(), "readWriteHoldingRegistersException");
            assert.strictEqual(query.getExceptionCode(), 6);
            assert.strictEqual(query.getExceptionType(), "slave device busy");
        });

        it ("exceptionCode 7 throws an exception", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,9,0,0,0,3,21,151,7]);
            let query;
            assert.throws(() => { query = modbus.exceptionFromBuffer(buffer); }, ModbusExceptionCodeError);
        });

        it ("exceptionCode 8 (memory parity error)", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,7,0,0,0,3,13,151,8]);
            let query = modbus.exceptionFromBuffer(buffer);
            assert.strictEqual(query.getTransaction(), 7);
            assert.strictEqual(query.getQueryLength(), 3);
            assert.strictEqual(query.getDevice(), 13);
            assert.strictEqual(query.getFunctionCode(), 151);
            assert.strictEqual(query.getType(), "readWriteHoldingRegistersException");
            assert.strictEqual(query.getExceptionCode(), 8);
            assert.strictEqual(query.getExceptionType(), "memory parity error");
        });

        it ("exceptionCode 9 throws an exception", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,9,0,0,0,3,21,151,9]);
            let query;
            assert.throws(() => { query = modbus.exceptionFromBuffer(buffer); }, ModbusExceptionCodeError);
        });

        it ("exceptionCode 10 (gateway path unavailable)", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,8,0,0,0,3,15,151,10]);
            let query = modbus.exceptionFromBuffer(buffer);
            assert.strictEqual(query.getTransaction(), 8);
            assert.strictEqual(query.getQueryLength(), 3);
            assert.strictEqual(query.getDevice(), 15);
            assert.strictEqual(query.getFunctionCode(), 151);
            assert.strictEqual(query.getType(), "readWriteHoldingRegistersException");
            assert.strictEqual(query.getExceptionCode(), 10);
            assert.strictEqual(query.getExceptionType(), "gateway path unavailable");
        });

        it ("exceptionCode 11 (gateway target failed to respond)", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,9,0,0,0,3,17,151,11]);
            let query = modbus.exceptionFromBuffer(buffer);
            assert.strictEqual(query.getTransaction(), 9);
            assert.strictEqual(query.getQueryLength(), 3);
            assert.strictEqual(query.getDevice(), 17);
            assert.strictEqual(query.getFunctionCode(), 151);
            assert.strictEqual(query.getType(), "readWriteHoldingRegistersException");
            assert.strictEqual(query.getExceptionCode(), 11);
            assert.strictEqual(query.getExceptionType(), "gateway target failed to respond");
        });

        it ("exceptionCode 12 throws an exception", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,9,0,0,0,3,21,151,12]);
            let query;
            assert.throws(() => { query = modbus.exceptionFromBuffer(buffer); }, ModbusExceptionCodeError);
        });

    });

});