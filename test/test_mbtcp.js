'use strict';

const assert = require('assert');

describe('#mbtcp', function () {

    let mbtcp = require('../mbtcp/mbtcp.js');

    it ('mbtcp is an object', function (){
        assert.strictEqual(typeof mbtcp, "object");
    });

    it ('mbtcp has client', function (){
        assert.strictEqual(typeof mbtcp.client, "function");
    });

    it ('mbtcp has readHoldingRegisters', function (){
        assert.strictEqual(typeof mbtcp.readHoldingRegisters, "function");
    });
    
    it ('mbtcp has writeHoldingRegisters', function (){
        assert.strictEqual(typeof mbtcp.readHoldingRegisters, "function");
    });
});