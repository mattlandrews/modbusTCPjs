const modbusTCP = require("./dist/modbustcp.js");

let slave = new modbusTCP();

// Connect to a local modbus slave on port 502 (standard modbusTCP port)
slave.connect("127.0.0.1", 502, function () {

    // create a new query
    let query = slave.modbusQuery(1, "readHoldingRegisters", 0, 1, null);

    // send query;
    slave.sendQuery(query, function(err, data) {

        if (err) {
            // Write error message to console
            console.error(err);
        }
        else {
            // Write value array to console
            console.log(data);
        }

        // Disconnect from slave
        slave.disconnect();

        process.exit(0);
    });

});