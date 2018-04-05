"use strict";

const readHoldingRegistersReply = require("../src/readHoldingRegistersReply.js");
const expect = require("chai").expect;

describe("readHoldingRegistersReply", function () {
    it("#readHoldingRegistersReply()", function () {
        let query = new readHoldingRegistersReply();
        expect(query).to.be.an("object");
        expect(query.getTransaction).to.be.a("function");
        expect(query.setTransaction).to.be.a("function");
        expect(query.getByteLength).to.be.a("function");
        expect(query.getDevice).to.be.a("function");
        expect(query.setDevice).to.be.a("function");
        expect(query.getFunction).to.be.a("function");
        expect(query.setFunction).to.be.a("function");
        expect(query.getBuffer).to.be.a("function");
    });
    it("getValuesByteCount()", function () {
        let query = new readHoldingRegistersReply();
        expect(query.getValuesByteCount).to.be.a("function");
        expect(query.getValuesByteCount()).to.equal(2);
        expect(query.getBuffer()).to.deep.equal(new Buffer([0,0,0,0,0,5,1,3,2,0,0]));
    });
    
    it("getValues()", function () {
        let query = new readHoldingRegistersReply();
        expect(query.getValues).to.be.a("function");
        expect(query.getValues()).to.deep.equal([0]);
    });
    it("setValues()", function () {
        let query = new readHoldingRegistersReply();
        expect(query.setValues).to.be.a("function");
        expect(query.setValues([1,2])).to.equal(undefined);
        expect(query.getValues()).to.deep.equal([1,2]);
        expect(query.getBuffer()).to.deep.equal(new Buffer([0,0,0,0,0,7,1,3,4,0,1,0,2]));
        expect(query.setValues([10,9,8,7,6,5,4,3,2,1,0])).to.equal(undefined);
        expect(query.getByteLength()).to.equal(25);
        expect(query.getValues()).to.deep.equal([10,9,8,7,6,5,4,3,2,1,0]);
        expect(query.getBuffer()).to.deep.equal(new Buffer([0,0,0,0,0,25,1,3,22,0,10,0,9,0,8,0,7,0,6,0,5,0,4,0,3,0,2,0,1,0,0]));
        expect(query.setValues.bind(query)).to.throw("Invalid Values");
        expect(query.setValues.bind(query, [])).to.throw("Invalid Values");
        expect(query.setValues.bind(query, [-1])).to.throw("Invalid Values");
        expect(query.setValues.bind(query, [65536])).to.throw("Invalid Values");
        expect(query.setValues.bind(query, [0,1,2,3,"4"])).to.throw("Invalid Values");
        expect(query.setValues.bind(query, [0,1,2,3,-1])).to.throw("Invalid Values");
        expect(query.setValues.bind(query, [0,1,false,4,5])).to.throw("Invalid Values");
        expect(query.setValues.bind(query, [0,null,2])).to.throw("Invalid Values");
        let longData = [];
        for (let i=0; i<121; i++) { longData.push(i); }
        expect(query.setValues.bind(query, longData)).to.throw("Invalid Values");
    });
    it("mapFromBuffer()", function () {
        let query = new readHoldingRegistersReply();
        expect(query.mapFromBuffer).to.be.a("function");
        expect(query.mapFromBuffer(new Buffer([0,6,0,0,0,9,10,3,6,0,1,0,2,0,3]))).to.equal(true);
        expect(query.getTransaction()).to.equal(6);
        expect(query.getByteLength()).to.equal(9);
        expect(query.getDevice()).to.equal(10);
        expect(query.getFunction()).to.equal(3);
        expect(query.getValuesByteCount()).to.equal(6);
        expect(query.getValues()).to.deep.equal([1,2,3]);
        expect(query.getBuffer()).to.deep.equal(new Buffer([0,6,0,0,0,9,10,3,6,0,1,0,2,0,3]));
    });
    describe("check inherited functionality", function () {
        it("check all get functions", function () {
            let query = new readHoldingRegistersReply();
            expect(query.getTransaction()).to.equal(0);
            expect(query.getByteLength()).to.equal(5);
            expect(query.getDevice()).to.equal(1);
            expect(query.getFunction()).to.equal(3);
            expect(query.getBuffer()).to.deep.equal(new Buffer([0,0,0,0,0,5,1,3,2,0,0]));
        });
        it("check all set functions", function () {
            let query = new readHoldingRegistersReply();
            expect(query.setTransaction(3000)).to.equal(undefined);
            expect(query.setDevice(150)).to.equal(undefined);
            expect(query.setFunction(4)).to.equal(undefined);
            expect(query.getTransaction()).to.equal(3000);            
            expect(query.getDevice()).to.equal(150);
            expect(query.getFunction()).to.equal(4);
            expect(query.getBuffer()).to.deep.equal(new Buffer([11,184,0,0,0,5,150,4,2,0,0]));
        });
    });
});