"use strict";

class ModbusError extends Error {

    constructor (message) {
        super(message);
        this.name = "ModbusError";
        this.time = new Date();
    }

}

class ModbusTransactionError extends Error {
    
    constructor (message) {
        super(message);
        this.name = "ModbusTransactionError";
        this.time = new Date();
    }

}

class ModbusQueryLengthError extends Error {
    
    constructor (message) {
        super(message);
        this.name = "ModbusQueryLengthError";
        this.time = new Date();
    }

}

class ModbusFunctionError extends Error {

    constructor (message) {
        super(message);
        this.name = "ModbusFunctionError";
        this.time = new Date();
    }

}

class ModbusDeviceError extends Error {
    
    constructor (message) {
        super(message);
        this.name = "ModbusDeviceError";
        this.time = new Date();
    }

}

class ModbusReadAddressError extends Error {
    
    constructor (message) {
        super(message);
        this.name = "ModbusReadAddressError";
        this.time = new Date();
    }

}

class ModbusReadLengthError extends Error {
    
    constructor (message) {
        super(message);
        this.name = "ModbusReadAddressError";
        this.time = new Date();
    }

}

class ModbusWriteAddressError extends Error {
    
    constructor (message) {
        super(message);
        this.name = "ModbusWriteAddressError";
        this.time = new Date();
    }

}

class ModbusWriteLengthError extends Error {

    constructor (message) {
        super(message);
        this.name = "ModbusWriteLengthError";
        this.time = new Date();
    }
}

module.exports = { ModbusError, ModbusTransactionError, ModbusQueryLengthError, ModbusDeviceError, ModbusFunctionError, ModbusReadAddressError, ModbusReadLengthError, ModbusWriteAddressError, ModbusWriteLengthError };