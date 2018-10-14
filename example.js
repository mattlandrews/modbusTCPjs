const ModbusTCP = require("./src/ModbusTCP.js");

let mbtcp = new ModbusTCP("127.0.0.1");
let errorCount = 0;

mbtcp.readHoldingRegisters(0, 3)
    .catch(function (err) {
        console.log(err);
    })
    .then(function (data) {
        console.log(data);
        mbtcp.writeHoldingRegisters(0, [1])
            .catch(function (err) {
                console.log(err);
            })
            .then(function (data) {
                console.log(data);
            });
    });