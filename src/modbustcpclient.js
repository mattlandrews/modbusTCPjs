"use strict";

const net = require("net");

module.exports = function ModbusTcpClient () {

    let socket = new net.Socket();
    let state = "disconnected";
    let query = null;

    function socketConnect () {
        state = "connected";
    }

    function socketData (data) {
        debugger;
    }

    socket.on("connect", socketConnect);
    socket.on("data", socketData);

    this.connect = function (ip, port)  {
        if (state === "disconnected") {
            socket.connect(port, ip);
        }
    };

    this.sendQuery = function (q) {
        query = new ModbusQuery(q);
        socket.write(query.getBuffer());
    }

    function connected () {
        sendQuery();
    }

    function sendQuery () {
        if (q >= queries.length) { q = 0; }
        let query = queries[q];
        socket.write(query.buffer);
    }

    function procData () {
        debugger;
    }

}