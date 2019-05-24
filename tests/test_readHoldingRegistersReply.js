"use strict";

const ReadHoldingRegistersReply = require("../src/readHoldingRegistersReply.js");
const expect = require("chai").expect;

describe("ReadHoldingRegistersReply()", function () {
    let rhrr;
    it ("#ReadHoldingRegistersReply()", function () {
        rhrr = new ReadHoldingRegistersReply();
        expect(rhrr).to.be.an("object");
        expect(rhrr.getTransaction).to.be.a("function");
        expect(rhrr.setTransaction).to.be.a("function");
        expect(rhrr.getDevice).to.be.a("function");
        expect(rhrr.setDevice).to.be.a("function");
        expect(rhrr.getFunction).to.be.a("function");
        expect(rhrr.getData).to.be.a("function");
        expect(rhrr.setData).to.be.a("function");
    });
    it ("getFunction()", function () {
        expect(rhrr.getFunction()).to.equal(3);
    });
    it ("getData()", function () {
        expect(rhrr.getData()).to.deep.equal([0]);
    });
    it ("setData()", function () {
        expect(rhrr.setData([1,2])).to.be.undefined;
    });
    it ("getBuffer()", function () {
        expect(rhrr.getBuffer()).to.deep.equal(Buffer.alloc(13, new Uint8Array([0,0,0,0,0,7,1,3,4,0,1,0,2])));
    });
});