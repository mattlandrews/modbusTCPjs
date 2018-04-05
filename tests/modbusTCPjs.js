const modbusTCPjs = require("../src/modbusTCPjs.js");
const expect = require("chai").expect;

describe("modbusTCPjs", function () {
    it ("modbusTCPjs", function () {
        expect(modbusTCPjs).to.be.an("object");
        expect(modbusTCPjs.modbusFrame).to.be.a("function");
        expect(modbusTCPjs.modbusMaster).to.be.a("function");
        expect(modbusTCPjs.modbusSlave).to.be.a("function");
    });
});