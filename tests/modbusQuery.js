const modbusQuery = require("../dist/modbusQuery.js");
const expect = require("chai").expect;
const waterfall = require("async").waterfall;

describe("modbusQuery", function () {

    it ("modbusQuery() creates an empty query object.", function () {
        query = new modbusQuery();
        expect(query).to.be.an("object")
            .and.includes({ id: 1, type: "readHoldingRegisters", func: 3, register: 0, length: 1 });
        expect(query.data).to.deep.equal([]);
        expect(query.buffer).to.deep.equal(new Buffer([0,0,0,0,0,6,1,3,0,0,0,1]));
    });

    it ("modbusQuery() creates a valid readHoldingRegisters query.", function () {
        query = new modbusQuery(10, "readHoldingRegisters", 100, 120, null);
        expect(query).to.be.an("object")
            .and.includes({ id: 10, type: "readHoldingRegisters", func: 3, register: 100, length: 120 });
        expect(query.data).to.deep.equal([]);
        expect(query.buffer).to.deep.equal(new Buffer([0,0,0,0,0,6,10,3,0,100,0,120]));
    });

    it ("modbusQuery() creates a valid writeHoldingRegisters query.", function () {
        query = new modbusQuery(3, "writeHoldingRegisters", 50, 3, [2,3,4]);
        expect(query).to.be.a("object")
            .and.includes({ id: 3, type: "writeHoldingRegisters", func: 16, register: 50, length: 3 });
        expect(query.data).to.deep.equal([2,3,4]);
        expect(query.buffer).to.deep.equal(new Buffer([0,0,0,0,0,13,3,16,0,50,0,3,6,0,2,0,3,0,4]));
    });

});