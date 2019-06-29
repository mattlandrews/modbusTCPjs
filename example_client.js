"use strict";
const ModbusTCP = require("./src/modbustcp.js");

let client = new ModbusTCP().Client();

queries = [
    {
        type: "readHoldingRegisters",
        address: 0,
        length: 1,
        callback: rhrReply
    },
    {
        type: "writeHoldingRegisters",
        address: 1,
        length: 2,
        data: [1,2],
        callback: whrReply
    }
];

client.connect("127.0.0.1", 502, connected);

function connected () {
    client.sendQuery({
        type: "readHoldingRegisters",
        address: 0,
        length: 1
    },
    reply);
}

function reply (data) {
    console.log(data);
    client.disconnect();
}