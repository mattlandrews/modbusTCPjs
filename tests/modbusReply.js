const modbusReply = require("../dist/modbusReply.js");
const expect = require("chai").expect;
const waterfall = require("async").waterfall;

describe("modbusReply", function () {

    describe("#modbusReply()", function () {
        it ("modbusReply() creates an empty reply object.", function () {
            let reply = new modbusReply();
            expect(reply).to.be.an("object")
                .and.includes({ transaction: 0, id: 1, type: "readHoldingRegisters", func: 3, register: 0, length: 1, dataByteLength: 2 });
            expect(reply.data).to.deep.equal([0]);
            expect(reply.buffer).to.deep.equal(new Buffer([0,0,0,0,0,5,1,3,2,0,0]));
        });    
        it ("modbusReply() creates a valid readHoldingRegisters reply.", function () {
            let reply = new modbusReply({ transaction: 1, id:10, type: "readHoldingRegisters", data: [4,3,2,1] });
            expect(reply).to.be.an("object")
                .and.includes({ transaction: 1, id: 10, type: "readHoldingRegisters", func: 3, dataByteLength: 8 });
            expect(reply.data).to.deep.equal([4,3,2,1]);
            expect(reply.buffer).to.deep.equal(new Buffer([0,1,0,0,0,11,10,3,8,0,4,0,3,0,2,0,1]));
        });    
        it ("modbusQuery() creates a valid writeHoldingRegisters reply.", function () {
            let reply = new modbusReply({ transaction: 2, id: 3, type: "writeHoldingRegisters", register: 50, length: 3 });
            expect(reply).to.be.a("object")
                .and.includes({ transaction: 2, id: 3, type: "writeHoldingRegisters", func: 16, register: 50, length: 3, dataByteLength: 0 });
            expect(reply.data).to.deep.equal([]);
            expect(reply.buffer).to.deep.equal(new Buffer([0,2,0,0,0,6,3,16,0,50,0,3]));
        });
    });

    describe("#bufferToReply()", function () {
        it ("bufferToReply() creates a valid readHoldingRegisters reply", function () {
            let reply = new modbusReply();
            reply.bufferToReply(new Buffer([0,3,0,0,0,7,12,3,4,0,10,0,11]));
            expect(reply).to.be.an("object")
                .and.includes({ transaction: 3, id: 12, type: "readHoldingRegisters", func: 3, length: 2, dataByteLength: 4 });
            expect(reply.data).to.deep.equal([10,11]);
            expect(reply.buffer).to.deep.equal(new Buffer([0,3,0,0,0,7,12,3,4,0,10,0,11]));
        });
        it ("bufferToReply() creates a valid writeHoldingRegisters reply", function () {
            let reply = new modbusReply();
            reply.bufferToReply(new Buffer([0,4,0,0,0,6,15,16,0,50,0,3]));
            expect(reply).to.be.an("object")
                .and.includes({ transaction: 4, id: 15, type: "writeHoldingRegisters", func: 16, length: 3, register: 50, dataByteLength: 0 });
            expect(reply.data).to.deep.equal([]);
            expect(reply.buffer).to.deep.equal(new Buffer([0,4,0,0,0,6,15,16,0,50,0,3]));
        });
    });

});