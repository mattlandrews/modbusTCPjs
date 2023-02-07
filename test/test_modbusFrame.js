"use strict";

let assert = require("assert");
const modbusFrame = require("../src2/modbusFrame.js");

describe("modbusFrame", function () {
    describe ("#modbusFrame()", function () {
        it("constructor should return an empty modbusFrame", function () {
            let buffer = Buffer.allocUnsafe(20);
            let frame = new modbusFrame(buffer);
            assert.strictEqual(frame.transaction, 0);
            assert.strictEqual(frame.protocol, 0);
            assert.strictEqual(frame.byteLength, 14);
            assert.strictEqual(frame.device, 1);
            assert.strictEqual(frame.func, 0);
            assert.strictEqual(frame.buffer, buffer);

        });
    });
});