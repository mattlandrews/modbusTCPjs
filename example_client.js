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
    setTimeout(function () {
        query.address = Math.round(Math.random() * 65000);
        query.length = Math.round(Math.random() * 30);
        client.sendQuery(query, reply);
    }, 33);
}