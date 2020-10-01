"use strict";

const net = require("net");
const modbusQuery = require("./modbusQuery.js");
const modbusReply = require("./modbusReply.js");

module.exports = function mbtcp_client () {

    let socket = new net.Socket();
    let ip = '127.0.0.1';
    let port = 502;
    let reconnect = false;
    let connectedCallback = null;
    let dataCallback = null;
    let transaction = 0;

    socket.on("error", (err) => {
        switch (err.errno) {
            case -104:
            case -111:
            case -113:
                if (connectedCallback != null) { connectedCallback(err); }
                if (reconnect) { this.connect({}, connectedCallback ); }
                break;
            default:
                debugger;
        }
    });

    socket.on("connect", () => {
        if (connectedCallback != null) { connectedCallback (); }
    });

    socket.on("data", (buffer) => {
        let reply = new modbusReply();
        let cb;
        try {
            reply.replyFromBuffer(buffer)
        }
        catch (err) {
            cb = dataCallback;
            dataCallback = null;
            cb(err, null);
            return;
        }
        if (dataCallback !== null) {
            cb = dataCallback;
            dataCallback = null;
            cb(null, reply.data);
        }
    });

    this.connect = function (opts, callback) {
        if (typeof opts !== 'object') { opts = {}; }
        if (opts.ip != null) { ip = opts.ip; }
        if (opts.port != null) { port = opts.port; }
        if (opts.reconnect != null) { reconnect = opts.reconnect; }
        if (typeof callback === "function") { connectedCallback = callback; }
        socket.connect(port, ip);
    }

    this.disconnect = function (callback) {
        dataCallback = null;
        socket.end(callback);
    }

    this.readHoldingRegisters = function (device, address, length, callback) {
        if (dataCallback === null) {
            if (typeof callback === "function") { dataCallback = callback; }
            let query = new modbusQuery();
            query.transaction = transaction;
            transaction++;
            if (transaction > 65535) { transaction = 0; }
            query.device = device;
            query.func = 3;
            query.address = address;
            query.regcount = length;
            try {
                let buffer = query.queryToBuffer();
            }
            catch (err) {
                debugger;
            }
            socket.write(query.queryToBuffer());
        }
    }

    this.writeHoldingRegisters = function (device, address, data, callback) {
        if (dataCallback === null) {
            if (typeof callback === "function") { dataCallback = callback; }
            let query = new modbusQuery();
            query.transaction = transaction;
            transaction++;
            if (transaction > 65535) { transaction = 0; }
            query.device = device;
            query.func = 16;
            query.address = address;
            query.data = data;
            query.queryLength = (7 + (data.length * 2));
            socket.write(query.queryToBuffer());
        }
    }

    return this;

}