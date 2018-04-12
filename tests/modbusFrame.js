"use strict";

const modbusFrame = require("../src/modbusFrame.js");
const expect = require("chai").expect;

describe("modbusFrame", function () {
    it ("#modbusFrame()", function () {
        let query = new modbusFrame();
        expect(query).to.be.an("object");
    });
    it ("buffer", function () {
        let query = new modbusFrame();
        expect(query.buffer).to.deep.equal(new Buffer([0,0,0,0,0,2,1,1]));
    });
    it("transaction", function () {
        let query = new modbusFrame();
        expect(query.transaction).to.equal(0);
        query.transaction = 1;
        expect(query.transaction).to.equal(1);
        expect(query.buffer).to.deep.equal(new Buffer([0,1,0,0,0,2,1,1]));
        query.transaction = 65535;
        expect(query.transaction).to.equal(65535);
        expect(query.buffer).to.deep.equal(new Buffer([255,255,0,0,0,2,1,1]));
        expect(function () { query.transaction = -1; }).to.throw("Invalid Transaction ID");
        expect(function () { query.transaction = 65536; }).to.throw("Invalid Transaction ID");
        expect(function () { query.transaction = 1.1; }).to.throw("Invalid Transaction ID");
        expect(function () { query.transaction = "0"; }).to.throw("Invalid Transaction ID");
        expect(function () { query.transaction = true; }).to.throw("Invalid Transaction ID");
        expect(function () { query.transaction = null; }).to.throw("Invalid Transaction ID");
        expect(query.buffer).to.deep.equal(new Buffer([255,255,0,0,0,2,1,1]));
    });
    it("byteLength", function () {
        let query = new modbusFrame();
        expect(query.byteLength).to.equal(2);
    });
    it("device", function () {
        let query = new modbusFrame();
        expect(query.device).to.equal(1);
        query.device = 0;
        expect(query.device).to.equal(0);
        expect(query.buffer).to.deep.equal(new Buffer([0,0,0,0,0,2,0,1]));
        query.device = 255;
        expect(query.device).to.equal(255);
        expect(query.buffer).to.deep.equal(new Buffer([0,0,0,0,0,2,255,1]));
        expect(function () { query.device = -1; }).to.throw("Invalid Device ID");
        expect(function () { query.device = 256; }).to.throw("Invalid Device ID");
        expect(function () { query.device = 1.1; }).to.throw("Invalid Device ID");
        expect(function () { query.device = "0"; }).to.throw("Invalid Device ID");
        expect(function () { query.device = true; }).to.throw("Invalid Device ID");
        expect(function () { query.device = null; }).to.throw("Invalid Device ID");
        expect(query.buffer).to.deep.equal(new Buffer([0,0,0,0,0,2,255,1]));
    });
    it("function", function () {
        let query = new modbusFrame();
        expect(query.function).to.equal(1);
        query.function = 0;
        expect(query.function).to.equal(0);
        expect(query.buffer).to.deep.equal(new Buffer([0,0,0,0,0,2,1,0]));
        query.function = 255;
        expect(query.function).to.equal(255);
        expect(query.buffer).to.deep.equal(new Buffer([0,0,0,0,0,2,1,255]));
        expect(function () { query.function = -1; }).to.throw("Invalid Function ID");
        expect(function () { query.function = 256; }).to.throw("Invalid Function ID");
        expect(function () { query.function = 1.1; }).to.throw("Invalid Function ID");
        expect(function () { query.function = "0"; }).to.throw("Invalid Function ID");
        expect(function () { query.function = true; }).to.throw("Invalid Function ID");
        expect(function () { query.function = null; }).to.throw("Invalid Function ID");
        expect(query.buffer).to.deep.equal(new Buffer([0,0,0,0,0,2,1,255]));
    });
    describe("mapFromBuffer()", function () {
        let query = new modbusFrame();
        expect(query.mapFromBuffer).to.be.a("function");
        it("mapFromBuffer() with good buffer", function () {
            query = new modbusFrame();
            expect(query.mapFromBuffer(new Buffer([0,3,0,0,0,2,4,5]))).to.equal(true);
            expect(query.transaction).to.equal(3);
            expect(query.byteLength).to.equal(2);
            expect(query.device).to.equal(4);
            expect(query.function).to.equal(5);
        });
        it("mapFromBuffer() with empty buffer (undefined)", function () {
            query = new modbusFrame();
            expect(query.mapFromBuffer()).to.equal(false);
            expect(query.transaction).to.equal(0);
            expect(query.byteLength).to.equal(2);
            expect(query.device).to.equal(1);
            expect(query.function).to.equal(1);
        });
        it("mapFromBuffer() with empty buffer (empty array)", function () {
            query = new modbusFrame();
            expect(query.mapFromBuffer(new Buffer([]))).to.equal(false);
            expect(query.transaction).to.equal(0);
            expect(query.byteLength).to.equal(2);
            expect(query.device).to.equal(1);
            expect(query.function).to.equal(1);
        });
        it("mapFromBuffer() with buffer that is too short", function () {
            query = new modbusFrame();
            expect(query.mapFromBuffer(new Buffer([0,3,0,0,0,2,4]))).to.equal(false);
            expect(query.transaction).to.equal(3);
            expect(query.byteLength).to.equal(2);
            expect(query.device).to.equal(4);
            expect(query.function).to.equal(1);
        });
        it("mapFromBuffer() with buffer that is too long", function () {
            query = new modbusFrame();
            expect(query.mapFromBuffer(new Buffer([0,3,0,0,0,2,4,3,0,0,0,1]))).to.equal(true);
            expect(query.transaction).to.equal(3);
            expect(query.byteLength).to.equal(2);
            expect(query.device).to.equal(4);
            expect(query.function).to.equal(3);
        });
    });

});