"use strict";

const modbusException = require("./modbusException");

module.exports = class writeHoldingRegistersException extends modbusException {

    constructor (transaction, device, exceptionCode) {
        super(transaction, device, 144, exceptionCode);
    }

}