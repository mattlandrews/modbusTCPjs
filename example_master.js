const modbusMaster = require("./dist/modbusMaster.js");

let master = new modbusMaster();

// Setup connection event handler

master.on("connect", function () {

    // create a new query
    let query = master.modbusQuery(1, "readHoldingRegisters", 0, 1, null);

    // send query;
    master.sendQuery(query);

});

master.on("reply", function (err, reply) {

    if (err) {
        // Write error message to console
        console.error(err);
    }
    else {
        // Write value array to console
        console.log(reply);
    }

    // Disconnect from slave
    master.disconnect();

    // Halt process
    process.exit(0);

});

// Connect to a local modbus slave on port 502 (standard modbusTCP port)
master.connect("127.0.0.1", 502, 500);