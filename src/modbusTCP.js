"use strict";

const net = require("net");
//const readHoldingRegistersQuery = require("./readHoldingRegistersQuery.js");

module.exports = function modbusTCP () {

    let socket = new net.Socket();
    let errorHandler = [];
    let connectHandler = [];
    let closeHandler = [];
    
    this.transaction = 0;
    this.ip = "127.0.0.1";
    this.port = 502;

    socket.on("error", function (err) {
        errorHandler.forEach(function (d) { d(err); });
    });

    socket.on("connect", function () {
        connectHandler.forEach(function (d) { d(); });
    });

    socket.on("close", function () {
        closeHandler.forEach(function (d) { d(); });
    });

    this.on = function (event, func) {
        if (event === "error") { errorHandler.push(func); }
        if (event === "connect") { connectHandler.push(func); }
        if (event === "close") { closeHandler.push(func); }
    };

    this.connect = function (ip, port) {
        if ((typeof ip === "string") && (ip.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/) !== null)) {
            this.ip = ip;
        }
        if ((isNaN(port) == false) && (port > 0) && (port < 65536)) {
            this.port = port;
        }
        socket.connect(this.ip, this.port);
    };
}

/*
module.exports = function ModbusTCP(ip, port) {
    
    let socket = new net.Socket();
    let connected = false;
    let query = null;
    let dataCallback = null;
    
    

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

*/