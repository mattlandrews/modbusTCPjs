"use strict";

const net = require("net");
const readHoldingRegistersQuery = require("./readHoldingRegistersQuery.js");

module.exports = function modbusTCP () {

    let socket = new net.Socket();

    this.transaction = 0;
    this.ip = "127.0.0.1";
    this.port = 502;
    this.reconnect = true;
    this.connected = false;
    this.connectCallback = null;
    this.dataCallback = null;

    this.query = new readHoldingRegistersQuery();

    let _this = this;

    socket.on("error", (err) => {
        if (!_this.connected) {
            _this.connectCallback(err);
        }
        else {
            _this.dataCallback(err);
        }
    });

    socket.on("close", () => {
        _this.connected = false;
        if (_this.dataCallback != null) {
            socket.off("data", _this.dataCallback);
            _this.dataCallback = null;
        }
        if (_this.reconnect) { setTimeout(() => { socket.connect(_this.port, _this.ip); }, 1000); }
    });

    socket.on("connect", () => {
        _this.connectCallback();
    });

    socket.on("data", (data) => {
        let d = _this.query.parseReply(data);
        if (d != null) { _this.dataCallback(null, d); }
        else { _this.dataCallback(new Error("Error")); }      
    });

    this.connect = function (ip, port, callback) {

        if ((typeof ip === "string") && (ip.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/) !== null)) {
            _this.ip = ip;
        }
        if ((isNaN(port) == false) && (port > 0) && (port < 65536)) {
            _this.port = port;
        }
        if (typeof callback === "function") {
            _this.connectCallback = callback;
        }
        _this.reconnect = true;
        socket.connect(_this.port, _this.ip);
    
    }

    this.close = function () {
        _this.dataCallback = null;
        _this.transaction = 0;
        _this.connected = false;
        _this.reconnect = false;
        socket.end();
    }

    this.sendQuery = function (callback) {
        _this.dataCallback = callback;
        _this.query.setTransaction(_this.transaction);
        _this.transaction++;

        socket.write(_this.query.getBuffer());
    }

    this.readHoldingRegistersQuery = readHoldingRegistersQuery;
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