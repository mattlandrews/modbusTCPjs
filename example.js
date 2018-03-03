const modbusMaster = require("./dist/modbusMaster.js");

let master = new modbusMaster();

// Connect to a local modbus slave on port 502 (standard modbusTCP port)
master.connect("127.0.0.1", 502, function () {

    // create a new query
    let query = new master.modbusQuery(1, "readHoldingRegisters", 0, 1, null);

    // send query;
    master.sendQuery(query, function(err, data) {

        if (err) {
            // Write error message to console
            console.error(err);
        }
        else {
            // Write value array to console
            console.log(data);
        }

        // Disconnect from slave
        master.disconnect();

        process.exit(0);
    });

});