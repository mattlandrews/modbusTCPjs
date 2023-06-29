"use strict";

const modbusException = require("./modbusException");

module.exports = class readHoldingRegistersException extends modbusException {

    constructor (transaction, device, exceptionCode) {
        super(transaction, device, 131, exceptionCode);
    }

}