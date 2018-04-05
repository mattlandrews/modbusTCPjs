const modbusFrame = require("./modbusFrame.js");
const modbusSlave = require("./modbusSlave.js");
const modbusMaster = require("./modbusMaster.js");
const readHoldingRegistersQuery = require("./readHoldingRegistersQuery.js");
const readHoldingRegistersReply = require("./readHoldingRegistersReply.js");

module.exports = {
    modbusFrame,
    modbusMaster,
    modbusSlave,
    readHoldingRegistersQuery,
    readHoldingRegistersReply
};