modbusTCPjs
===========

ModbusTCP.js is a simple light-weight modbusTCP client for javascript. It is still in the early stages of development (work-in-progress), and should not be considered production-ready.

### Download
Download all required files from the 'dist' folder.

### How To Use
Below is an example of how to connect to a single modbus slave, issue a query, then disconnect.
'''javascript
const modbusTCP = require("./modbustcp.js");

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

        // Halt process
        process.exit(0);
    });

});