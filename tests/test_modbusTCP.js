"use strict";

const ModbusTCP = require("../src/modbusTCP.js");
const expect = require("chai").expect;

describe("ModbusTCPjs()", function () {
    
    let modbustcp = new ModbusTCP("test");
    
    it ("#ModbusTCPjs", function (){
        expect(modbustcp).to.be.an("object");
        expect(modbustcp.connect).to.be.a("function");
        expect(modbustcp.sendQuery).to.be.a("function");
        expect(modbustcp.pollQuery).to.be.a("function");
        expect(modbustcp.close).to.be.a("function");
    });
    it ("connect()", function (done) {
        modbustcp.connect("127.0.0.1", 502, function () {
            done();
        });
    });
    it ("sendQuery", function () {
        throw new Error("need to define");
    });
});