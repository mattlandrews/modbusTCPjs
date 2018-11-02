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

    this.transaction = 0;

    socket.on("close", function () {
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
        let transaction = this.transaction;
        this.transaction++;
        return new Promise(function (resolve, reject) {
            if (query != null) {
                reject(new Error("Query already outstanding."));
                return;
            }
            query = new _readHoldingRegisters();
            query.setTransaction(transaction);
            if (register != null) { query.setRegister(register); }
            if (length != null) { query.setLength(length); }
            dataCallback = function (data) {
                let d = query.parseReply(data);
                if (d != null) { resolve(d); }
                else {
                    reject(new Error("Error"));
                }
                query = null;
            }
            socket.write(query.getBuffer());
        });
    }

    this.writeHoldingRegisters = function (register, data, callback) {
        let transaction = this.transaction;
        this.transaction++;
        return new Promise(function (resolve, reject) {
            if (query != null) {
                reject(new Error("Query already outstanding."));
                return;
            }
            query = new _writeHoldingRegisters();
            query.setTransaction(transaction);
            if (register != null) { query.setRegister(register); }
            if (Array.isArray(data) == false) { reject(new Error("Query requires data.")); return; }
            else { query.setData(data); }
            dataCallback = function (data) {
                let d = query.parseReply(data);
                if (d.length != null && d.length == 0) {
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

