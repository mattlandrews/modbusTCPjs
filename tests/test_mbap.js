"use strict";

const MBAP = require("../src/mbap.js");
const expect = require("chai").expect;

describe("MBAP()", function () {
    let mbap;
    it ("#MBAP()", function () {
        mbap = new MBAP();
        expect(mbap).to.be.an("object");
        expect(mbap.getTransaction).to.be.a("function");
        expect(mbap.setTransaction).to.be.a("function");
    });
    it ("getTransaction()", function () {
        expect(mbap.getTransaction()).to.equal(0);
    });
    it ("setTransaction()", function () {
        mbap.setTransaction(1);
        expect(mbap.getTransaction()).to.equal(1);
    });
    it ("getBuffer()", function () {
        expect(mbap.getBuffer()).to.deep.equal(new Buffer([0,1,0,0,0,0]));
    });
});