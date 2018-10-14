"use strict";

const _readHoldingRegisters = require("./readHoldingRegisters.js");
const _writeHoldingRegisters = require("./writeHoldingRegisters.js");
const net = require("net");

module.exports = function ModbusTCP(ip, port) {
    
    let socket = new net.Socket();
    let connected = false;
    let query = null;
    let dataCallback = null;
    
    if ((typeof ip !== "string") || (ip.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/) == null)) {
        throw new Error("ip of ${ip} is invalid.");
    }
    this.ip = ip;

    this.port = 502;
    if ((isNaN(port) == false) && (port > 0) && (port < 65536)) {
        this.port = port;
    }

    socket.on("close", function () {
        console.log("Connection closed... re-opening.");
        socket.connect(this.port, this.ip);
    }.bind(this));
    socket.on("data", function (data) {
        if (dataCallback != null) {
            dataCallback(data);
        }
    });
    socket.on("error", function (err) {
        console.log(err);
    });

    socket.connect(this.port, this.ip);

    this.readHoldingRegisters = function (register, length, callback) {
        return new Promise(function (resolve, reject) {
            if (query != null) {
                reject(new Error("Query already outstanding."));
                return;
            }
            query = new _readHoldingRegisters();
            if (register != null) { query.setRegister(register); }
            if (length != null) { query.setLength(length); }
            dataCallback = function (data) {
                let d = query.parseReply(data);
                if (d != null) { resolve(d); }
                else { reject(); }
                query = null;
            }
            socket.write(query.getBuffer());
        });
    }

    this.writeHoldingRegisters = function (register, data, callback) {
        return new Promise(function (resolve, reject) {
            if (query != null) {
                reject(new Error("Query already outstanding."));
                return;
            }
            query = new _writeHoldingRegisters();
            if (register != null) { query.setRegister(register); }
            if (Array.isArray(data) == false) { reject(new Error("Query requires data.")); return; }
            else { query.setData(data); }
            dataCallback = function (data) {
                if (query.parseReply(data) == []) {
                    resolve();
                }
                else {
                    reject();
                }
                query = null;
            }
            socket.write(query.getBuffer());
        });
    }

};

