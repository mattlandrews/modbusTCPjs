"use strict";

const readHoldingRegistersQuery = require("../src/readHoldingRegistersQuery.js");
const expect = require("chai").expect;

describe("readHoldingRegistersQuery", function () {
    it("#readHoldingRegistersQuery()", function () {
        let query = new readHoldingRegistersQuery();
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
    it("getRegister()", function () {
        let query = new readHoldingRegistersQuery();
        expect(query.getRegister).to.be.a("function");
        expect(query.getRegister()).to.equal(0);
        expect(query.getBuffer()).to.deep.equal(new Buffer([0,0,0,0,0,6,1,3,0,0,0,1]));
    });
    it("setRegister()", function () {
        let query = new readHoldingRegistersQuery();
        expect(query.setRegister).to.be.a("function");
        expect(query.setRegister(1)).to.equal(undefined);
        expect(query.getRegister()).to.equal(1);
        expect(query.getBuffer()).to.deep.equal(new Buffer([0,0,0,0,0,6,1,3,0,1,0,1]));
        expect(query.setRegister(65535)).to.equal(undefined);
        expect(query.getRegister()).to.equal(65535);
        expect(query.getBuffer()).to.deep.equal(new Buffer([0,0,0,0,0,6,1,3,255,255,0,1]));
        expect(query.setRegister.bind(query, -1)).to.throw("Invalid Register");
        expect(query.setRegister.bind(query, 65536)).to.throw("Invalid Register");
        expect(query.setRegister.bind(query, 1.1)).to.throw("Invalid Register");
        expect(query.setRegister.bind(query, "0")).to.throw("Invalid Register");
        expect(query.setRegister.bind(query, true)).to.throw("Invalid Register");
        expect(query.setRegister.bind(query, null)).to.throw("Invalid Register");
        expect(query.getBuffer()).to.deep.equal(new Buffer([0,0,0,0,0,6,1,3,255,255,0,1]));
    });
    it("getRegisterCount()", function () {
        let query = new readHoldingRegistersQuery();
        expect(query.getRegisterCount).to.be.a("function");
        expect(query.getRegisterCount()).to.equal(1);
    });
    it("setRegisterCount()", function () {
        let query = new readHoldingRegistersQuery();
        expect(query.setRegisterCount).to.be.a("function");
        expect(query.setRegisterCount(2)).to.equal(undefined);
        expect(query.getRegisterCount()).to.equal(2);
        expect(query.getBuffer()).to.deep.equal(new Buffer([0,0,0,0,0,6,1,3,0,0,0,2]));
        expect(query.setRegisterCount(120)).to.equal(undefined);
        expect(query.getRegisterCount()).to.equal(120);
        expect(query.getBuffer()).to.deep.equal(new Buffer([0,0,0,0,0,6,1,3,0,0,0,120]));
        expect(query.setRegisterCount.bind(query, 0)).to.throw("Invalid Register Count");
        expect(query.setRegisterCount.bind(query, 121)).to.throw("Invalid Register Count");
        expect(query.setRegisterCount.bind(query, 1.1)).to.throw("Invalid Register Count");
        expect(query.setRegisterCount.bind(query, "1")).to.throw("Invalid Register Count");
        expect(query.setRegisterCount.bind(query, true)).to.throw("Invalid Register Count");
        expect(query.setRegisterCount.bind(query, null)).to.throw("Invalid Register Count");
        expect(query.getBuffer()).to.deep.equal(new Buffer([0,0,0,0,0,6,1,3,0,0,0,120]));
    });
    it("mapFromBuffer()", function () {
        let query = new readHoldingRegistersQuery();
        expect(query.mapFromBuffer).to.be.a("function");
        expect(query.mapFromBuffer(new Buffer([0,6,0,0,0,6,7,8,0,100,0,110]))).to.equal(true);
        expect(query.getTransaction()).to.equal(6);
        expect(query.getByteLength()).to.equal(6);
        expect(query.getDevice()).to.equal(7);
        expect(query.getRegister()).to.equal(100);
        expect(query.getRegisterCount()).to.equal(110);
        expect(query.getBuffer()).to.deep.equal(new Buffer([0,6,0,0,0,6,7,8,0,100,0,110]));
    });
    describe("check inherited functionality", function () {
        it("check all get functions", function () {
            let query = new readHoldingRegistersQuery();
            expect(query.getTransaction()).to.equal(0);
            expect(query.getByteLength()).to.equal(6);
            expect(query.getDevice()).to.equal(1);
            expect(query.getFunction()).to.equal(3);
            expect(query.getBuffer()).to.deep.equal(new Buffer([0,0,0,0,0,6,1,3,0,0,0,1]));
        });
        it("check all set functions", function () {
            let query = new readHoldingRegistersQuery();
            expect(query.setTransaction(3000)).to.equal(undefined);
            expect(query.setDevice(150)).to.equal(undefined);
            expect(query.setFunction(4)).to.equal(undefined);
            expect(query.getTransaction()).to.equal(3000);            
            expect(query.getDevice()).to.equal(150);
            expect(query.getFunction()).to.equal(4);
            expect(query.getBuffer()).to.deep.equal(new Buffer([11,184,0,0,0,6,150,4,0,0,0,1]));
        });
    });
    describe("getMap()", function () {
        it("getMap() good buffer", function () {
            let query = new readHoldingRegistersQuery();
            expect(query.mapFromBuffer(new Buffer([0,20,0,0,0,6,8,3,1,0,0,1]))).to.equal(true);
            expect(query.getMap).to.be.a("function");
            expect(query.getMap()).to.deep.equal({
                "0": { "name": "transaction", "value": 20, "length": 2 },
                "2": { "name": "protocol", "value": 0, "length": 2 },
                "4": { "name": "byteLength", "value": 6, "length": 2 },
                "6": { "name": "device", "value": 8, "length": 1 },
                "7": { "name": "function", "value": 3, "length": 1 },
                "8": { "name": "register", "value": 256, "length": 2 },
                "10": { "name": "registerCount", "value": 1, "length": 2 }
            });
        });
        it("getMap() short buffer", function () {
            let query = new readHoldingRegistersQuery();
            expect(query.mapFromBuffer(new Buffer([0,21,0,0,0,6,9,3,2]))).to.equal(false);
            expect(query.getMap).to.be.a("function");
            expect(query.getMap()).to.deep.equal({
                "0": { "name": "transaction", "value": 21, "length": 2 },
                "2": { "name": "protocol", "value": 0, "length": 2 },
                "4": { "name": "byteLength", "value": 6, "length": 2 },
                "6": { "name": "device", "value": 9, "length": 1 },
                "7": { "name": "function", "value": 3, "length": 1 },
                "8": { "name": "unknown", "value": 2, "length": 1 }
            });
        });
        it("getMap() really short buffer", function () {
            let query = new readHoldingRegistersQuery();
            expect(query.mapFromBuffer(new Buffer([0,21,0,0,0]))).to.equal(false);
            expect(query.getMap).to.be.a("function");
            expect(query.getMap()).to.deep.equal({
                "0": { "name": "transaction", "value": 21, "length": 2 },
                "2": { "name": "protocol", "value": 0, "length": 2 },
                "4": { "name": "unknown", "value": 0, "length": 1 }
            });
        });
        it("getMap() long buffer", function () {
            let query = new readHoldingRegistersQuery();
            expect(query.mapFromBuffer(new Buffer([0,6,0,0,0,2,10,11,12,13]))).to.equal(true);
            expect(query.getMap).to.be.a("function");
            expect(query.getMap()).to.deep.equal({
                "0": { "name": "transaction", "value": 6, "length": 2 },
                "2": { "name": "protocol", "value": 0, "length": 2 },
                "4": { "name": "byteLength", "value": 2, "length": 2 },
                "6": { "name": "device", "value": 10, "length": 1 },
                "7": { "name": "function", "value": 11, "length": 1 }
            });
        });
    });
});