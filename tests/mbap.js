"use strict";

const expect = require("chai").expect;
const mbap = new require("../src/mbap.js");

describe("#mbap", function () {
    
    it ("Constructor w/o parameter", function () {

        let m = new mbap();
        expect(m.transaction).to.be.null;
        expect(m.protocol).to.be.null;
        expect(m.length).to.be.null;
        expect(m.message).to.be.null;
        expect(m.readMBAPFromBuffer).to.be.a("function");

    });

    it ("Constructor w/ null parameter", function () {

        let m = new mbap();
        expect(m.transaction).to.be.null;
        expect(m.protocol).to.be.null;
        expect(m.length).to.be.null;
        expect(m.message).to.be.null;
        expect(m.readMBAPFromBuffer).to.be.a("function");

    });

    it ("Constructor w/ non-null parameter", function () {

        expect(() => { let m = new mbap(0); }).to.throw("Constructor type not recognized");

    });

    it ("Constructor w/ valid data", function () {

        let m = new mbap(new Buffer([0,1,0,0,0,6,2,3,0,4,0,5]));
        expect(m.transaction).to.equal(1);
        expect(m.protocol).to.equal(0);
        expect(m.length).to.equal(6);

    });

    it ("toBuffer", function () {

        let m = new mbap();
        m.transaction = 1;
        m.protocol = 2;
        m.length = 0;
        expect(m.toBuffer()).to.deep.equal(Buffer.from([0,1,0,2,0,0]));
        
    });

});