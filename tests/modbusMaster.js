const modbusMaster = require("../dist/modbusMaster.js");
const modbusSlave = require("../dist/modbusSlave.js");
const expect = require("chai").expect;
const waterfall = require("async").waterfall;

var master;
var slave;

describe("modbusMaster", function () {

    it("#modbusMaster()", function () {
        master = new modbusMaster();
        expect(master).to.have.property("connect").and.is.a("function");
        expect(master).to.have.property("sendQuery").and.is.a("function");
        expect(master).to.have.property("disconnect").and.is.a("function");
        expect(master).to.have.property("modbusQuery").and.is.a("function");
        expect(master).to.have.property("isConnected").and.equals(false);
    });

    it ("#on - connect event", function (done) {
        slave = new modbusSlave();
        slave.listen("127.0.0.1", 502);
        master.on("connect", function () {
            expect(master.isConnected).to.equal(true);
            done();
        });
        master.connect("127.0.0.1", 502, 500);
    });

    it ("#on - reply event", function (done) {
        master.on("reply", function () {
            expect(master.isConnected).to.equal(true);
            done();
        });
        master.sendQuery(new master.modbusQuery(1, "readHoldingRegisters", 0, 1, null));
    });

    it ("#on - disconnect event", function (done) {
        master.on("disconnect", function () {
            expect(master.isConnected).to.equal(false);
            done();
        });
        master.disconnect();
    });

    it ("#connect() should return error when null ip supplied", function (done){
        delete master;
        master = new modbusMaster();
        master.on("error", function(err){ expect(err).to.be.not.null; done(); });
        master.connect(null, 502, 500);
    });

    it ("#connect() should return error when nonsensical ip supplied", function (done){
        delete master;
        master = new modbusMaster();
        master.on("error", function(err){ expect(err).to.be.not.null; done(); });
        master.connect("192.168.0.256", 502, 500);
    });

    it("#sendQuery() should send a readHoldingRegisters(99:1) query", function (done) {
        master = new modbusMaster();
        query = new master.modbusQuery(1, "readHoldingRegisters", 99, 1, null);
        master.connect("127.0.0.1", 502, 500);
        master.on("connect", function(){
            master.sendQuery(query);
        });
        master.on("reply", function(err, res){
            expect(err).to.be.null;
            expect(res).lengthOf(1)
                .with.contains(99);
            done();
        });
    });

    it("#sendQuery() catches error: unsupported function", function (done) {
        master = new modbusMaster();
        query = new master.modbusQuery(1, "unknown", 99, 1, null);
        master.connect("127.0.0.1", 502, 500);
        master.on("connect", function(){
            master.sendQuery(query);
        });
        master.on("error", function(err){
            expect(err).to.be.an("Error");
            done();
        });
    });

    it("#disconnect() should disconnect successfully", function (done) {
        master = new modbusMaster();
        master.connect("127.0.0.1", 502, 500);
        master.on("connect", function(){
            expect(master.isConnected).to.equal(true);
            master.disconnect();
        });
        master.on("disconnect", function(){
            expect(master.isConnected).to.equal(false);
            slave.close();
            done();
        });
    });
});