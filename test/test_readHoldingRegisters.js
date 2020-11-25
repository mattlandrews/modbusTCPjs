'use strict';

const assert = require('assert');
const mbtcp = require('../mbtcp/mbtcp.js');

describe('#readHoldingRegisters', function () {

    let rhrs = new mbtcp.readHoldingRegisters();

    it ('is an object', function (){
        assert.strictEqual(typeof rhrs, "object");
    });

    it ('contains query', function () {
        assert.strictEqual(typeof rhrs.query, "object");
    })

    it ('default query is valid', function (){
        assert.deepStrictEqual(rhrs.query, {
            type: 'rhrs_query',
            transaction: 0,
            protocol: 0,
            length: 6,
            device: 1,
            func: 3,
            address: 0,
            count: 1
        });
    });

    it ('contains reply', function () {
        assert.strictEqual(typeof rhrs.reply, "object");
    });

    it ('default reply is valid', function () {
        assert.deepStrictEqual(rhrs.reply, {
            type: 'rhrs_reply',
            transaction: 0,
            protocol: 0,
            length: 5,
            device: 1,
            func: 3,
            bytecount: 2,
            data: [0]
        });
    });
});