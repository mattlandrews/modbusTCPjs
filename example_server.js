"use strict";
const ModbusTCP = require("./src/modbustcp.js");

let server = new ModbusTCP().Server();

server.start("127.0.0.1", 502);