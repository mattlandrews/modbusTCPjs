const modbusReply = require("../modbustcp/modbusReply.js");
const expect = require("chai").expect;
const waterfall = require("async").waterfall;

describe("modbusReply", function () {

    it("#modbusReply() creates a valid readHoldingRegister reply (1 - [0])", function () {
        reply = new modbusReply([0x00, 0x00, 0x00, 0x00, 0x00, 0x05, 0x01, 0x03, 0x02, 0x00, 0x00]);
        expect(reply).to.be.a("object")
            .and.contains({ id: 1, func: 3, transactionID: 0, byteCount: 2 });
        expect(reply.data).deep.equals([0]);
        expect(reply.replyBuffer).deep.equals([0x00, 0x00, 0x00, 0x00, 0x00, 0x05, 0x01, 0x03, 0x02, 0x00, 0x00]);
    });
    it("#modbusReply() creates a valid readHoldingRegister reply (2 - [1,2])", function () {
        reply = new modbusReply([0x00, 0x01, 0x00, 0x00, 0x00, 0x05, 0x01, 0x03, 0x04, 0x00, 0x01, 0x00, 0x02]);
        expect(reply).to.be.a("object")
            .and.contains({ id: 1, func: 3, transactionID: 1, byteCount: 4 });
        expect(reply.data).deep.equals([1,2]);
        expect(reply.replyBuffer).deep.equals([0x00, 0x01, 0x00, 0x00, 0x00, 0x05, 0x01, 0x03, 0x04, 0x00, 0x01, 0x00, 0x02]);
    });
    it("#modbusReply() creates a valid writeHoldingRegisters reply (1)", function () {
        reply = new modbusReply([0x00, 0x02, 0x00, 0x00, 0x00, 0x05, 0x01, 0x10, 0x00, 0x64, 0x00, 0x01]);
        expect(reply).to.be.a("object")
            .and.contains({ id: 1, func: 16, transactionID: 2 });
        expect(reply.replyBuffer).deep.equals([0x00, 0x02, 0x00, 0x00, 0x00, 0x05, 0x01, 0x10, 0x00, 0x64, 0x00, 0x01]);
    });
    it("#modbusReply() creates a valid writeHoldingRegisters reply (2)", function () {
        reply = new modbusReply([0x00, 0x03, 0x00, 0x00, 0x00, 0x05, 0x01, 0x10, 0x00, 0x65, 0x00, 0x02]);
        expect(reply).to.be.a("object")
            .and.contains({ id: 1, func: 16, transactionID: 3 });
        expect(reply.replyBuffer).deep.equals([0x00, 0x03, 0x00, 0x00, 0x00, 0x05, 0x01, 0x10, 0x00, 0x65, 0x00, 0x02]);
    });
});