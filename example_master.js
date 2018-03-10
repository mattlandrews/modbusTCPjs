const modbusMaster = require("./dist/modbusMaster.js");

let master = new modbusMaster();

// Connect to a local modbus slave on port 502 (standard modbusTCP port)
let ipAddr = "127.0.0.1";
let portNum = 502;

master.on("error", function(err){
    console.error(err);
});
master.on("connect", function(){
    let query = new master.modbusQuery(1, "readHoldingRegisters", 0, 10, null);
    master.sendQuery(query);
});

master.connect(ipAddr, portNum, 500);