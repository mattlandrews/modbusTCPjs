"use strict";

const expect = require("chai").expect;
const ReadHoldingRegisters_Query = new require("../src/readHoldingRegisters_Query.js");

describe("#readHoldingRegisters_Query", function () {
    
    it ("Constructor w/o parameter", function () {

        let m = new ReadHoldingRegisters_Query(null);
        expect(m.transaction).to.be.null;
        expect(m.protocol).to.be.null;
        expect(m.length).to.be.null;
        expect(m.device).to.equal(1);
        expect(m.func).to.equal(3);
        expect(m.address).to.equal(0);
        expect(m.registers).to.equal(1);

    });

    it ("Constructor w/ valid data", function () {

        let m = new ReadHoldingRegisters_Query(new Buffer([0,1,0,0,0,6,2,3,0,4,0,5]));
        expect(m.transaction).to.equal(1);
        expect(m.protocol).to.equal(0);
        expect(m.length).to.equal(6);
        expect(m.device).to.equal(2);
        expect(m.func).to.equal(3);
        expect(m.address).to.equal(4);
        expect(m.registers).to.equal(5);

    });

});