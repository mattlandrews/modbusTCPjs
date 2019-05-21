"use strict";

const WriteHoldingRegisters = require("../src/writeHoldingRegisters.js");
const expect = require("chai").expect;

describe("WriteHoldingRegisters()", function () {
    let whr;
    it ("#WriteHoldingRegisters()", function () {
        whr = new WriteHoldingRegisters();
        expect(whr).to.be.an("object");
        expect(whr.getTransaction).to.be.a("function");
        expect(whr.setTransaction).to.be.a("function");
        expect(whr.getDevice).to.be.a("function");
        expect(whr.setDevice).to.be.a("function");
        expect(whr.getFunction).to.be.a("function");
        expect(whr.getRegister).to.be.a("function");
        expect(whr.setRegister).to.be.a("function");
        expect(whr.getLength).to.be.a("function");
        expect(whr.getData).to.be.a("function");
        expect(whr.setData).to.be.a("function");
    });
    it ("getFunction()", function () {
        expect(whr.getFunction()).to.equal(16);
    });
    it ("getRegister()", function () {
        expect(whr.getRegister()).to.equal(0);
    });
    it ("setRegister()", function () {
        whr.setRegister(65000);
        expect(whr.getRegister()).to.equal(65000);
        expect(whr._buffer.readUInt16BE(8)).to.equal(65000);
    });
    it ("getLength()", function () {
        expect(whr.getLength()).to.equal(1);
    });
    it ("getData()", function () {
        expect(whr.getData()).to.deep.equal([0]);
    });
    it ("setData()", function () {
        whr.setData([0,1,2,3]);
        expect(whr.getData()).to.deep.equal([0,1,2,3]);
        expect(whr.getLength()).to.equal(4);
    });
    it ("getBuffer()", function () {
        expect(whr.getBuffer()).to.deep.equal(Buffer.alloc(21, new Uint8Array([0,0,0,0,0,15,1,16,253,232,0,4,8,0,0,0,1,0,2,0,3])));
    });
    it ("parseReply()", function () {
        expect(whr.parseReply(Buffer.alloc(12, new Uint8Array([0,0,0,0,0,5,1,16,253,232,0,4])))).to.deep.equal([]);
        expect(whr.parseReply(Buffer.alloc(12, new Uint8Array([0,0,0,0,0,5,2,16,253,232,0,4])))).to.be.null;
    });
});