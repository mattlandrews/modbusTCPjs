const modbus = require("./modbus.js");
const chalk = require("chalk");

module.exports = modbusTCP;

function modbusTCP () {

    var net = require("net");
    var socket = new net.Socket();
    var outstandingQueries = [];
    var transactionID = 0;

    this.modbusQuery = modbus.modbusQuery;

    this.connect = function (ip, port, callback) {

        socket.on("data", function (buffer) {
            let reply = new modbus.modbusReply(buffer);
            let query = outstandingQueries.find(function(d){ return (d.transactionID == reply.transactionID); });
            if (query != null) { query.callback(null, reply.data); }
        });
        socket.on("close", function () {
            socket.connect(port, ip);
        });
        socket.on("error", function (err) {
            callback(err);
        });

        socket.connect(port, ip);

        callback();
    }

    this.sendQuery = function (query, callback) {
        outstandingQueries.push({ query: query, transactionID: transactionID, callback: callback });
        query.setMBAP(transactionID);
        socket.write(Buffer.from(query.queryByteArray));
        transactionID++;
        if (transactionID > 65535) { transactionID = 0; }
    }

    return this;

}