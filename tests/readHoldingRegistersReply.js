"use strict";

const readHoldingRegistersReply = require("../src/readHoldingRegistersReply.js");
const expect = require("chai").expect;

describe("readHoldingRegistersReply", function () {
    it("#readHoldingRegistersReply()", function () {
        let query = new readHoldingRegistersReply();
        expect(query).to.be.an("object");
        expect(query.transaction).to.exist;
        expect(query.transaction).to.exist;
        expect(query.byteLength).to.exist;
        expect(query.device).to.exist;
        expect(query.function).to.exist;
        expect(query.buffer).to.exist;
    });
    it("valuesByteCount", function () {
        let query = new readHoldingRegistersReply();
        expect(query.valuesByteCount).to.equal(2);
        expect(query.buffer).to.deep.equal(new Buffer([0,0,0,0,0,5,1,3,2,0,0]));
    });
    
    it("values", function () {
        let query = new readHoldingRegistersReply();
        expect(query.values).to.deep.equal([0]);
        query.values = [1,2];
        expect(query.values).to.deep.equal([1,2]);
        expect(query.buffer).to.deep.equal(new Buffer([0,0,0,0,0,7,1,3,4,0,1,0,2]));
        query.values = [10,9,8,7,6,5,4,3,2,1,0];
        expect(query.byteLength).to.equal(25);
        expect(query.values).to.deep.equal([10,9,8,7,6,5,4,3,2,1,0]);
        expect(query.buffer).to.deep.equal(new Buffer([0,0,0,0,0,25,1,3,22,0,10,0,9,0,8,0,7,0,6,0,5,0,4,0,3,0,2,0,1,0,0]));
        expect(function () { query.values = null; }).to.throw("Invalid Values");
        expect(function () { query.values = []; }).to.throw("Invalid Values");
        expect(function () { query.values = [-1]; }).to.throw("Invalid Values");
        expect(function () { query.values = [65536]; }).to.throw("Invalid Values");
        expect(function () { query.values = [0,1,2,3,"4"]; }).to.throw("Invalid Values");
        expect(function () { query.values = [0,1,2,3,-1]; }).to.throw("Invalid Values");
        expect(function () { query.values = [0,1,false,4,5]; }).to.throw("Invalid Values");
        expect(function () { query.values = [0,null,2]; }).to.throw("Invalid Values");
        let longData = [];
        for (let i=0; i<121; i++) { longData.push(i); }
        expect(function () { query.values = longData; }).to.throw("Invalid Values");
    });
    it("mapFromBuffer()", function () {
        let query = new readHoldingRegistersReply();
        expect(query.mapFromBuffer).to.be.a("function");
        expect(query.mapFromBuffer(new Buffer([0,6,0,0,0,9,10,3,6,0,1,0,2,0,3]))).to.equal(true);
        expect(query.transaction).to.equal(6);
        expect(query.byteLength).to.equal(9);
        expect(query.device).to.equal(10);
        expect(query.function).to.equal(3);
        expect(query.valuesByteCount).to.equal(6);
        expect(query.values).to.deep.equal([1,2,3]);
        expect(query.buffer).to.deep.equal(new Buffer([0,6,0,0,0,9,10,3,6,0,1,0,2,0,3]));
    });
    describe("check inherited functionality", function () {
        it("check all get functions", function () {
            let query = new readHoldingRegistersReply();
            expect(query.transaction).to.equal(0);
            expect(query.byteLength).to.equal(5);
            expect(query.device).to.equal(1);
            expect(query.function).to.equal(3);
            expect(query.buffer).to.deep.equal(new Buffer([0,0,0,0,0,5,1,3,2,0,0]));
        });
        it("check all set functions", function () {
            let query = new readHoldingRegistersReply();
            query.transaction = 3000;
            query.device = 150;
            query.function = 4;
            expect(query.transaction).to.equal(3000);            
            expect(query.device).to.equal(150);
            expect(query.function).to.equal(4);
            expect(query.buffer).to.deep.equal(new Buffer([11,184,0,0,0,5,150,4,2,0,0]));
        });
    });
});