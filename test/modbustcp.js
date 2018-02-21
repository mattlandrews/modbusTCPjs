const modbusTCP = require("../modbustcp/modbustcp.js");
const expect = require("chai").expect;

describe("Test modbusTCP module", function () {
    
    let channel = new modbusTCP();
    let query = [];
    
    before("Connect to modbus client", function (done) {
        channel.connect("127.0.0.1", 502, function (err) {
            expect(err).to.be.not.null;
            done();
        });
    });

    it ("create modbus query: register: 0, length: 1", function () {
        query.push(new channel.modbusQuery(1, "holdingRegisters", 0, 1, null));
        expect(query).lengthOf(1);
        expect(query[0]).to.be.a("object")
            .and.includes({ "id": 1, type: "holdingRegisters", register: 0, length: 1 });
    });

    it ("create modbus query: register: 1, length: 1", function () {
        query.push(new channel.modbusQuery(1, "holdingRegisters", 1, 1, null));
        expect(query).lengthOf(2);
        expect(query[1]).to.be.a("object")
            .and.includes({ "id": 1, type: "holdingRegisters", register: 1, length: 1 });
    });

    it ("create modbus query: register: 0, length: 3", function () {
        query.push(new channel.modbusQuery(1, "holdingRegisters", 0, 3, null));
        expect(query).lengthOf(3);
        expect(query[2]).to.be.a("object")
            .and.includes({ "id": 1, type: "holdingRegisters", register: 0, length: 3 });
    });

    it("send a modbus query: register: 0, length: 1", function (done) {
        channel.sendQuery(query[0], function (err, res) {
            expect(err).to.be.null;
            expect(res).lengthOf(1)
                .with.contains(0);
            done();
        });
    });

    it("send a modbus query: register: 1, length: 1", function (done) {
        channel.sendQuery(query[1], function (err, res) {
            expect(err).to.be.null;
            expect(res).lengthOf(1)
                .with.contains(1);
            done();
        });
    });

    it("send a modbus query: register: 0, length: 3", function (done) {
        channel.sendQuery(query[2], function (err, res) {
            expect(err).to.be.null;
            expect(res).lengthOf(3)
                .and.deep.equals([0,1,2]);
            done();
        });
    });
});