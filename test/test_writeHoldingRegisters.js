'use strict';

const assert = require('assert');
const mbtcp = require('../mbtcp/mbtcp.js');

describe('#writeHoldingRegisters', function () {

    let whrs = new mbtcp.writeHoldingRegisters();

    it ('is an object', function (){
        assert.strictEqual(typeof whrs, "object");
    });

    it ('contains query', function () {
        assert.strictEqual(typeof whrs.query, "object");
    })

    it ('default query is valid', function (){
        assert.deepStrictEqual(whrs.query, {
            type: 'whrs_query',
            transaction: 0,
            protocol: 0,
            length: 15,
            device: 1,
            func: 16,
            address: 0,
            count: 1,
            bytecount: 2,
            data: [0]
        });
    });

    it ('contains reply', function () {
        assert.strictEqual(typeof whrs.reply, "object");
    });

    it ('default reply is valid', function () {
        assert.deepStrictEqual(whrs.reply, {
            type: 'whrs_reply',
            transaction: 0,
            protocol: 0,
            length: 6,
            device: 1,
            func: 16,
            address: 0,
            count: 1
        });
    });
});