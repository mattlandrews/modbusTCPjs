"use strict";

const modbusFrame = require("./modbusFrame.js");
const readHoldingRegistersQuery = require("./readHoldingRegistersQuery.js");
const readHoldingRegistersReply = require("./readHoldingRegistersReply.js");
const writeHoldingRegisterQuery = require("./writeHoldingRegisterQuery.js");
const writeHoldingRegisterReply = require("./writeHoldingRegisterReply.js");
let inet = require("./inet.js");

module.exports = function modbusSlave() {

    let socket = new inet.Server();
    let eventHandlers = {
        "listen": [],
        "connect": [],
        "query": [],
        "reply": [],
        "disconnect": [],
        "close": [],
        "error": []
    };

    this.on = function (eventName, handler) {
        if (typeof eventName != "string") { return; }
        if (typeof handler != "function") { return; }
        if (typeof eventHandlers[eventName] != null) {
            eventHandlers[eventName].push(handler);
        }
    };

    this.getHoldingRegisterValue = function (register) {
        return register;
    };

    this.listen = function (ip, port, delay) {

        var _ip = null;
        var _port = 502;

        if (ip != null) {
            if ((typeof ip != "string")
                || (ip.split(".").filter(function (d) { return ((Number(d) >= 0) && (Number(d) <= 255)); }).length != 4)) {
                eventHandlers.error.forEach(function (d) { d(new Error("supplied ip of '" + ip + "' is not a valid ip address.")); });
                return;
            }
            _ip = ip;
        }

        if (port != null) {
            if ((isNaN(port))
                || ((port < 0) || (port > 65535))) {
                eventHandlers.error.forEach(function (d) { d(new Error("supplied port of '" + port + "' is not a valid port number.")); });
                return;
            }
            _port = port;
        }

        if (delay != null) {
            if ((isNaN(delay))
                || ((delay < 0) || (delay > 120000))) {
                eventHandlers.error.forEach(function (d) { d(new Error("supplied delay of '" + delay + "' is not a valid delay number.")); });
                return;
            }
        }

        function socketListening() {
            this.isListening = true;
            eventHandlers.listen.forEach(function (f) { f(); });
        }

        function socketConnection(_socket) {
            _socket.on("data", socketData.bind(this, _socket));
            _socket.on("error", socketError);
            _socket.on("close", socketDisconnect.bind(this));
            this.isConnected = true;
            eventHandlers.connect.forEach(function (f) { f(); });
        }

        function socketError(err) {
            if (err.code != "ECONNRESET") { eventHandlers.error.forEach(function (f) { f(err); }); }
        }

        function socketDisconnect() {
            this.isConnected = false;
            eventHandlers.disconnect.forEach(function (f) { f(); });
        }

        function socketData(socket, buffer) {
            let query = new modbusFrame();
            query.mapFromBuffer(buffer);
            let func = query.getFunction();
            if (func == 3) {
                query = new readHoldingRegistersQuery();
                query.mapFromBuffer(buffer);
                eventHandlers.query.forEach(function (f) { f(query); });
                let reply = new readHoldingRegistersReply();
                reply.setTransaction(query.getTransaction());
                reply.setDevice(query.getDevice());
                let values = []
                for (let i = 0; i < query.getRegisterCount(); i++) {
                    values.push(this.getHoldingRegisterValue(query.getRegister() + i));
                }
                reply.setValues(values);
                setTimeout(function () {
                    if (this.isConnected) {
                        eventHandlers.reply.forEach(function (f) { f(null, reply.getValues(), reply); });
                        socket.write(reply.getBuffer());
                    }
                }.bind(this), delay);
            }
            else if (func == 6) {
                query = new writeHoldingRegisterQuery();
                query.mapFromBuffer(buffer);
                eventHandlers.query.forEach(function (f) { f(query); });
                let reply = new writeHoldingRegisterReply();
                reply.setTransaction(query.getTransaction());
                reply.setDevice(query.getDevice());
                reply.setRegister(query.getRegister());
                reply.setValue(query.getValue());
                setTimeout(function () {
                    if (this.isConnected) {
                        eventHandlers.reply.forEach(function (f) { f(null, reply.getValue(), reply); });
                        socket.write(reply.getBuffer());
                    }
                }.bind(this), delay);
            }
        }

        socket.on("listening", socketListening.bind(this));
        socket.on("connection", socketConnection.bind(this));
        socket.on("error", function (err) {
            eventHandlers.error.forEach(function (f) { f(err); });
            if (err.code == "ECONNREFUSED") { socket.connect(_port, _ip); }
        });

        socket.listen(_port, _ip);
    };

    this.close = function () {
        this.isListening = false;
        socket.close();
        eventHandlers.close.forEach(function (f) { f(); });
    };

    this.isConnected = false;
    this.isListening = false;

    return this;

}