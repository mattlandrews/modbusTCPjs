"use strict";

const ModbusTcpClient = require("./modbustcpclient.js");
const ModbusTcpServer = require("./modbustcpserver.js");

module.exports = function ModbusTCP () {

    this.Client = ModbusTcpClient;
    this.Server = ModbusTcpServer;
    return this;
}