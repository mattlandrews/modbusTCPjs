"use strict";

const { Server } = require("net");
const { isArray } = require("util");
const MODBUS = require("./modbus.js");

module.exports = function () {

    let server = new Server();
    let modbus = new MODBUS();
    let sockets = [];

    let readHoldingRegistersCallback = defaultReadHoldingRegistersCallback;
    let writeHoldingRegistersCallback = defaultWriteHoldingRegistersCallback;
    let connectCallback = null;
    let disconnectCallback = null;

    this.host = "127.0.0.1";
    this.port = 502;

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
        sockets.push(socket);
        if (typeof connectCallback === "function") { connectCallback(socket); }
    }

    function serverDisconnected (socket) {
        sockets = sockets.filter((d)=>{
            return (d.remoteAddress !== socket.remoteAddress)
                || (d.remotePort !== socket.remotePort)
                || (d.localAddress !== socket.localAddress);
        });
        if (typeof disconnectCallback === "function") { disconnectCallback(socket); }
    }

    function serverData (socket, buffer) {
        let query = modbus.fromBuffer(buffer);
        if (query.getType() === "readHoldingRegistersRequest") {
            readHoldingRegistersCallback(query, (data) => {
                let reply;
                if (Array.isArray(data)) { reply = new modbus.readHoldingRegistersReply(query.getTransaction(), query.getDevice(), data); }
                else { reply = new modbus.readHoldingRegistersException(query.getTransaction(), query.getDevice(), 2); }
                if ((socket.readyState === "open") || (socket.readyState === "writeOnly")) { socket.write(reply.buffer); }
            });
        }
        else if (query.getType() === "writeHoldingRegistersRequest") {
            writeHoldingRegistersCallback(query, (success) => {
                let reply;
                if (success) { reply = new modbus.writeHoldingRegistersReply(query.getTransaction(), query.getDevice(), query.getWriteAddress(), query.getWriteLength()); }
                else { reply = new modbus.writeHoldingRegistersException(query.getTransaction(), query.getDevice(), 2); }
                if ((socket.readyState === "open") || (socket.readyState === "writeOnly")) { socket.write(reply.buffer); }
            });
        }
    }

    this.on = function (event, callback) {
        if (typeof callback !== "function") { throw new Error("invalid callback function"); }
        else if (event === "readHoldingRegisters") { readHoldingRegistersCallback = callback; }
        else if (event === "writeHoldingRegisters") { writeHoldingRegistersCallback = callback; }
    }

    this.listen = function () {
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

    return this;
}
