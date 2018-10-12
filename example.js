const ModbusTCP = require("./src/ModbusTCP.js");

let mbtcp = new ModbusTCP();
let errorCount = 0;

mbtcp.readHoldingRegisters()
    .catch(function(err){
        console.log(err);
    })
    .then(function(data){
        console.log(data);
    });