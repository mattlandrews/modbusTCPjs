"use strict";

const ReadHoldingRegistersQuery = require("../src/readHoldingRegistersQuery.js");
const expect = require("chai").expect;

describe("ReadHoldingRegistersQuery()", function () {
    let rhrq;
    it ("#ReadHoldingRegistersQuery()", function () {
        rhrq = new ReadHoldingRegistersQuery();
        expect(rhrq).to.be.an("object");
        expect(rhrq.getTransaction).to.be.a("function");
        expect(rhrq.setTransaction).to.be.a("function");
        expect(rhrq.getDevice).to.be.a("function");
        expect(rhrq.setDevice).to.be.a("function");
        expect(rhrq.getFunction).to.be.a("function");
        expect(rhrq.getRegister).to.be.a("function");
        expect(rhrq.setRegister).to.be.a("function");
        expect(rhrq.getLength).to.be.a("function");
        expect(rhrq.getLength).to.be.a("function");
    });
    it ("getFunction()", function () {
        expect(rhrq.getFunction()).to.equal(3);
    });
    it ("getRegister()", function () {
        expect(rhrq.getRegister()).to.equal(0);
    });
    it ("setRegister()", function () {
        rhrq.setRegister(65000);
        expect(rhrq.getRegister()).to.equal(65000);
        expect(rhrq._buffer.readUInt16BE(8)).to.equal(65000);
    });
    it ("getLength()", function () {
        expect(rhrq.getLength()).to.equal(1);
    });
    it ("setLength()", function () {
        rhrq.setLength(120);
        expect(rhrq.getLength()).to.equal(120);
        expect(rhrq._buffer.readUInt16BE(10)).to.equal(120);
    });
    it ("getBuffer()", function () {
        expect(rhrq.getBuffer()).to.deep.equal(Buffer.alloc(12, new Uint8Array([0,0,0,0,0,6,1,3,253,232,0,120])));
    });
    it ("parseReply()", function () {
        rhrq.setLength(4);
        expect(rhrq.parseReply(Buffer.alloc(17, new Uint8Array([0,0,0,0,0,5,1,3,8,0,0,0,1,0,2,0,3])))).to.deep.equal([0,1,2,3]);
        expect(rhrq.parseReply(Buffer.alloc(17, new Uint8Array([0,0,0,0,0,5,2,3,8,0,0,0,1,0,2,0,3])))).to.be.null;
    });
});