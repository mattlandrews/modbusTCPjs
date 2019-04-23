"use strict";

const ModbusTCP = require("./src/ModbusTCP.js");

let mbtcp = new ModbusTCP();

// Open a socket, send a single query, then close the socket.
mbtcp.connect("127.0.0.1", 502, (err) => {
    if (err != null) { console.error(err); }
    else {
        mbtcp.query = new mbtcp.readHoldingRegistersQuery();
        mbtcp.query.setRegister(100);
        mbtcp.query.setLength(100);
        mbtcp.sendQuery((err, data) => {
            if (err != null) { console.error(err); }
            else {
                console.log(data);
                //mbtcp.close();
            }
        });
    }
});