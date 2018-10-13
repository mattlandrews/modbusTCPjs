"use strict";

const ReadHoldingRegisters = require("../src/readHoldingRegisters.js");
const expect = require("chai").expect;

describe("ReadHoldingRegisters()", function () {
    let rhr;
    it ("#ReadHoldingRegisters()", function () {
        rhr = new ReadHoldingRegisters();
        expect(rhr).to.be.an("object");
        expect(rhr.getTransaction).to.be.a("function");
        expect(rhr.setTransaction).to.be.a("function");
        expect(rhr.getDevice).to.be.a("function");
        expect(rhr.setDevice).to.be.a("function");
        expect(rhr.getFunction).to.be.a("function");
        expect(rhr.getRegister).to.be.a("function");
        expect(rhr.setRegister).to.be.a("function");
        expect(rhr.getLength).to.be.a("function");
        expect(rhr.getLength).to.be.a("function");
    });
    it ("getFunction()", function () {
        expect(rhr.getFunction()).to.equal(3);
    });
    it ("getRegister()", function () {
        expect(rhr.getRegister()).to.equal(0);
    });
    it ("setRegister()", function () {
        rhr.setRegister(65000);
        expect(rhr.getRegister()).to.equal(65000);
        expect(rhr._buffer.readUInt16BE(8)).to.equal(65000);
    });
    it ("getLength()", function () {
        expect(rhr.getLength()).to.equal(1);
    });
    it ("setLength()", function () {
        rhr.setLength(120);
        expect(rhr.getLength()).to.equal(120);
        expect(rhr._buffer.readUInt16BE(10)).to.equal(120);
    });
    it ("getBuffer()", function () {
        expect(rhr.getBuffer()).to.deep.equal(new Buffer([0,0,0,0,0,6,1,3,253,232,0,120]));
    });
    it ("parseReply()", function () {
        rhr.setLength(4);
        expect(rhr.parseReply(new Buffer([0,0,0,0,0,5,1,3,8,0,0,0,1,0,2,0,3]))).to.deep.equal([0,1,2,3]);
        expect(rhr.parseReply(new Buffer([0,0,0,0,0,5,2,3,8,0,0,0,1,0,2,0,3]))).to.be.null;
    });
});