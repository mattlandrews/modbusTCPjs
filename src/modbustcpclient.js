"use strict";

const net = require("net");
const ModbusQuery = require("./modbusquery.js");
const ModbusReply = require("./modbusreply.js");

module.exports = function ModbusTcpClient () {

    let socket = new net.Socket();
    let state = "disconnected";
    let connectCallback = null;
    let dataCallback = null;
    let lastQuery = null;
    let ip = null;
    let port = null;

    function socketConnect () {
        state = "connected";
        if (typeof connectCallback === "function") { connectCallback(); }
    }

    function socketData (data) {
        if (state === "sent") {
            state = "connected";
            let reply = new ModbusReply(data);
            if (reply.transaction != lastQuery.transaction) { throw new Error("Modbus Device Returned Invalid Transaction ID."); }
            if (reply.protocol != 0) { throw new Error("Modbus Device Returned Invalid Protocol."); }
            if (reply.func != lastQuery.func) { throw new Error("Modbus Device Returned Invalid Function."); }
            if (reply.length != lastQuery.length) { throw new Error("Modbus Device Returned Invalid Data Length."); }
            if (typeof dataCallback === "function") { dataCallback(reply.data); }
        }
    }

    socket.on("connect", socketConnect);
    socket.on("data", socketData);
    socket.on("error", function (error) {
        if (error.code === "ECONNREFUSED") {
            console.error(error);
            socket.connect(port, ip);
        }
        else if (error.code === "EPIPE") {
            console.error(error);
            state = "disconnected";
            socket.destroy();
            socket.connect(port, ip);
        }
        else {
            console.error(error);
        }
    });

    this.connect = function (_ip, _port, callback)  {
        if (state === "disconnected") {
            ip = _ip;
            port = _port;
            connectCallback = callback;
            socket.connect(port, ip);
        }
    };

    this.sendQuery = function (q, callback) {
        if (state === "connected") {
            state = "sent";
            if (typeof callback === "function") { dataCallback = callback; }
            lastQuery = new ModbusQuery(q);
            socket.write(lastQuery.getBuffer());
        }
    }

    return this;
}