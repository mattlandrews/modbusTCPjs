const { modbusMaster, modbusQuery } = require("./dist/modbusTCPjs.js");

let master = new modbusMaster();

// Setup connection event handler

master.on("connect", function () {

    // create a new query
    let query = new modbusQuery();
    query.setDevice(1);
    query.readHoldingRegisters(0,1);
    master.sendQuery(query);
});

master.on("reply", function (err, reply) {
    if (err) {
        // Write error message to console
        console.error(err);
    }
    else {
        let query = new modbusQuery();
        query.setDevice(1);
        query.readHoldingRegisters(0,1);
        setTimeout(function () {
            master.sendQuery(query)
        }, 1000);
    }
});

// Connect to a local modbus slave on port 502 (standard modbusTCP port)
master.connect("127.0.0.1", 502, 500);