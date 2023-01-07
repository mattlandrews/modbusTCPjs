let assert = require("assert");
const modbus = require("../src/modbus.js");

const MODBUS = require("../src/modbus.js");

describe("modbus", function () {
    describe ("parse from buffer", function () {
        it("should return a valid empty modbus structure on instantiation", function () {
            let modbus = new MODBUS();
            assert.strictEqual(modbus.mbap.transaction, null);
            assert.strictEqual(modbus.mbap.protocol, null);
            assert.strictEqual(modbus.mbap.byteLength, null);
            assert.strictEqual(modbus.device, null);
            assert.strictEqual(modbus.functionCode, null);
            assert.strictEqual(modbus.type, null);
        });
        it("should return a valid Read Holding Registers Request from buffer", function () {
            let modbus = new MODBUS();
            modbus.fromBuffer(Buffer.from([0,1,0,0,0,6,2,3,0,4,0,5]));
            assert.strictEqual(modbus.mbap.transaction, 1);
            assert.strictEqual(modbus.mbap.protocol, 0);
            assert.strictEqual(modbus.mbap.byteLength, 6);
            assert.strictEqual(modbus.device, 2);
            assert.strictEqual(modbus.functionCode, 3);
            assert.strictEqual(modbus.type, "readHoldingRegistersRequest");
            assert.strictEqual(modbus.address, 4);
            assert.strictEqual(modbus.numAddresses, 5);
        });
        it("should return a valid Read Holding Registers Response from buffer", function () {
            let modbus = new MODBUS();
            modbus.fromBuffer(Buffer.from([0,6,0,0,0,9,7,3,6,0,8,9,0,0,10]));
            assert.strictEqual(modbus.mbap.transaction, 6);
            assert.strictEqual(modbus.mbap.protocol, 0);
            assert.strictEqual(modbus.mbap.byteLength, 9);
            assert.strictEqual(modbus.device, 7);
            assert.strictEqual(modbus.functionCode, 3);
            assert.strictEqual(modbus.type, "readHoldingRegistersResponse");
            assert.strictEqual(modbus.dataLength, 6);
            assert.deepStrictEqual(modbus.data, [8, 2304, 10]);
        });
        it("should return a valid Write Holding Registers Request from buffer", function () {
            let modbus = new MODBUS();
            modbus.fromBuffer(Buffer.from([0,1,0,0,0,11,2,16,0,3,0,4,8,0,9,0,10,0,11,0,12]));
            assert.strictEqual(modbus.mbap.transaction, 1);
            assert.strictEqual(modbus.mbap.protocol, 0);
            assert.strictEqual(modbus.mbap.byteLength, 11);
            assert.strictEqual(modbus.device, 2);
            assert.strictEqual(modbus.functionCode, 16);
            assert.strictEqual(modbus.type, "writeHoldingRegistersRequest");
            assert.strictEqual(modbus.address, 3);
            assert.strictEqual(modbus.numAddresses, 4);
            assert.strictEqual(modbus.dataLength, 8);
            assert.deepStrictEqual(modbus.data, [9, 10, 11, 12]);
        });
        it("should return a valid Write Holding Registers Response from buffer", function () {
            let modbus = new MODBUS();
            modbus.fromBuffer(Buffer.from([0,13,0,0,0,9,14,16,0,15,0,16]));
            assert.strictEqual(modbus.mbap.transaction, 13);
            assert.strictEqual(modbus.mbap.protocol, 0);
            assert.strictEqual(modbus.mbap.byteLength, 9);
            assert.strictEqual(modbus.device, 14);
            assert.strictEqual(modbus.functionCode, 16);
            assert.strictEqual(modbus.type, "writeHoldingRegistersResponse");
            assert.strictEqual(modbus.address, 15);
            assert.strictEqual(modbus.numAddresses, 16);
        });
        it("should return a valid buffer from a Read Holding Registers Request", function () {
            let modbus = new MODBUS();
            modbus.mbap.transaction = 11;
            modbus.mbap.protocol = 12;
            modbus.mbap.byteLength = 6;
            modbus.device = 13;
            modbus.functionCode = 3;
            modbus.type = "readHoldingRegistersRequest";
            modbus.address = 14;
            modbus.numAddresses = 15;
            assert.deepStrictEqual(modbus.toBuffer(),Buffer.from([0,11,0,12,0,6,13,3,0,14,0,15]));
        });
        it("should return a valid buffer from a Read Holding Registers Request", function () {
            let modbus = new MODBUS();
            modbus.mbap.transaction = 16;
            modbus.mbap.protocol = 17;
            modbus.mbap.byteLength = 11;
            modbus.device = 18;
            modbus.functionCode = 3;
            modbus.type = "readHoldingRegistersResponse";
            modbus.dataLength = 8;
            modbus.data = [19,20,21,22];
            assert.deepStrictEqual(modbus.toBuffer(),Buffer.from([0,16,0,17,0,11,18,3,8,0,19,0,20,0,21,0,22]));
        });
        it("should return a valid buffer from a Write Holding Registers Request (1 in length)", function () {
            let modbus = new MODBUS();
            modbus.mbap.transaction = 25;
            modbus.mbap.protocol = 0;
            modbus.mbap.byteLength = 9;
            modbus.device = 2;
            modbus.functionCode = 16;
            modbus.type = "writeHoldingRegistersRequest";
            modbus.address = 0;
            modbus.numAddresses = 1;
            modbus.dataLength = 2;
            modbus.data = [0];
            assert.deepStrictEqual(modbus.toBuffer(),Buffer.from([0,25,0,0,0,9,2,16,0,0,0,1,2,0,0]));
        });
        it("should return a valid buffer from a Write Holding Registers Request (120 in length)", function () {
            let modbus = new MODBUS();
            modbus.mbap.transaction = 512;
            modbus.mbap.protocol = 0;
            modbus.mbap.byteLength = 247;
            modbus.device = 255;
            modbus.functionCode = 16;
            modbus.type = "writeHoldingRegistersRequest";
            modbus.address = 65000;
            modbus.numAddresses = 120;
            modbus.dataLength = 240;
            modbus.data = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            assert.deepStrictEqual(modbus.toBuffer(),Buffer.from([2,0,0,0,0,247,255,16,253,232,0,120,240,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]));
        });
    });
});