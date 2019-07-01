"use strict";

const ModbusTcpClient = require("./modbustcpclient.js");
const ModbusTcpServer = require("./modbustcpserver.js");
const ModbusQuery = require("./modbusquery.js");

module.exports = function ModbusTCP () {

    this.Client = ModbusTcpClient;
    this.Server = ModbusTcpServer;
    this.Query = ModbusQuery;
    return this;
}