"use strict";
const ModbusTCP = require("./src/modbustcp.js");

let client = new ModbusTCP().Client();

let queries = [
    {
        type: "readHoldingRegisters",
        address: 0,
        length: 1
    },
    {
        type: "writeHoldingRegisters",
        address: 1,
        length: 2,
        data: [1,2]
    }
];
let q = 0;

client.connect("127.0.0.1", 502, connected);
let query = queries[0];

function connected () {
    client.sendQuery(query, reply);
}

function reply (data) {
    console.log(data);
    q++;
    q = (q < (queries.length - 1)) ? q+1 : 0;
    query = queries[q];
    setTimeout(function(){
        client.sendQuery(query, reply);
    }, 20);
}