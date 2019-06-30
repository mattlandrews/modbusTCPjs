"use strict";

const expect = require("chai").expect;
const modbusquery = new require("../src/modbusquery.js");

describe("#ModbusQuery", function () {
    
    it ("Constructor w/ undefined", function () {
        let m = new modbusquery();
        expect(m.getBuffer).to.be.a("function");
        expect(m.transaction).to.equal(0);
        expect(m.protocol).to.equal(0);
        expect(m.byteLength).to.equal(6);
        expect(m.device).to.equal(1);
        expect(m.func).to.equal(3);
        expect(m.address).to.equal(0);
        expect(m.length).to.equal(1);
        expect(m.getBuffer()).to.deep.equal(Buffer.from([0,0,0,0,0,6,1,3,0,0,0,1]));
    });
    it ("Constructor w/ Empty Object", function () {
        let m = new modbusquery({});
        expect(m.getBuffer).to.be.a("function");
        expect(m.transaction).to.equal(0);
        expect(m.protocol).to.equal(0);
        expect(m.byteLength).to.equal(6);
        expect(m.device).to.equal(1);
        expect(m.func).to.equal(3);
        expect(m.address).to.equal(0);
        expect(m.length).to.equal(1);
        expect(m.getBuffer()).to.deep.equal(Buffer.from([0,0,0,0,0,6,1,3,0,0,0,1]));
    });
    it ("Constructor w/ defined query", function () {
        let m = new modbusquery({
            type: "readHoldingRegisters",
            transaction: 2025,
            device: 14,
            address: 16045,
            length: 24
        });
        expect(m.getBuffer).to.be.a("function");
        expect(m.transaction).to.equal(2025);
        expect(m.protocol).to.equal(0);
        expect(m.byteLength).to.equal(6);
        expect(m.device).to.equal(14);
        expect(m.func).to.equal(3);
        expect(m.address).to.equal(16045);
        expect(m.length).to.equal(24);
        expect(m.getBuffer()).to.deep.equal(Buffer.from([7,233,0,0,0,6,14,3,62,173,0,24]));
    });
});