"use strict";

const readHoldingRegistersQuery = require("../src/readHoldingRegistersQuery.js");
const expect = require("chai").expect;

describe("readHoldingRegistersQuery", function () {
    it("#readHoldingRegistersQuery()", function () {
        let query = new readHoldingRegistersQuery();
        expect(query).to.be.an("object");
        expect(query.transaction).to.exist;
        expect(query.byteLength).to.exist;
        expect(query.device).to.exist;
        expect(query.function).to.exist;
        expect(query.buffer).to.exist;
    });
    it("register", function () {
        let query = new readHoldingRegistersQuery();
        expect(query.register).to.equal(0);
        expect(query.buffer).to.deep.equal(new Buffer([0,0,0,0,0,6,1,3,0,0,0,1]));
        query.register = 1;
        expect(query.register).to.equal(1);
        expect(query.buffer).to.deep.equal(new Buffer([0,0,0,0,0,6,1,3,0,1,0,1]));
        query.register = 65535;
        expect(query.register).to.equal(65535);
        expect(query.buffer).to.deep.equal(new Buffer([0,0,0,0,0,6,1,3,255,255,0,1]));
        expect(function () { query.register = -1; }).to.throw("Invalid Register");
        expect(function () { query.register = 65536; }).to.throw("Invalid Register");
        expect(function () { query.register = 1.1; }).to.throw("Invalid Register");
        expect(function () { query.register = "0"; }).to.throw("Invalid Register");
        expect(function () { query.register = true; }).to.throw("Invalid Register");
        expect(function () { query.register = null; }).to.throw("Invalid Register");
        expect(query.buffer).to.deep.equal(new Buffer([0,0,0,0,0,6,1,3,255,255,0,1]));
    });
    it("registerCount", function () {
        let query = new readHoldingRegistersQuery();
        expect(query.registerCount).to.equal(1);
        query.registerCount = 2;
        expect(query.registerCount).to.equal(2);
        expect(query.buffer).to.deep.equal(new Buffer([0,0,0,0,0,6,1,3,0,0,0,2]));
        query.registerCount = 120;
        expect(query.registerCount).to.equal(120);
        expect(query.buffer).to.deep.equal(new Buffer([0,0,0,0,0,6,1,3,0,0,0,120]));
        expect(function () { query.registerCount = 0; }).to.throw("Invalid Register Count");
        expect(function () { query.registerCount = 121; }).to.throw("Invalid Register Count");
        expect(function () { query.registerCount = 1.1; }).to.throw("Invalid Register Count");
        expect(function () { query.registerCount = "0"; }).to.throw("Invalid Register Count");
        expect(function () { query.registerCount = true; }).to.throw("Invalid Register Count");
        expect(function () { query.registerCount = null; }).to.throw("Invalid Register Count");
        expect(query.buffer).to.deep.equal(new Buffer([0,0,0,0,0,6,1,3,0,0,0,120]));
    });
    it("mapFrombuffer", function () {
        let query = new readHoldingRegistersQuery();
        expect(query.mapFromBuffer).to.be.a("function");
        expect(query.mapFromBuffer(new Buffer([0,6,0,0,0,6,7,8,0,100,0,110]))).to.equal(true);
        expect(query.transaction).to.equal(6);
        expect(query.byteLength).to.equal(6);
        expect(query.device).to.equal(7);
        expect(query.register).to.equal(100);
        expect(query.registerCount).to.equal(110);
        expect(query.buffer).to.deep.equal(new Buffer([0,6,0,0,0,6,7,8,0,100,0,110]));
    });
    describe("check inherited functionality", function () {
        it("check all get functions", function () {
            let query = new readHoldingRegistersQuery();
            expect(query.transaction).to.equal(0);
            expect(query.byteLength).to.equal(6);
            expect(query.device).to.equal(1);
            expect(query.function).to.equal(3);
            expect(query.buffer).to.deep.equal(new Buffer([0,0,0,0,0,6,1,3,0,0,0,1]));
        });
        it("check all set functions", function () {
            let query = new readHoldingRegistersQuery();
            query.transaction = 3000;
            query.device = 150;
            query.function = 4;
            expect(query.transaction).to.equal(3000);            
            expect(query.device).to.equal(150);
            expect(query.function).to.equal(4);
            expect(query.buffer).to.deep.equal(new Buffer([11,184,0,0,0,6,150,4,0,0,0,1]));
        });
    });
});