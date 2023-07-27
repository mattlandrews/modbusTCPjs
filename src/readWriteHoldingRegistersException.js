"use strict";

const modbusException = require("./modbusException");

module.exports = class readWriteHoldingRegistersException extends modbusException {

    constructor (transaction, device, exceptionCode) {
        super(transaction, device, 151, exceptionCode);
    }

}