"use strict";

const net = require("net");
const ModbusQuery = require("./modbusquery.js");

module.exports = function ModbusTcpClient () {

    let socket = new net.Socket();
    let state = "disconnected";
    let connectCallback = null;
    let dataCallback = null;
    

    function socketConnect () {
        state = "connected";
        if (typeof connectCallback === "function") { connectCallback(); }
    }

    function socketData (data) {
        if (typeof dataCallback === "function") { dataCallback(data); }
    }

    socket.on("connect", socketConnect);
    socket.on("data", socketData);

    this.connect = function (ip, port, callback)  {
        if (state === "disconnected") {
            connectCallback = callback;
            socket.connect(port, ip);
        }
    };

    this.sendQuery = function (q, callback) {
        if (typeof callback === "function") { dataCallback = callback; }
        let query = new ModbusQuery(q);
        socket.write(query.getBuffer());
    }

    function sendQuery () {
        if (q >= queries.length) { q = 0; }
        let query = queries[q];
        socket.write(query.buffer);
    }

    function procData () {
        debugger;
    }

    return this;
}