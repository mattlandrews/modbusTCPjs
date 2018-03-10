const modbusQuery = require("./modbusQuery.js");
const modbusReply = require("./modbusReply.js");

module.exports = function modbusSlave () {

    let net = require("net");
    let server = new net.Server();
    let _options = {
        "ip": "127.0.0.1",
        "port": 502
    };
    let status = 0;

    const modbusExceptions = {
        1: "Illegal Function",
        2: "Illegal Data Address",
        3: "Illegal Data Value",
        4: "Slave Device Failure",
        5: "Acknowledge",
        6: "Slave Device Busy",
        7: "Negative Acknowledge",
        8: "Memory Parity Error",
        10: "Gateway Path Unavailable",
        11: "Gateway Target Device Failed to Respond"
    };

    const self = this;

    let onData = function (buffer) {
        debugger;
    }

    server.on("connection", function (socket) {
        socket.on("data", onData);
    });

    this.isConnected = false;

    this.connect = function (options, callback) {

        if (this.isConnected) { return; }
        if (typeof options["ip"] !== "string") { _options.ip = options.ip; }
        if (typeof options["port"] !== "number") { _options.port = options.port }
        server.listen(_options.port, _options.ip, null, callback);
    }

    this.disconnect = function () {
        this.isConnected = false;
        server.close();
    }

    return this;

}