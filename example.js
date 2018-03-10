const modbusMaster = require("./dist/modbusMaster.js");

let master = new modbusMaster();

// Connect to a local modbus slave on port 502 (standard modbusTCP port)
let ipAddr = "127.0.0.1";
let portNum = 502;

/*master.on("connect", (err) => {
    if (err) { console.error(err); return; }
    console.log("Modbus master has connected to '" + ipAddr + ":" + portNum + "'.");
});

master.on("reply", (err, reply, query) => {
    if (err) { console.error(err); }
    else { process.stdout.write("[" + reply + "]"); }
});*/

master.connect("127.0.0.1", 502, 500);

let query = new master.modbusQuery(1, "readHoldingRegisters", 100, 1, null);

setInterval(function () { master.sendQuery(query); }, 100);
