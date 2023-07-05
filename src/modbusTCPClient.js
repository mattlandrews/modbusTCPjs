"use strict";

const { Socket } = require("net");
const { isArray } = require("util");
const MODBUS = require("./modbus.js");

module.exports = function () {

    this.socket = new Socket();
    this.modbus = new MODBUS();
    this.host = "127.0.0.1";
    this.port = 50200;
    this.state = "closed";

    this.readHoldingRegisters = function (transaction, device, readAddress, readLength) {
        return new Promise(async (resolve, reject) => {
            if (this.state === "closed") {
                this.state = "connecting"
                this.socket.on("error", reject);
                this.socket.on("data", (buffer) => {
                    this.state = "connected";
                    this.socket.listeners("error").forEach((d) => { this.socket.off("error", d); });
                    this.socket.listeners("data").forEach((d) => { this.socket.off("data", d); });
                    let reply = this.modbus.fromBuffer(buffer);
                    resolve(reply.data);
                });
                this.socket.connect(this.port, this.host, () => {
                    let query = new this.modbus.readHoldingRegistersRequest(transaction, device, readAddress, readLength);
                    this.socket.write(query.getBuffer());
                });
            }
            else if (this.state === "connected") {
                this.state = "awaitingReply";
                this.socket.on("error", reject);
                this.socket.on("data", (buffer) => {
                    this.state = "connected";
                    this.socket.listeners("error").forEach((d) => { this.socket.off("error", d); });
                    this.socket.listeners("data").forEach((d) => { this.socket.off("data", d); });
                    let reply = this.modbus.fromBuffer(buffer);
                    resolve(reply.data);
                });
                let query = new this.modbus.readHoldingRegistersRequest(transaction, device, readAddress, readLength);
                this.socket.write(query.getBuffer());
            }
            else resolve();
        });
    }

    return this;
}

/*
    let readHoldingRegistersCallback = defaultReadHoldingRegistersCallback;
    let writeHoldingRegistersCallback = defaultWriteHoldingRegistersCallback;
    let connectCallback = null;
    let disconnectCallback = null;

    this.host = "127.0.0.1";
    this.port = 502;
    this.sockets = [];
    this.stats = {
        public: {
            numberOfActiveConnections: 0,
            totalNumberOfRequests: 0,
            numberOfRequestsPerSecond: 0,
            totalNumberOfReadHoldingRegistersRequests: 0,
            totalNumberOfWriteHoldingRegistersRequests: 0,
            totalNumberOfConnectionEvents: 0,
            totalNumberOfDisconnectionEvents: 0,
            totalNumberOfErrors: 0,
        },
        private: {
            dNumberOfRequests: 0
        }
    };
    this.errors = [];

    function defaultReadHoldingRegistersCallback (request, callback) {
        callback();
    }

    function defaultWriteHoldingRegistersCallback (request, callback) {
        callback();
    }

    function serverConnected (socket) {
        socket.on("error", (err) => {
            if (err.code === "ECONNRESET") { 
                (serverDisconnected.bind(this, socket))();
                socket.destroy();
            }
            else { throw err; } });
        socket.on("data", serverData.bind(this, socket));
        socket.on("end", serverDisconnected.bind(this, socket));
        this.sockets.push(socket);
        this.stats.public.totalNumberOfConnectionEvents++;
        if (typeof connectCallback === "function") { connectCallback(socket); }
    }

    function serverDisconnected (socket) {
        this.sockets = this.sockets.filter((d)=>{
            return (d.remoteAddress !== socket.remoteAddress)
                || (d.remotePort !== socket.remotePort)
                || (d.localAddress !== socket.localAddress);
        });
        this.stats.public.totalNumberOfDisconnectionEvents++;
        if (typeof disconnectCallback === "function") { disconnectCallback(socket); }
    }

    function serverData (socket, buffer) {
        try {
            let query = modbus.fromBuffer(buffer);
            if (query.getType() === "readHoldingRegistersRequest") {
                this.stats.public.totalNumberOfRequests++;
                this.stats.public.totalNumberOfReadHoldingRegistersRequests++;
                readHoldingRegistersCallback(query, (data) => {
                    let reply;
                    if (Array.isArray(data)) { reply = new modbus.readHoldingRegistersReply(query.getTransaction(), query.getDevice(), data); }
                    else { reply = new modbus.readHoldingRegistersException(query.getTransaction(), query.getDevice(), 2); }
                    if ((socket.readyState === "open") || (socket.readyState === "writeOnly")) { socket.write(reply.buffer); }
                });
            }
            else if (query.getType() === "writeHoldingRegistersRequest") {
                this.stats.public.totalNumberOfRequests++;
                this.stats.public.totalNumberOfWriteHoldingRegistersRequests++;
                writeHoldingRegistersCallback(query, (success) => {
                    let reply;
                    if (success) { reply = new modbus.writeHoldingRegistersReply(query.getTransaction(), query.getDevice(), query.getWriteAddress(), query.getWriteLength()); }
                    else { reply = new modbus.writeHoldingRegistersException(query.getTransaction(), query.getDevice(), 2); }
                    if ((socket.readyState === "open") || (socket.readyState === "writeOnly")) { socket.write(reply.buffer); }
                });
            }
        }
        catch (err) {
            this.stats.public.totalNumberOfErrors++;
            this.errors.push(err);
        }
    }

    function calculateStats () {
        this.stats.public.numberOfActiveConnections = this.sockets.length;
        this.stats.public.numberOfRequestsPerSecond = (this.stats.public.totalNumberOfRequests - this.stats.private.dNumberOfRequests);
        this.stats.private.dNumberOfRequests = this.stats.public.totalNumberOfRequests;
    }

    this.on = function (event, callback) {
        if (typeof callback !== "function") { throw new Error("invalid callback function"); }
        else if (event === "readHoldingRegisters") { readHoldingRegistersCallback = callback; }
        else if (event === "writeHoldingRegisters") { writeHoldingRegistersCallback = callback; }
    }

    this.listen = function () {
        setInterval(calculateStats.bind(this), 1000);
        return new Promise((resolve, reject) => {
            server.on("error", reject);
            server.listen({ port: this.port, host: this.host }, () => {
                server.off("error", reject);
                server.on("error", (err) => { throw err; });
                server.on("connection", serverConnected.bind(this));
                resolve();
            });
        });
    }

    this.getConnections = function () {
        return sockets;
    }

    this.getStats = function () {
        return this.stats.public;
    }

    this.getErrors = function () {
        return this.errors;
    }

    return this;
}
*/