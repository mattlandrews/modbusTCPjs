"use strict";

const expect = require("chai").expect;
const modbusreply = new require("../src/modbusreply.js");

describe("#ModbusReply", function () {
    
    it ("Constructor w/ undefined", function () {
        let m = new modbusreply();
        expect(m.length).to.equal(1);
        expect(m.dataLength).to.equal(2);
        expect(m.data).to.deep.equal([0]);
        expect(m.getBuffer()).to.deep.equal(Buffer.from([0,0,0,0,0,5,1,3,2,0,0]));
    });
    it ("Constructor w/ Empty Object", function () {
        let m = new modbusreply({});
        expect(m.length).to.equal(1);
        expect(m.dataLength).to.equal(2);
        expect(m.data).to.deep.equal([0]);
        expect(m.getBuffer()).to.deep.equal(Buffer.from([0,0,0,0,0,5,1,3,2,0,0]));
    });
    it ("Constructor w/ Empty Object", function () {
        let m = new modbusreply({
            transaction: 257,
            device: 17,
            type: "readHoldingRegisters",
            data: [1,2,3,4]
        });
        expect(m.length).to.equal(4);
        expect(m.dataLength).to.equal(8);
        expect(m.data).to.deep.equal([1,2,3,4]);
        expect(m.getBuffer()).to.deep.equal(Buffer.from([1,1,0,0,0,11,17,3,8,0,1,0,2,0,3,0,4]));
    });
    it ("Constructor w/ reply array (readHoldingRegister)", function () {
        let m = new modbusreply([1,1,0,0,0,11,17,3,8,0,1,0,2,0,3,0,4]);
        expect(m.length).to.equal(4);
        expect(m.dataLength).to.equal(8);
        expect(m.data).to.deep.equal([1,2,3,4]);
        expect(m.getBuffer()).to.deep.equal(Buffer.from([1,1,0,0,0,11,17,3,8,0,1,0,2,0,3,0,4]));
    });
});