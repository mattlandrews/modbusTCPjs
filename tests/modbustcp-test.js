const modbusTCP = require("../dist/modbustcp.js");
const expect = require("chai").expect;
const waterfall = require("async").waterfall;

var channel;

describe("modbusTCP", function () {
    var query;

    it("#modbusTCP()", function () {
        channel = new modbusTCP();
        expect(channel).to.have.property("connect").and.is.a("function");
        expect(channel).to.have.property("sendQuery").and.is.a("function");
        expect(channel).to.have.property("disconnect").and.is.a("function");
        expect(channel).to.have.property("modbusQuery").and.is.a("function");
        expect(channel).to.have.property("isConnected").and.equals(false);
    });

    it("#connect() should connect successfully", function (done) {
        channel.connect("127.0.0.1", 502, function (err) {
            expect(err).to.be.not.null;
            done();
        });
    });

    it("#modbusQuery() should return a valid readHoldingRegisters class (99:1)", function () {
        query = new channel.modbusQuery(1, "readHoldingRegisters", 99, 1, null);
        expect(query).to.be.a("object")
            .and.includes({ "id": 1, type: "readHoldingRegisters", func: 3, register: 99, length: 1 });
    });

    it("#sendQuery() should send a readHoldingRegisters(99:1) query", function (done) {
        channel.sendQuery(query, function(err, result){
            expect(err).to.be.null;
            expect(result).lengthOf(1)
                .with.contains(0);
            done();
        });
    });

    it("#sendQuery() catches error: unsupported function", function (done) {
        query = new channel.modbusQuery(1, "unknown", 99, 1, null);
        channel.sendQuery(query, function(err, result){
            expect(err).to.be.an("Error");
            expect(result).to.be.null;
            done();
        });
    });

    it("#sendQuery() catches bad address error", function (done) {
        query = new channel.modbusQuery(1, "readHoldingRegisters", 98, 1, null);
        channel.sendQuery(query, function(err, result){
            done();
        });
    });

    it("#disconnect() should disconnect successfully", function () {
        channel.disconnect();
        expect(channel.isConnected).to.equal(false);
    });
});