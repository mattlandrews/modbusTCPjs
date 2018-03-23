const modbusQuery = require("../dist/modbusQuery.js");
const expect = require("chai").expect;
const waterfall = require("async").waterfall;

describe("modbusQuery", function () {

    describe("#modbusQuery()", function () {
        it ("modbusQuery() creates an empty query object.", function () {
            query = new modbusQuery();
            expect(query).to.be.an("object")
                .and.includes({ transactionID: 0, id: 1, type: "readHoldingRegisters", func: 3, register: 0, length: 1, dataByteLength: 0 });
            expect(query.data).to.deep.equal([]);
            expect(query.buffer).to.deep.equal(new Buffer([0,0,0,0,0,6,1,3,0,0,0,1]));
        });
        it ("modbusQuery() creates a valid readHoldingRegisters query.", function () {
            query = new modbusQuery({ id: 10, type: "readHoldingRegisters", register: 100, length: 120 });
            expect(query).to.be.an("object")
                .and.includes({ transactionID: 0, id: 10, type: "readHoldingRegisters", func: 3, register: 100, length: 120, dataByteLength: 0 });
            expect(query.data).to.deep.equal([]);
            expect(query.buffer).to.deep.equal(new Buffer([0,0,0,0,0,6,10,3,0,100,0,120]));
        });    
        it ("modbusQuery() creates a valid writeHoldingRegisters query.", function () {
            query = new modbusQuery({ id: 3, type: "writeHoldingRegisters", register: 50, length: 3, data: [2,3,4] });
            expect(query).to.be.a("object")
                .and.includes({ transactionID: 0, id: 3, type: "writeHoldingRegisters", func: 16, register: 50, length: 3, dataByteLength: 6 });
            expect(query.data).to.deep.equal([2,3,4]);
            expect(query.buffer).to.deep.equal(new Buffer([0,0,0,0,0,13,3,16,0,50,0,3,6,0,2,0,3,0,4]));
        });
    });

    describe("#bufferToQuery()", function () {
        it ("bufferToQuery() creates a valid readHoldingRegisters query.", function () {
            query = new modbusQuery();
            query.bufferToQuery(new Buffer([1,0,0,0,0,6,5,3,0,20,0,30]));
            expect(query).to.be.an("object")
                .and.includes({ transactionID: 256, id: 5, type: "readHoldingRegisters", func: 3, register: 20, length: 30, dataByteLength: 0 });
            expect(query.data).to.deep.equal([]);
            expect(query.buffer).to.deep.equal(new Buffer([1,0,0,0,0,6,5,3,0,20,0,30]));
        });
        it ("bufferToQuery() creates a valid writeHoldingRegisters query.", function () {
            query = new modbusQuery();
            query.bufferToQuery(new Buffer([1,1,0,0,0,11,7,16,0,21,0,2,4,0,33,0,34]));
            expect(query).to.be.an("object")
                .and.includes({ transactionID: 257, id: 7, type: "writeHoldingRegisters", func: 16, register: 21, length: 2, dataByteLength: 4 });
            expect(query.data).to.deep.equal([33,34]);
            expect(query.buffer).to.deep.equal(new Buffer([1,1,0,0,0,11,7,16,0,21,0,2,4,0,33,0,34]));
        });
    });

});