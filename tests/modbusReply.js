const modbusReply = require("../dist/modbusReply.js");
const expect = require("chai").expect;
const waterfall = require("async").waterfall;

describe("modbusReply", function () {

    it("#modbusReply() creates a valid readHoldingRegister reply (1 - [0])", function () {
        reply = new modbusReply();
        reply.bufferToReply(new Buffer([0x00, 0x00, 0x00, 0x00, 0x00, 0x05, 0x01, 0x03, 0x02, 0x00, 0x00]));
        expect(reply).to.be.a("object")
            .and.contains({ id: 1, func: 3, transactionID: 0, byteCount: 2 });
        expect(reply.data).deep.equals([0]);
    });
    it("#modbusReply() creates a valid readHoldingRegister reply (2 - [1,2])", function () {
        reply = new modbusReply();
        reply.bufferToReply(new Buffer([0x00, 0x01, 0x00, 0x00, 0x00, 0x07, 0x01, 0x03, 0x04, 0x00, 0x01, 0x00, 0x02]));
        expect(reply).to.be.a("object")
            .and.contains({ id: 1, func: 3, transactionID: 1, byteCount: 4 });
        expect(reply.data).deep.equals([1,2]);
    });
    it("#modbusReply() creates a valid writeHoldingRegisters reply (1)", function () {
        reply = new modbusReply();
        reply.bufferToReply(new Buffer([0x00, 0x02, 0x00, 0x00, 0x00, 0x06, 0x01, 0x10, 0x00, 0x64, 0x00, 0x01]));
        expect(reply).to.be.a("object")
            .and.contains({ id: 1, func: 16, transactionID: 2 });
    });
    it("#modbusReply() creates a valid writeHoldingRegisters reply (2)", function () {
        reply = new modbusReply();
        reply.bufferToReply(new Buffer([0x00, 0x03, 0x00, 0x00, 0x00, 0x06, 0x01, 0x10, 0x00, 0x65, 0x00, 0x02]));
        expect(reply).to.be.a("object")
            .and.contains({ id: 1, func: 16, transactionID: 3 });
    });        
    it("#modbusReply() creates a valid exception - illegal function", function () {
        reply = new modbusReply();
        reply.bufferToReply(new Buffer([0x00, 0x04, 0x00, 0x00, 0x00, 0x03, 0x01, 0x80, 0x01]));
        expect(reply).to.be.a("object")
            .and.contains({ id: 1, func: 128, transactionID: 4, exception: 1 });
        expect(reply.data).deep.equals([]);
    });
    it("#modbusReply() creates a valid exception - illegal data address", function () {
        reply = new modbusReply();
        reply.bufferToReply(new Buffer([0x00, 0x05, 0x00, 0x00, 0x00, 0x03, 0x01, 0x80, 0x02]));
        expect(reply).to.be.a("object")
            .and.contains({ id: 1, func: 128, transactionID: 5, exception: 2 });
        expect(reply.data).deep.equals([]);
    });
    it("#modbusReply() creates a valid exception - illegal data value", function () {
        reply = new modbusReply();
        reply.bufferToReply(new Buffer([0x00, 0x05, 0x00, 0x00, 0x00, 0x03, 0x01, 0x80, 0x03]));
        expect(reply).to.be.a("object")
            .and.contains({ id: 1, func: 128, transactionID: 5, exception: 3 });
        expect(reply.data).deep.equals([]);
    });
    it("#modbusReply() creates a valid exception - slave device failure", function () {
        reply = new modbusReply();
        reply.bufferToReply(new Buffer([0x00, 0x05, 0x00, 0x00, 0x00, 0x03, 0x01, 0x80, 0x04]));
        expect(reply).to.be.a("object")
            .and.contains({ id: 1, func: 128, transactionID: 5, exception: 4 });
        expect(reply.data).deep.equals([]);
    });
    it("#modbusReply() creates a valid exception - acknowledge", function () {
        reply = new modbusReply();
        reply.bufferToReply(new Buffer([0x00, 0x05, 0x00, 0x00, 0x00, 0x03, 0x01, 0x80, 0x05]));
        expect(reply).to.be.a("object")
            .and.contains({ id: 1, func: 128, transactionID: 5, exception: 5 });
        expect(reply.data).deep.equals([]);
    });
    it("#modbusReply() creates a valid exception - slave device busy", function () {
        reply = new modbusReply();
        reply.bufferToReply(new Buffer([0x00, 0x05, 0x00, 0x00, 0x00, 0x03, 0x01, 0x80, 0x06]));
        expect(reply).to.be.a("object")
            .and.contains({ id: 1, func: 128, transactionID: 5, exception: 6 });
        expect(reply.data).deep.equals([]);
    });
    it("#modbusReply() creates a valid exception - negative acknowledge", function () {
        reply = new modbusReply();
        reply.bufferToReply(new Buffer([0x00, 0x05, 0x00, 0x00, 0x00, 0x03, 0x01, 0x80, 0x07]));
        expect(reply).to.be.a("object")
            .and.contains({ id: 1, func: 128, transactionID: 5, exception: 7 });
        expect(reply.data).deep.equals([]);
    });
    it("#modbusReply() creates a valid exception - memory parity error", function () {
        reply = new modbusReply();
        reply.bufferToReply(new Buffer([0x00, 0x05, 0x00, 0x00, 0x00, 0x03, 0x01, 0x80, 0x08]));
        expect(reply).to.be.a("object")
            .and.contains({ id: 1, func: 128, transactionID: 5, exception: 8 });
        expect(reply.data).deep.equals([]);
    });
    it("#modbusReply() creates a valid exception - gatway path unavailable", function () {
        reply = new modbusReply();
        reply.bufferToReply(new Buffer([0x00, 0x05, 0x00, 0x00, 0x00, 0x03, 0x01, 0x80, 0x0A]));
        expect(reply).to.be.a("object")
            .and.contains({ id: 1, func: 128, transactionID: 5, exception: 10 });
        expect(reply.data).deep.equals([]);
    });
    it("#modbusReply() creates a valid exception - gateway target device failed to respond", function () {
        reply = new modbusReply();
        reply.bufferToReply(new Buffer([0x00, 0x05, 0x00, 0x00, 0x00, 0x03, 0x01, 0x80, 0x0B]));
        expect(reply).to.be.a("object")
            .and.contains({ id: 1, func: 128, transactionID: 5, exception: 11 });
        expect(reply.data).deep.equals([]);
    });

});