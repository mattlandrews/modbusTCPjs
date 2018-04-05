const { modbusMaster, modbusSlave, readHoldingRegistersQuery, readHoldingRegistersReply } = require("../src/modbusTCPjs.js");
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
        slave.on("query", function (query) {
            expect(slave.isListening).to.equal(true);
            expect(slave.isConnected).to.equal(true);
            done();
        });
        let query = new readHoldingRegistersQuery();
        query.setDevice(1);
        query.setRegister(0);
        query.setRegisterCount(1);
        master.sendQuery(query);
    });

    it ("#on - reply event", function (done) {
        slave.on("reply", function (reply) {
            expect(slave.isListening).to.equal(true);
            expect(slave.isConnected).to.equal(true);
            done();
        });
        let query = new readHoldingRegistersQuery();
        query.setDevice(1);
        query.setRegister(0);
        query.setRegisterCount(1);
        master.sendQuery(query);
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