const { modbusQuery } = require("../dist/modbusTCPjs.js");
const expect = require("chai").expect;
const waterfall = require("async").waterfall;

describe("modbusQuery", function () {

    let query;
    beforeEach(function () {
        query = new modbusQuery();
    });
    describe("#modbusQuery()", function () {
        it("modbusQuery()", function () {
            expect(query).to.be.a("object");
        });
    });
    describe("#getDevice()", function () {
        it("getDevice()", function () {
            expect(query.getDevice()).to.equal(1);
        });
    });
    describe("#setDevice()", function () {
        it("getDevice()", function () {
            query.setDevice(3);
            expect(query.getDevice()).to.equal(3);
        });
    });
    describe("#getTransaction()", function () {
        it("getTransaction()", function () {
            expect(query.getTransaction()).to.equal(0);
        });
    });
    describe("#setTransaction()", function () {
        it("setTransaction()", function () {
            query.setTransaction(22);
            expect(query.getTransaction()).to.equal(22);
        });
    });
    describe("#getFunction()", function () {
        it("getFunction()", function () {
            expect(query.getFunction()).to.equal(null);
        });
    });
    describe("#getRegister()", function () {
        it("getRegister()", function () {
            expect(query.getRegister()).to.equal(null);
        });
    });
    describe("#getLength()", function () {
        it("getLength()", function () {
            expect(query.getLength()).to.equal(null);
        });
    });
    describe("#getData()", function () {
        it("getData", function () {
            expect(query.getData()).to.deep.equal(null);
        });
    });
    describe("#toString()", function () {
        it("toString()", function () {
            expect(query.toString()).to.equal('{"transaction":0,"protocol":0,"byteLength":null,"device":1,"func":null,"register":null,"length":null,"data":null,"dataByteLength":null}');
        });
    });
    describe("#readHoldingRegisters", function () {
        it("readHoldingRegisters()", function () {
            query.setTransaction(35);
            query.setDevice(2);
            query.readHoldingRegisters(102,34);
            expect(JSON.parse(query.toString())).to.includes({ transaction: 35, protocol: 0, byteLength: 6, device: 2, func: 3, register: 102, length: 34, data: null, dataByteLength: null });
        });
    });
    describe("#getBuffer()", function () {
        it("getBuffer() w/ empty query", function () {
            expect(query.getBuffer()).to.equal(null);
        });
        it("getBuffer() w/ defined query", function () {
            query.setTransaction(100);
            query.setDevice(13);
            query.readHoldingRegisters(60, 5);
            expect(query.getBuffer()).to.deep.equal(new Buffer([0,100,0,0,0,6,13,3,0,60,0,5]));
        });
    });
    describe("#setBuffer()", function () {
        it("setBuffer()", function () {
            let query = new modbusQuery();
            query.setBuffer(new Buffer([0,101,0,0,0,6,14,3,0,61,0,4]));
            expect(JSON.parse(query.toString())).to.include({ transaction: 101, protocol: 0, byteLength: 6, device: 14, func: 3, register: 61, length: 4, data: null, dataByteLength: null });
        });
    });
    describe("#set functions also alters buffer when query is fully defined", function () {
        it("setTransaction() & setDevice()", function () {
            let query = new modbusQuery();
            query.setTransaction(1);
            query.setDevice(2);
            query.readHoldingRegisters(3,4);
            expect(query.getTransaction()).to.equal(1);
            expect(query.getDevice()).to.equal(2);
            expect(query.getBuffer()).to.deep.equal(new Buffer([0,1,0,0,0,6,2,3,0,3,0,4]));
            query.setTransaction(10);
            query.setDevice(20);
            expect(query.getTransaction()).to.equal(10);
            expect(query.getDevice()).to.equal(20);
            expect(query.getBuffer()).to.deep.equal(new Buffer([0,10,0,0,0,6,20,3,0,3,0,4]));
        });
    });
});