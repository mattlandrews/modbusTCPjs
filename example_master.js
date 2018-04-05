const { modbusMaster, readHoldingRegistersQuery } = require("./src/modbusTCPjs.js");

let master = new modbusMaster();

// Setup connection event handler

function sendQuery () {
    let query = new readHoldingRegistersQuery();
    query.setDevice(1);
    query.setRegister(0);
    query.setRegisterCount(1);
    master.sendQuery(query);
}

master.on("connect", sendQuery);

master.on("reply", function (err, data, reply) {
    if (err) {
        // Write error message to console
        console.error(err);
    }
    else {
        setTimeout(sendQuery, 10);
    }
});

// Connect to a local modbus slave on port 502 (standard modbusTCP port)
master.connect("127.0.0.1", 502, 500);