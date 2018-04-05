const modbusFrame = require("../src/modbusFrame.js");
const expect = require("chai").expect;

describe("modbusFrame", function () {
    it ("#modbusFrame()", function () {
        let query = new modbusFrame();
        expect(query).to.be.an("object");
    });
    it ("getBuffer()", function () {
        let query = new modbusFrame();
        expect(query.getBuffer).to.be.a("function");
        expect(query.getBuffer()).to.deep.equal(new Buffer([0,0,0,0,0,2,1,1]));
    });
    it("getTransaction()", function () {
        let query = new modbusFrame();
        expect(query.getTransaction).to.be.a("function");
        expect(query.getTransaction()).to.equal(0);
    });
    it("setTransaction()", function () {
        let query = new modbusFrame();
        expect(query.setTransaction).to.be.a("function");
        expect(query.setTransaction(1)).to.equal(undefined);
        expect(query.getTransaction()).to.equal(1);
        expect(query.getBuffer()).to.deep.equal(new Buffer([0,1,0,0,0,2,1,1]));
        expect(query.setTransaction(65535)).to.equal(undefined);
        expect(query.getTransaction()).to.equal(65535);
        expect(query.getBuffer()).to.deep.equal(new Buffer([255,255,0,0,0,2,1,1]));
        expect(query.setTransaction.bind(query, -1)).to.throw("Invalid Transaction ID");
        expect(query.setTransaction.bind(query, 65536)).to.throw("Invalid Transaction ID");
        expect(query.setTransaction.bind(query, 1.1)).to.throw("Invalid Transaction ID");
        expect(query.setTransaction.bind(query, "0")).to.throw("Invalid Transaction ID");
        expect(query.setTransaction.bind(query, true)).to.throw("Invalid Transaction ID");
        expect(query.setTransaction.bind(query, null)).to.throw("Invalid Transaction ID");
        expect(query.getBuffer()).to.deep.equal(new Buffer([255,255,0,0,0,2,1,1]));
    });
    it("getByteLength()", function () {
        let query = new modbusFrame();
        expect(query.getByteLength).to.be.a("function");
        expect(query.getByteLength()).to.equal(2);
    });
    it("getDevice()", function () {
        let query = new modbusFrame();
        expect(query.getDevice).to.be.a("function");
        expect(query.getDevice()).to.equal(1);
    });
    it("setDevice()", function () {
        let query = new modbusFrame();
        expect(query.setDevice).to.be.a("function");
        expect(query.setDevice(0)).to.equal(undefined);
        expect(query.getDevice()).to.equal(0);
        expect(query.getBuffer()).to.deep.equal(new Buffer([0,0,0,0,0,2,0,1]));
        expect(query.setDevice(255)).to.equal(undefined);
        expect(query.getDevice()).to.equal(255);
        expect(query.getBuffer()).to.deep.equal(new Buffer([0,0,0,0,0,2,255,1]));
        expect(query.setDevice.bind(query, -1)).to.throw("Invalid Device ID");
        expect(query.setDevice.bind(query, 256)).to.throw("Invalid Device ID");
        expect(query.setDevice.bind(query, 1.1)).to.throw("Invalid Device ID");
        expect(query.setDevice.bind(query, "0")).to.throw("Invalid Device ID");
        expect(query.setDevice.bind(query, true)).to.throw("Invalid Device ID");
        expect(query.setDevice.bind(query, null)).to.throw("Invalid Device ID");
        expect(query.getBuffer()).to.deep.equal(new Buffer([0,0,0,0,0,2,255,1]));
    });
    it("getFunction()", function () {
        let query = new modbusFrame();
        expect(query.getFunction).to.be.a("function");
        expect(query.getFunction()).to.equal(1);
    });
    it("setFunction()", function () {
        let query = new modbusFrame();
        expect(query.setFunction).to.be.a("function");
        expect(query.setFunction(0)).to.equal(undefined);
        expect(query.getFunction()).to.equal(0);
        expect(query.getBuffer()).to.deep.equal(new Buffer([0,0,0,0,0,2,1,0]));
        expect(query.setFunction(255)).to.equal(undefined);
        expect(query.getFunction()).to.equal(255);
        expect(query.getBuffer()).to.deep.equal(new Buffer([0,0,0,0,0,2,1,255]));
        expect(query.setFunction.bind(query, -1)).to.throw("Invalid Function ID");
        expect(query.setFunction.bind(query, 256)).to.throw("Invalid Function ID");
        expect(query.setFunction.bind(query, 1.1)).to.throw("Invalid Function ID");
        expect(query.setFunction.bind(query, "0")).to.throw("Invalid Function ID");
        expect(query.setFunction.bind(query, true)).to.throw("Invalid Function ID");
        expect(query.setFunction.bind(query, null)).to.throw("Invalid Function ID");
        expect(query.getBuffer()).to.deep.equal(new Buffer([0,0,0,0,0,2,1,255]));
    });
    it("resizeBuffer", function () {
        let query = new modbusFrame();
        let test = query.resizeBuffer(14);
        expect(test.length).to.equal(14);
        expect(test).to.equal(query.getBuffer());
    });
    describe("mapFromBuffer()", function () {
        let query = new modbusFrame();
        expect(query.mapFromBuffer).to.be.a("function");
        it("mapFromBuffer() with good buffer", function () {
            query = new modbusFrame();
            expect(query.mapFromBuffer(new Buffer([0,3,0,0,0,2,4,5]))).to.equal(true);
            expect(query.getTransaction()).to.equal(3);
            expect(query.getByteLength()).to.equal(2);
            expect(query.getDevice()).to.equal(4);
            expect(query.getFunction()).to.equal(5);
        });
        it("mapFromBuffer() with empty buffer", function () {
            query = new modbusFrame();
            expect(query.mapFromBuffer()).to.equal(false);
            expect(query.getTransaction()).to.equal(0);
            expect(query.getByteLength()).to.equal(2);
            expect(query.getDevice()).to.equal(1);
            expect(query.getFunction()).to.equal(1);
        });
        it("mapFromBuffer() with empty buffer", function () {
            query = new modbusFrame();
            expect(query.mapFromBuffer(new Buffer([]))).to.equal(false);
            expect(query.getTransaction()).to.equal(0);
            expect(query.getByteLength()).to.equal(2);
            expect(query.getDevice()).to.equal(1);
            expect(query.getFunction()).to.equal(1);
        });
        it("mapFromBuffer() with buffer that is too short", function () {
            query = new modbusFrame();
            expect(query.mapFromBuffer(new Buffer([0,3,0,0,0,2,4]))).to.equal(false);
            expect(query.getTransaction()).to.equal(3);
            expect(query.getByteLength()).to.equal(2);
            expect(query.getDevice()).to.equal(4);
            expect(query.getFunction()).to.equal(1);
        });
        it("mapFromBuffer() with buffer that is too long", function () {
            query = new modbusFrame();
            expect(query.mapFromBuffer(new Buffer([0,3,0,0,0,2,4,3,0,0,0,1]))).to.equal(true);
            expect(query.getTransaction()).to.equal(3);
            expect(query.getByteLength()).to.equal(2);
            expect(query.getDevice()).to.equal(4);
            expect(query.getFunction()).to.equal(3);
        });
    });
});