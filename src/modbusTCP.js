"use strict";

const mbSocket = require("./mbSocket.js");
const readHoldingRegistersQuery = require("./readHoldingRegistersQuery.js");

module.exports = function modbusTCP (type) {

    let socket;
    if (type === "test") {
        socket = new (require("../lib/testSocket.js"))();
    }
    else {
        socket = new mbSocket();
    }

    this.transaction = 0;
    this.ip = "127.0.0.1";
    this.port = 502;
    this.reconnect = true;
    this.connected = false;
    this.connectCallback = null;
    this.dataCallback = null;
    this.pollrate = 1000;
    this.polling = false;
    this.querySent = null;

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
        if (_this.reconnect) { setTimeout(() => { socket.connect(_this.port, _this.ip); }, 20); }
    });

    socket.on("connect", () => {
        _this.connectCallback();
    });

    socket.on("data", (data) => {
        let d = _this.query.parseReply(data);
        if (d != null) { _this.dataCallback(null, d); }
        else { _this.dataCallback(new Error("Error")); }
        if (_this.polling) {
            let dt = (new Date().valueOf() - _this.querySent);
            if (dt < _this.pollrate) {
                setTimeout(() => {
                    _this.query.setTransaction(_this.transaction);
                    _this.transaction++;
                    _this.querySent = new Date().valueOf();
                    socket.write(_this.query.getBuffer());
                }, (_this.pollrate - dt))
            }
            else {
                _this.query.setTransaction(_this.transaction);
                _this.transaction++;
                _this.querySent = new Date().valueOf();
                socket.write(_this.query.getBuffer());
            }
        }
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
        _this.polling = false;
        _this.dataCallback = callback;
        _this.query.setTransaction(_this.transaction);
        _this.transaction++;
        socket.write(_this.query.getBuffer());
    }

    this.pollQuery = function (pollrate, callback) {
        _this.polling = true;
        _this.pollrate = pollrate;
        _this.dataCallback = callback;
        _this.query.setTransaction(_this.transaction);
        _this.transaction++;
        _this.querySent = new Date().valueOf();
        socket.write(_this.query.getBuffer());
    }

    this.stopPolling = function () {
        _this.polling = false;
    }

    this.readHoldingRegistersQuery = readHoldingRegistersQuery;
}