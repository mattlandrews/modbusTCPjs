"use strict";
const ModbusTCP = require("./src/ModbusTCP.js");

let mbtcp = new ModbusTCP();

// Open a socket, send a single query, then close the socket.
mbtcp.connect("192.168.150.71", 502, (err) => {
    if (err != null) { console.error(err); }
    else {
        mbtcp.query = new mbtcp.readHoldingRegistersQuery();
        mbtcp.query.setRegister(2999);
        mbtcp.query.setLength(120);
        mbtcp.pollQuery(250, (err, data) => {
            if (err != null) { console.error(err); }
            else {
                console.log(data);
                //mbtcp.close();
            }
        });
    }
});