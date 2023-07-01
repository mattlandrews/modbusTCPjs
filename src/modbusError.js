"use strict";

module.exports = class ModbusError extends Error {

    constructor (message) {
        super(message);
        this.name = "ModbusError";
        this.time = new Date();
    }

}