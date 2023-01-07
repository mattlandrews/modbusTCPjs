"use strict";

const { Server } = require("net");
const { isArray } = require("util");
const modbusTCPServerSocket = require("../modbusTCPServerSocket.js");
const MODBUS = require("./modbus.js");

module.exports = function () {

    let server = new Server();
    let modbus = new MODBUS();

    let readHoldingRegistersCallback = null;
    let writeHoldingRegistersCallback = null;
    let connectCallback = null;
    let disconnectCallback = null;

    this.host = "127.0.0.1";
    this.port = 502;

    this.connections = [];

    this.stats = {
        totalConnections: 0,
        totalDisconnections: 0
    }

    this.listen = function () {
        return new Promise((resolve, reject) => {
            server.on("error", reject);
            server.listen({ port: this.port, host: this.host }, () => {
                server.off("error", reject);
                server.on("error", serverError);
                server.on("connection", serverConnect.bind(this));
                resolve();
            });
        });
    }

    this.on = function (event, callback) {
        
        if (event === "readHoldingRegisters") { readHoldingRegistersCallback = callback; }
        else if (event === "writeHoldingRegisters") { writeHoldingRegistersCallback = callback; }
        else if (event === "connect") { connectCallback = callback; }
        else if (event === "disconnect") { disconnectCallback = callback; }
    }

    function serverError (err) {
        throw err;
    }

    function serverConnect (socket) {
        let connection = new modbusTCPServerSocket(socket);
        this.connections.push(connection);
        this.stats.totalConnections++;
        if (typeof connectCallback === "function") { connectCallback(connection); }
        connection.socket.on("data", serverData.bind(connection));
        connection.socket.on("close", serverDisconnect.bind(this, connection));
    }

    function serverEnd () {
        this.end();
    }

    function serverDisconnect (connection) {
        this.connections = this.connections.filter((d)=>{ 
            return (d.socket.remoteAddress !== connection.socket.remoteAddress)
                || (d.socket.remotePort !== connection.socket.remotePort)
                || (d.socket.localAddress !== connection.socket.localAddress);
        });
        this.stats.totalDisconnections++;
        if (typeof disconnectCallback === "function") { disconnectCallback(); }
    }

    function serverData (data) {
        let request = new MODBUS();
        let socket = this.socket;
        request.fromBuffer(data);
        if ((request.type === "readHoldingRegistersRequest") && (readHoldingRegistersCallback != null)) {
            this.stats.numTotalRequests++;
            readHoldingRegistersCallback(request, (data) => {
                if (typeof data === "number") { data = [data]; }
                else if (Array.isArray(data)) {
                    let response = new MODBUS();
                    response.mbap.transaction = request.mbap.transaction;
                    response.mbap.protocol = request.mbap.protocol;
                    response.mbap.byteLength = (3 + (data.length * 2));
                    response.device = request.device;
                    response.functionCode = request.functionCode;
                    response.type = "readHoldingRegistersResponse";
                    response.dataLength = (data.length * 2);
                    response.data = data;
                    if ((socket.readyState === "open") || (socket.readyState === "writeOnly")) { socket.write(response.toBuffer()); }
                }
                else {
                    this.stats.numTotalErrors++;
                    let exception = new MODBUS();
                    exception.mbap.transaction = request.mbap.transaction;
                    exception.mbap.protocol = request.mbap.protocol;
                    exception.mbap.byteLength = 3;
                    exception.device = request.device;
                    exception.functionCode = 131;
                    exception.type = "readHoldingRegistersException";
                    exception.exceptionCode = 2
                    if ((socket.readyState === "open") || (socket.readyState === "writeOnly")) { socket.write(exception.toBuffer()); }
                }
            });
        }
        if ((request.type === "writeHoldingRegistersRequest") && (writeHoldingRegistersCallback != null)) {
            this.stats.numTotalRequests++;
            writeHoldingRegistersCallback(request, () => {
                let response = new MODBUS();
                response.mbap.transaction = request.mbap.transaction;
                response.mbap.protocol = request.mbap.protocol;
                response.mbap.byteLength = 6;
                response.device = request.device;
                response.functionCode = request.functionCode;
                response.type = "writeHoldingRegistersResponse";
                response.address = request.address;
                response.numAddresses = request.numAddresses;
                socket.write(response.toBuffer());
            });
        }
    }

    return this;
}
