"use strict";

let assert = require("assert");
const MODBUS = require("../src/modbus.js");
const NUM_DYNAMIC_TESTS = 500;

describe("modbus", function () {
    
    describe("#modbus()", function () {
        
        it("constructor returns an empty modbus query object", function () {
            let modbus = new MODBUS();
            assert.strictEqual(modbus.transaction, null);
            assert.strictEqual(modbus.queryLength, null);
            assert.strictEqual(modbus.device, null);
            assert.strictEqual(modbus.functionCode, null);
            assert.strictEqual(modbus.type, null);
            assert.strictEqual(modbus.readAddress, null);
            assert.strictEqual(modbus.readLength, null);
            assert.strictEqual(modbus.writeAddress, null);
            assert.strictEqual(modbus.writeLength, null);
            assert.strictEqual(modbus.data, null);
            assert.strictEqual(modbus.exceptionCode, null);
        });

    });

    describe("#fromBuffer()", function () {

        it ("readHoldingRegisterRequest (transaction: 0, device: 0, readAddress: 101, readLength: 10)", function (){
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,0,0,0,0,6,0,3,0,100,0,10]);
            assert.throws(()=>{ modbus.fromBuffer(buffer); }, null, "Device ID: 0 is less than 1");
            assert.strictEqual(modbus.transaction, 0);
            assert.strictEqual(modbus.queryLength, 6);
            assert.strictEqual(modbus.device, null);
            assert.strictEqual(modbus.functionCode, null);
            assert.strictEqual(modbus.type, null);
            assert.strictEqual(modbus.readAddress, null);
            assert.strictEqual(modbus.readLength, null);
            assert.strictEqual(modbus.writeAddress, null);
            assert.strictEqual(modbus.writeLength, null);
            assert.strictEqual(modbus.data, null);
            assert.strictEqual(modbus.exceptionCode, null);
        });

        it ("readHoldingRegisterRequest (transaction: 1, device: 1, readAddress: 102, readLength: 0)", function (){
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,1,0,0,0,6,1,3,0,101,0,0]);
            assert.throws(()=>{ modbus.fromBuffer(buffer); }, null, "Read Length: 0 is less than 1");
            assert.strictEqual(modbus.transaction, 1);
            assert.strictEqual(modbus.queryLength, 6);
            assert.strictEqual(modbus.device, 1);
            assert.strictEqual(modbus.functionCode, 3);
            assert.strictEqual(modbus.type, "readHoldingRegistersRequest");
            assert.strictEqual(modbus.readAddress, 101);
            assert.strictEqual(modbus.readLength, null);
            assert.strictEqual(modbus.writeAddress, null);
            assert.strictEqual(modbus.writeLength, null);
            assert.strictEqual(modbus.data, null);
            assert.strictEqual(modbus.exceptionCode, null);
        });

        it ("readHoldingRegisterRequest (transaction: 2, device: 1, readAddress: 103, readLength: 121)", function (){
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,2,0,0,0,6,1,3,0,102,0,121]);
            assert.throws(()=>{ modbus.fromBuffer(buffer); }, null, "Read Length: 121 is greater than 120");
            assert.strictEqual(modbus.transaction, 2);
            assert.strictEqual(modbus.queryLength, 6);
            assert.strictEqual(modbus.device, 1);
            assert.strictEqual(modbus.functionCode, 3);
            assert.strictEqual(modbus.type, "readHoldingRegistersRequest");
            assert.strictEqual(modbus.readAddress, 102);
            assert.strictEqual(modbus.readLength, null);
            assert.strictEqual(modbus.writeAddress, null);
            assert.strictEqual(modbus.writeLength, null);
            assert.strictEqual(modbus.data, null);
            assert.strictEqual(modbus.exceptionCode, null);
        });

        for (let i=0; i<NUM_DYNAMIC_TESTS; i++) {
            let t = Math.floor(Math.random() * 65536);
            let d = Math.floor(Math.random() * 255) + 1;
            let ra = Math.floor(Math.random() * 65536);
            let rl = Math.floor(Math.random() * 120) + 1;
            it ("readHoldingRegisterRequest (transaction: " + t + " device: " + d + " readAddress: " + ra + " readLength: " + rl + ")", function () {
                let modbus = new MODBUS();
                let buffer = Buffer.from([0,0,0,0,0,6,d,3,0,0,0,rl]);
                buffer.writeUint16BE(t, 0);
                buffer.writeUint16BE(ra, 8);
                modbus.fromBuffer(buffer);
                assert.strictEqual(modbus.transaction, t);
                assert.strictEqual(modbus.queryLength, 6);
                assert.strictEqual(modbus.device, d);
                assert.strictEqual(modbus.functionCode, 3);
                assert.strictEqual(modbus.type, "readHoldingRegistersRequest");
                assert.strictEqual(modbus.readAddress, ra);
                assert.strictEqual(modbus.readLength, rl);
                assert.strictEqual(modbus.writeAddress, null);
                assert.strictEqual(modbus.writeLength, null);
                assert.strictEqual(modbus.data, null);
                assert.strictEqual(modbus.exceptionCode, null);
            });
        }

        it ("readHoldingRegistersReply (transaction: 0, device: 0, dataLength: 1)", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,0,0,0,0,5,0,3,2,0,0]);
            assert.throws(()=>{ modbus.fromBuffer(buffer); }, null, "Device ID: 0 is less than 1");
            assert.strictEqual(modbus.transaction, 0);
            assert.strictEqual(modbus.queryLength, 5);
            assert.strictEqual(modbus.device, null);
            assert.strictEqual(modbus.functionCode, null);
            assert.strictEqual(modbus.type, null);
            assert.strictEqual(modbus.readAddress, null);
            assert.strictEqual(modbus.readLength, null);
            assert.strictEqual(modbus.writeAddress, null);
            assert.strictEqual(modbus.writeLength, null);
            assert.deepEqual(modbus.data, null);
            assert.strictEqual(modbus.exceptionCode, null);
        });

        it ("readHoldingRegistersReply (transaction: 1, device: 1, dataLength: 0)", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,1,0,0,0,3,1,3,0]);
            assert.throws(()=>{
                modbus.fromBuffer(buffer);
            }, null, "Data Length: 0 is less than 2");
            assert.strictEqual(modbus.transaction, 1);
            assert.strictEqual(modbus.queryLength, 3);
            assert.strictEqual(modbus.device, 1);
            assert.strictEqual(modbus.functionCode, 3);
            assert.strictEqual(modbus.type, "readHoldingRegistersReply");
            assert.strictEqual(modbus.readAddress, null);
            assert.strictEqual(modbus.readLength, null);
            assert.strictEqual(modbus.writeAddress, null);
            assert.strictEqual(modbus.writeLength, null);
            assert.deepEqual(modbus.data, null);
            assert.strictEqual(modbus.exceptionCode, null);
        });

        it ("readHoldingRegistersReply (transaction: 1, device: 1, dataLength: 121)", function () {
            let modbus = new MODBUS();
            let array = [0,1,0,0,0,245,1,3,242];
            for (let i=0; i<121; i++) { array.push(0); array.push(0); }
            let buffer = Buffer.from(array);
            assert.throws(()=>{ modbus.fromBuffer(buffer); }, null, "Data Length: 242 is greater than 240");
            assert.strictEqual(modbus.transaction, 1);
            assert.strictEqual(modbus.queryLength, 245);
            assert.strictEqual(modbus.device, 1);
            assert.strictEqual(modbus.functionCode, 3);
            assert.strictEqual(modbus.type, "readHoldingRegistersReply");
            assert.strictEqual(modbus.readAddress, null);
            assert.strictEqual(modbus.readLength, null);
            assert.strictEqual(modbus.writeAddress, null);
            assert.strictEqual(modbus.writeLength, null);
            assert.deepEqual(modbus.data, null);
            assert.strictEqual(modbus.exceptionCode, null);
        });

        for (let i=0; i<NUM_DYNAMIC_TESTS; i++) {
            let t = Math.floor(Math.random() * 65536);
            let d = Math.floor(Math.random() * 255) + 1;
            let dl = Math.floor(Math.random() * 120) + 1;
            let data = [];
            for (let i=0; i<dl; i++) { data.push(Math.floor(Math.random() * 65535) - 32768); }
            it ("readHoldingRegistersReply (transaction: " + t + " device: " + d + " dataLength: " + dl + ")", function () {
                let modbus = new MODBUS();
                let buffer = Buffer.allocUnsafe(9 + (dl*2));
                buffer.writeUInt16BE(t, 0);
                buffer.writeUInt16BE(0, 2);
                buffer.writeUInt16BE((3 + (dl*2)), 4);
                buffer.writeUInt8(d, 6);
                buffer.writeUInt8(3, 7);
                buffer.writeUInt8((dl * 2), 8);
                data.forEach((d, i) => { buffer.writeInt16BE(d, (9 + (i * 2))); });
                modbus.fromBuffer(buffer);
                assert.strictEqual(modbus.transaction, t);
                assert.strictEqual(modbus.queryLength, (3 + (dl * 2)));
                assert.strictEqual(modbus.device, d);
                assert.strictEqual(modbus.functionCode, 3);
                assert.strictEqual(modbus.type, "readHoldingRegistersReply");
                assert.strictEqual(modbus.readAddress, null);
                assert.strictEqual(modbus.readLength, null);
                assert.strictEqual(modbus.writeAddress, null);
                assert.strictEqual(modbus.writeLength, null);
                assert.deepEqual(modbus.data, data);
                assert.strictEqual(modbus.exceptionCode, null);
            });
        }

        for (let i=0; i<NUM_DYNAMIC_TESTS; i++) {
            let t = Math.floor(Math.random() * 65536);
            let d = Math.floor(Math.random() * 255) + 1;
            let wa = Math.floor(Math.random() * 65535);
            let wl = Math.floor(Math.random() * 120) + 1;
            let data = [];
            for (let i=0; i<wl; i++) { data.push(Math.floor(Math.random() * 65535) - 32768); }
            it ("writeHoldingRegistersRequest (transaction: " + t + " device: " + d + " writeAddress: " + wa + " writeLength: " + wl + ")", function () {
                let modbus = new MODBUS();
                let buffer = Buffer.allocUnsafe(13 + (wl*2));
                buffer.writeUInt16BE(t, 0);
                buffer.writeUInt16BE(0, 2);
                buffer.writeUInt16BE((7 + (wl * 2)), 4);
                buffer.writeUInt8(d, 6);
                buffer.writeUInt8(16, 7);
                buffer.writeUInt16BE(wa, 8);
                buffer.writeUInt16BE(wl, 10);
                buffer.writeUInt8((wl * 2), 12);
                data.forEach((d, i) => { buffer.writeInt16BE(d, (13 + (i * 2))); });
                modbus.fromBuffer(buffer);
                assert.strictEqual(modbus.transaction, t);
                assert.strictEqual(modbus.queryLength, (7 + (wl * 2)));
                assert.strictEqual(modbus.device, d);
                assert.strictEqual(modbus.functionCode, 16);
                assert.strictEqual(modbus.type, "writeHoldingRegistersRequest");
                assert.strictEqual(modbus.readAddress, null);
                assert.strictEqual(modbus.readLength, null);
                assert.strictEqual(modbus.writeAddress, wa);
                assert.strictEqual(modbus.writeLength, wl);
                assert.deepEqual(modbus.data, data);
                assert.strictEqual(modbus.exceptionCode, null);
            });
        }

        it ("writeHoldingRegistersReply (transaction: 0, device: 0, writeAddress: 101, writeLength: 1)", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,0,0,0,0,6,0,16,0,101,0,1]);
            assert.throws(()=>{ modbus.fromBuffer(buffer); }, null, "Device ID: 0 is less than 1");
            assert.strictEqual(modbus.transaction, 0);
            assert.strictEqual(modbus.queryLength, 6);
            assert.strictEqual(modbus.device, null);
            assert.strictEqual(modbus.functionCode, null);
            assert.strictEqual(modbus.type, null);
            assert.strictEqual(modbus.readAddress, null);
            assert.strictEqual(modbus.readLength, null);
            assert.strictEqual(modbus.writeAddress, null);
            assert.strictEqual(modbus.writeLength, null);
            assert.deepEqual(modbus.data, null);
            assert.strictEqual(modbus.exceptionCode, null);
        });

        it ("writeHoldingRegistersReply (transaction: 1, device: 1, writeAddress: 102, writeLength: 0)", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,1,0,0,0,6,1,16,0,102,0,0]);
            assert.throws(()=>{ modbus.fromBuffer(buffer); }, null, "Write Length: 0 is less than 1");
            assert.strictEqual(modbus.transaction, 1);
            assert.strictEqual(modbus.queryLength, 6);
            assert.strictEqual(modbus.device, 1);
            assert.strictEqual(modbus.functionCode, 16);
            assert.strictEqual(modbus.type, "writeHoldingRegistersReply");
            assert.strictEqual(modbus.readAddress, null);
            assert.strictEqual(modbus.readLength, null);
            assert.strictEqual(modbus.writeAddress, 102);
            assert.strictEqual(modbus.writeLength, null);
            assert.deepEqual(modbus.data, null);
            assert.strictEqual(modbus.exceptionCode, null);
        });

        it ("writeHoldingRegistersReply (transaction: 2, device: 1, writeAddress: 103, writeLength: 121)", function () {
            let modbus = new MODBUS();
            let buffer = Buffer.from([0,2,0,0,0,6,1,16,0,103,0,121]);
            assert.throws(()=>{ modbus.fromBuffer(buffer); }, null, "Write Length: 121 is greater than 120");
            assert.strictEqual(modbus.transaction, 2);
            assert.strictEqual(modbus.queryLength, 6);
            assert.strictEqual(modbus.device, 1);
            assert.strictEqual(modbus.functionCode, 16);
            assert.strictEqual(modbus.type, "writeHoldingRegistersReply");
            assert.strictEqual(modbus.readAddress, null);
            assert.strictEqual(modbus.readLength, null);
            assert.strictEqual(modbus.writeAddress, 103);
            assert.strictEqual(modbus.writeLength, null);
            assert.deepEqual(modbus.data, null);
            assert.strictEqual(modbus.exceptionCode, null);
        });

        for (let i=0; i<NUM_DYNAMIC_TESTS; i++) {
            let t = Math.floor(Math.random() * 65536);
            let d = Math.floor(Math.random() * 255) + 1;
            let wa = Math.floor(Math.random() * 65535);
            let wl = Math.floor(Math.random() * 120) + 1;
            it ("writeHoldingRegistersReply (transaction: " + t + " device: " + d + " writeAddress: " + wa + " writeLength: " + wl + ")", function () {
                let modbus = new MODBUS();
                let buffer = Buffer.allocUnsafe(12);
                buffer.writeUInt16BE(t, 0);
                buffer.writeUInt16BE(0, 2);
                buffer.writeUInt16BE(6, 4);
                buffer.writeUInt8(d, 6);
                buffer.writeUInt8(16, 7);
                buffer.writeUInt16BE(wa, 8);
                buffer.writeUInt16BE(wl, 10);
                modbus.fromBuffer(buffer);
                assert.strictEqual(modbus.transaction, t);
                assert.strictEqual(modbus.queryLength, 6);
                assert.strictEqual(modbus.device, d);
                assert.strictEqual(modbus.functionCode, 16);
                assert.strictEqual(modbus.type, "writeHoldingRegistersReply");
                assert.strictEqual(modbus.readAddress, null);
                assert.strictEqual(modbus.readLength, null);
                assert.strictEqual(modbus.writeAddress, wa);
                assert.strictEqual(modbus.writeLength, wl);
                assert.strictEqual(modbus.data, null);
                assert.strictEqual(modbus.exceptionCode, null);
            });
        }

    });

});