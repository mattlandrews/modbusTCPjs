"use strict";

const ModbusTcpServer = require("./modbustcpserver.js");

module.exports = function ModbusTCP () {

    this.Server = ModbusTcpServer;

    return this;
}