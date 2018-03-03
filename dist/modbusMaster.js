const modbusQuery = require("./modbusQuery.js");
const modbusReply = require("./modbusReply.js");

module.exports = function modbusMaster () {

    let net = require("net");
    let socket = new net.Socket();
    let outstandingQueries = [];
    let transactionID = 0;
    let status = 0;
    const knownExceptions = {
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

    this.modbusQuery = modbusQuery;

    this.connect = function (ip, port, callback) {

        var self = this;

        socket.on("connect", function () {
            self.isConnected = true;
        });
        socket.on("data", function (buffer) {
            status = 0;
            let reply = new modbusReply(buffer);
            let query = outstandingQueries.find(function(d){ return (d.transactionID == reply.transactionID); });
            if (query != null) {
                if (reply.exception != null) {
                    exceptionString = knownExceptions[reply.exception];
                    if (exceptionString == null) { exceptionString = "Unknown Exception"; }
                    query.callback(new Error(exceptionString));
                }
                else { query.callback(null, reply.data); }
            }
        });
        socket.on("close", function () {
            self.isConnected = false;
            socket.connect(port, ip);
        });
        socket.on("error", function (err) {
            callback(err);
        });

        socket.connect(port, ip);
        status = 0;
        callback();
    }

    this.sendQuery = function (query, callback) {
        if (query.func == null) {
            callback(new Error("Function not recognized, not sent"), null);
            return;
        }
        if (status == 1) return;
        status = 1;
        outstandingQueries.push({ query: query, transactionID: transactionID, callback: callback });
        socket.write(query.buffer);
        transactionID++;
        if (transactionID > 65535) { transactionID = 0; }
    }

    this.disconnect = function () {
        socket.end();
        this.isConnected = false;
    }

    this.isConnected = false;

    return this;

}