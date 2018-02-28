const modbusQuery = require("../modbustcp/modbusQuery.js");
const expect = require("chai").expect;
const waterfall = require("async").waterfall;

describe("modbusQuery", function () {

    it("#modbusQuery() creates a valid readHoldingRegister query (99:1)", function () {
        query = new modbusQuery(1, "readHoldingRegisters", 99, 1, null);
        expect(query).to.be.a("object")
            .and.includes({ "id": 1, type: "readHoldingRegisters", func: 3, register: 99, length: 1 });
    });
    it("#modbusQuery() creates a valid readHoldingRegister query (99:120)", function () {
        query = new modbusQuery(1, "readHoldingRegisters", 99, 120, null);
        expect(query).to.be.a("object")
            .and.includes({ "id": 1, type: "readHoldingRegisters", func: 3, register: 99, length: 120 });
    });
    it("#modbusQuery() creates a valid writeHoldingRegisters query (100:1 - 1)", function () {
        query = new modbusQuery(1, "writeHoldingRegisters", 100, 1, 1);
        expect(query).to.be.a("object")
            .and.includes({ "id": 1, type: "writeHoldingRegisters", func: 16, register: 100, length: 1 });
        expect(query.data).to.be.an.an("array")
            .and.deep.equals([1]);
    });
    it("#modbusQuery() creates a valid writeHoldingRegisters query (101:2 - 2,3)", function () {
        query = new modbusQuery(1, "writeHoldingRegisters", 101, 2, [2,3]);
        expect(query).to.be.a("object")
            .and.includes({ "id": 1, type: "writeHoldingRegisters", func: 16, register: 101, length: 2 });
        expect(query.data).to.be.an("array")
            .and.deep.equals([2,3]);
    });
});