"use strict";

const modbusFrame = require("./modbusFrame.js");
const modbusSlave = require("./modbusSlave.js");
const modbusMaster = require("./modbusMaster.js");
const readHoldingRegistersQuery = require("./readHoldingRegistersQuery.js");
const readHoldingRegistersReply = require("./readHoldingRegistersReply.js");
const writeHoldingRegisterQuery = require("./writeHoldingRegisterQuery.js");
const writeHoldingRegisterReply = require("./writeHoldingRegisterReply.js");

module.exports = {
    modbusFrame,
    modbusMaster,
    modbusSlave,
    readHoldingRegistersQuery,
    readHoldingRegistersReply,
    writeHoldingRegisterQuery,
    writeHoldingRegisterReply
};