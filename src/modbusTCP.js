"use strict";

const _readHoldingRegisters = require("./readHoldingRegisters.js");

module.exports = function ModbusTCP() {

    this.readHoldingRegisters = function (register, length, callback) {
        let query = new _readHoldingRegisters();
        if (register != null) { query.setRegister(register); }
        if (length != null) { query.setLength(length); }

        return new Promise(function (resolve, reject) {
            
        });
    }

};

