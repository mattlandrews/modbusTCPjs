const { modbusReply } = require("../dist/modbusTCPjs.js");
const expect = require("chai").expect;
const waterfall = require("async").waterfall;

describe("modbusReply", function () {

    let reply;
    beforeEach(function () {
        reply = new modbusReply();
    });
    describe("#modbusReply()", function () {
        it("modbusReply()", function () {
            expect(reply).to.be.a("object");
        });
    });
    describe("#getDevice()", function () {
        it("getDevice()", function () {
            expect(reply.getDevice()).to.equal(1);
        });
    });
    describe("#setDevice()", function () {
        it("getDevice()", function () {
            reply.setDevice(3);
            expect(reply.getDevice()).to.equal(3);
        });
    });
    describe("#getTransaction()", function () {
        it("getTransaction()", function () {
            expect(reply.getTransaction()).to.equal(0);
        });
    });
    describe("#setTransaction()", function () {
        it("setTransaction()", function () {
            reply.setTransaction(22);
            expect(reply.getTransaction()).to.equal(22);
        });
    });    
    describe("#getFunction()", function () {
        it("getFunction()", function () {
            expect(reply.getFunction()).to.equal(null);
        });
    });
    describe("#getRegister()", function () {
        it("getRegister()", function () {
            expect(reply.getRegister()).to.equal(null);
        });
    });
    describe("#getLength()", function () {
        it("getLength()", function () {
            expect(reply.getLength()).to.equal(null);
        });
    });
    describe("#toString()", function () {
        it("toString()", function () {
            expect(reply.toString()).to.equal('{"transaction":0,"protocol":0,"byteLength":null,"device":1,"func":null,"register":null,"length":null,"data":null,"dataByteLength":null}');
        });
    });
    describe("#readHoldingRegisters", function () {
        it("readHoldingRegisters()", function () {
            reply.setTransaction(36);
            reply.setDevice(18);
            reply.readHoldingRegisters([1,2]);
            let testObj = JSON.parse(reply.toString());
            expect(testObj).to.includes({ transaction: 36, protocol: 0, byteLength: 7, device: 18, func: 3, register: null, length: null, dataByteLength: 4 });
            expect(testObj.data).to.deep.equal([1,2]);
        });
    });
    describe("#getBuffer()", function () {
        it("getBuffer() w/ empty reply", function () {
            expect(reply.getBuffer()).to.equal(null);
        });
        it("getBuffer() w/ defined reply", function () {
            reply.setTransaction(37);
            reply.setDevice(19);
            reply.readHoldingRegisters([35,34,33,32]);
            expect(reply.getBuffer()).to.deep.equal(new Buffer([0,37,0,0,0,11,19,3,8,0,35,0,34,0,33,0,32]));
        });
    });
    describe("#setBuffer()", function () {
        it("setBuffer()", function () {
            let reply = new modbusReply();
            reply.setBuffer(new Buffer([0,38,0,0,0,15,20,3,12,0,100,0,101,0,102,0,103,0,104,0,105]));
            let testObj = JSON.parse(reply.toString());
            expect(testObj).to.include({ transaction: 38, protocol: 0, byteLength: 15, device: 20, func: 3, register: null, length: null, dataByteLength: 12 });
            expect(testObj.data).to.deep.equal([100,101,102,103,104,105]);
        });
    });

});