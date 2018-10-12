"use strict";

const ReadHoldingRegisters = require("../src/readHoldingRegisters.js");
const expect = require("chai").expect;

describe("ReadHoldingRegisters()", function () {
    let rhr;
    it ("#ReadHoldingRegisters()", function () {
        rhr = new ReadHoldingRegisters();
        expect(rhr).to.be.an("object");
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
    })
    it ("setRegister()", function () {
        rhr.setRegister(65000);
        expect(rhr.getRegister()).to.equal(65000);
        expect(rhr._buffer.readUInt16BE(7)).to.equal(65000);
    })
});