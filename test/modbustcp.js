const modbusTCP = require("../modbustcp/modbustcp.js");
const expect = require("chai").expect;
const waterfall = require("async").waterfall;

describe("Test modbusTCP module", function () {
    
    let channel = new modbusTCP();
    let query = [];
    
    before("Connect to modbus client", function (done) {
        channel.connect("127.0.0.1", 502, function (err) {
            expect(err).to.be.not.null;
            done();
        });
    });

    it ("create modbus query: type: readHoldingRegisters, register: 0, length: 1", function () {
        query.push(new channel.modbusQuery(1, "readHoldingRegisters", 0, 1, null));
        expect(query).lengthOf(1);
        expect(query[0]).to.be.a("object")
            .and.includes({ "id": 1, type: "readHoldingRegisters", func: 3, register: 0, length: 1 });
    });

    it ("create modbus query: type: readHoldingRegisters, register: 1, length: 1", function () {
        query.push(new channel.modbusQuery(1, "readHoldingRegisters", 1, 1, null));
        expect(query).lengthOf(2);
        expect(query[1]).to.be.a("object")
            .and.includes({ "id": 1, type: "readHoldingRegisters", func: 3, register: 1, length: 1 });
    });

    it ("create modbus query: type: readHoldingRegisters, register: 0, length: 3", function () {
        query.push(new channel.modbusQuery(1, "readHoldingRegisters", 0, 3, null));
        expect(query).lengthOf(3);
        expect(query[2]).to.be.a("object")
            .and.includes({ "id": 1, type: "readHoldingRegisters", func: 3, register: 0, length: 3 });
    });

    it("send a modbus query: type: readHoldingRegisters, register: 0, length: 1", function (done) {
        channel.sendQuery(query[0], function (err, res) {
            expect(err).to.be.null;
            expect(res).lengthOf(1)
                .with.contains(0);
            done();
        });
    });

    it("send a modbus query: type: readHoldingRegisters, register: 1, length: 1", function (done) {
        channel.sendQuery(query[1], function (err, res) {
            expect(err).to.be.null;
            expect(res).lengthOf(1)
                .with.contains(1);
            done();
        });
    });

    it("send a modbus query: type: readHoldingRegisters, register: 0, length: 3", function (done) {
        channel.sendQuery(query[2], function (err, res) {
            expect(err).to.be.null;
            expect(res).lengthOf(3)
                .and.deep.equals([0,1,2]);
            done();
        });
    });

    it("send multiple modbus read query: type: readHoldingRegisters, register: 0, length: 1", function (done) {
        function sendQuery (callback) {
            channel.sendQuery(query[0], function (err, res) {
                expect(err).to.be.null;
                expect(res).lengthOf(1)
                    .with.contains(0);
                callback();
            });
        }
        waterfall([
            sendQuery,
            sendQuery,
            sendQuery
        ],
        function (err) {
            done();
        });
    });

    it ("create modbus query: type: writeHoldingRegisters, register: 0, length: 1, data: [10]", function () {
        query.push(new channel.modbusQuery(1, "writeHoldingRegisters", 0, 1, 10));
        expect(query).lengthOf(4);
        expect(query[3]).to.be.a("object")
            .and.includes({ "id": 1, type: "writeHoldingRegisters", func: 16, register: 0, length: 1 });
        expect(query[3].data).to.be.a("array")
            .and.contains(10);
    });

    it ("create modbus query: type: writeHoldingRegisters, register: 0, length: 1, data: [0]", function () {
        query.push(new channel.modbusQuery(1, "writeHoldingRegisters", 0, 1, 0));
        expect(query).lengthOf(5);
        expect(query[4]).to.be.a("object")
            .and.includes({ "id": 1, type: "writeHoldingRegisters", func: 16, register: 0, length: 1 });
        expect(query[4].data).to.be.a("array")
            .and.contains(0);
    });

    it("send a modbus query: type: writeHoldingRegisters, register: 0, length: 1", function (done) {
        channel.sendQuery(query[3], function (err, res) {
            expect(err).to.be.null;
            expect(res).lengthOf(0);
            done();
        });
    });

    it("send a modbus query: type: writeHoldingRegisters, register: 0, length: 1", function (done) {
        channel.sendQuery(query[4], function (err, res) {
            expect(err).to.be.null;
            expect(res).lengthOf(0);
            done();
        });
    });
});