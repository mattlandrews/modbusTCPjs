"use strict";

const expect = require("chai").expect;
const modbusmbap = new require("../src/modbusmbap.js");

describe("#ModbusMBAP", function () {
    
    it ("Constructor w/ undefined", function () {
        let m = new modbusmbap();
        expect(m.getBuffer).to.be.a("function");
        expect(m.transaction).to.equal(0);
        expect(m.protocol).to.equal(0);
        expect(m.byteLength).to.equal(2);
        expect(m.device).to.equal(1);
        expect(m.func).to.equal(3);
        expect(m.getBuffer()).to.deep.equal(Buffer.from([0,0,0,0,0,2,1,3]));
    });
    it ("Constructor w/ Empty Object", function () {
        let m = new modbusmbap({});
        expect(m.getBuffer).to.be.a("function");
        expect(m.transaction).to.equal(0);
        expect(m.protocol).to.equal(0);
        expect(m.byteLength).to.equal(2);
        expect(m.device).to.equal(1);
        expect(m.func).to.equal(3);
        expect(m.getBuffer()).to.deep.equal(Buffer.from([0,0,0,0,0,2,1,3]));
    });
    it ("Constructor w/ defined query (readHoldingRegister)", function () {
        let m = new modbusmbap({
            type: "readHoldingRegisters",
            transaction: 2025,
            device: 14,
            address: 16045,
            length: 24
        });
        expect(m.getBuffer).to.be.a("function");
        expect(m.transaction).to.equal(2025);
        expect(m.protocol).to.equal(0);
        expect(m.byteLength).to.equal(2);
        expect(m.device).to.equal(14);
        expect(m.func).to.equal(3);
        expect(m.getBuffer()).to.deep.equal(Buffer.from([7,233,0,0,0,2,14,3]));
    });
    it ("Constructor w/ array (readHoldingRegister)", function () {
        let m = new modbusmbap([7,233,0,0,0,2,14,3]);
        expect(m.getBuffer).to.be.a("function");
        expect(m.transaction).to.equal(2025);
        expect(m.protocol).to.equal(0);
        expect(m.byteLength).to.equal(2);
        expect(m.device).to.equal(14);
        expect(m.func).to.equal(3);
        expect(m.getBuffer()).to.deep.equal(Buffer.from([7,233,0,0,0,2,14,3]));
    });
    it ("getBuffer()", function () {
        let m = new modbusmbap();
        expect(m.getBuffer()).to.deep.equal(m.buffer.slice(0,(6 + m.byteLength)));
    });
});