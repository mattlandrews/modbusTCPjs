const { modbusSlave } = require("./dist/modbusTCPjs.js");

let slave = new modbusSlave();

// Connect to a local modbus slave on port 502 (standard modbusTCP port)
let ipAddr = "127.0.0.1";
let portNum = 502;

slave.on("listen", (err) => {
    if (err) { console.error(err); return; }
    console.log("Modbus slave is listening to '" + ipAddr + ":" + portNum + "'.");
});
slave.on("connect", () => { console.log("Modbus master has connected."); });
slave.on("disconnect", () => { console.log("Modbus master has disconnected."); });
slave.on("query", () => { console.log("Modbus master has send a query."); });
slave.listen("127.0.0.1", 502);
