const modbusMaster = require("../dist/modbusMaster.js");
const modbusSlave = require("../dist/modbusSlave.js");
const expect = require("chai").expect;

var master;
var slave;

describe("modbusSlave", function () {
    
    it ("#modbusSlave()", function () {
        slave = new modbusSlave();
        expect(slave).to.have.property("on").and.is.a("function");
        expect(slave).to.have.property("listen").and.is.a("function");
        expect(slave).to.have.property("close").and.is.a("function");
        expect(slave).to.have.property("isListening").and.equals(false);
        expect(slave).to.have.property("isConnected").and.equals(false);
    });

    it ("#on - listen event", function (done) {
        slave.on("listen", function () {
            expect(slave.isListening).to.equal(true);
            expect(slave.isConnected).to.equal(false);
            done();
        });
        slave.listen("127.0.0.1", 502);
    });

    it ("#on - connect event", function (done) {
        master = new modbusMaster();
        slave.on("connect", function () {
            expect(slave.isListening).to.equal(true);
            expect(slave.isConnected).to.equal(true);
            done();
        });
        master.connect("127.0.0.1", 502, 500);
    });

    it ("#on - query event", function (done) {
        slave.on("query", function () {
            expect(slave.isListening).to.equal(true);
            expect(slave.isConnected).to.equal(true);
            done();
        });
        master.sendQuery(new master.modbusQuery(1, "readHoldingRegisters", 0, 1, null));
    });

    it ("#on - disconnect event", function (done) {
        slave.on("disconnect", function () {
            expect(slave.isListening).to.equal(true);
            expect(slave.isConnected).to.equal(false);
            done();
        });
        master.disconnect();
    });

    it ("#on - close event", function (done) {
        slave.on("close", function () {
            expect(slave.isListening).to.equal(false);
            expect(slave.isConnected).to.equal(false);
            done();
        });
        slave.close();
    });

});