"use strict";
const ModbusTCP = require("./src/modbustcp.js");

let client = new ModbusTCP().Client();

let query = {
    type: "readHoldingRegisters",
    address: 0,
    length: 1
};

client.connect("127.0.0.1", 502, connected);

function connected () {
    client.sendQuery(query, reply);
}

function reply (data) {
    console.log(data);
    setTimeout(function () { client.sendQuery(query, reply); }, 33);
}