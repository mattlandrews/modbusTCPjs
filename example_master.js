const modbusMaster = require("./dist/modbusMaster.js");

let master = new modbusMaster();

// Setup connection event handler

master.on("connect", function () {

    // create a new query
    let query = master.modbusQuery(1, "readHoldingRegisters", 0, 1, null);
    master.sendQuery(query);
});

master.on("reply", function (err, reply) {
    if (err) {
        // Write error message to console
        console.error(err);
    }
    else {
        let query = master.modbusQuery(1, "readHoldingRegisters", 0, 1, null);
        setTimeout(master.sendQuery.bind(this, query), 1000);
    }
});

// Connect to a local modbus slave on port 502 (standard modbusTCP port)
master.connect("127.0.0.1", 502, 500);