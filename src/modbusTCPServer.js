"use strict";

const { Server } = require("net");
const { isArray } = require("util");
const modbusTCPServerSocket = require("./modbusTCPServerSocket.js");
const MODBUS = require("./modbus.js");

module.exports = function () {

    let server = new Server();
    let modbus = new MODBUS();

    let readHoldingRegistersCallback = null;
    let writeHoldingRegistersCallback = null;
    let readWriteHoldingRegistersCallback = null;
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
        else if (event === "readWriteHoldingRegisters") { readWriteHoldingRegistersCallback = callback; }
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
        if ((request.type == "readHoldingRegistersRequest") && (readHoldingRegistersCallback != null)) {
            this.stats.numTotalRequests++;
            readHoldingRegistersCallback( request, (data) => {
                let response = new MODBUS();
                if (Array.isArray(data)) {
                    response.readHoldingRegistersReply( request.transaction, request.device, data );
                }
                else {
                    response.readHoldingRegistersException( request.transaction, request.device, 2 );
                }
                if ((socket.readyState === "open") || (socket.readyState === "writeOnly")) { socket.write(response.toBuffer()); }
            });
        }
        if ((request.type == "writeHoldingRegistersRequest") && (writeHoldingRegistersCallback != null)) {
            this.stats.numTotalRequests++;
            readHoldingRegistersCallback( request, (data) => {
                let response = new MODBUS();
                if (Array.isArray(data)) {
                    response.writeHoldingRegistersReply()
                }
                else {
                    response.writeHoldingRegistersException( request.transaction, request.device, 2 );
                }
                if ((socket.readyState === "open") || (socket.readyState === "writeOnly")) { socket.write(response.toBuffer()); }
            });
        }
        else if ((request.type === "writeHoldingRegistersRequest") && (writeHoldingRegistersCallback != null)) {
            this.stats.numTotalRequests++;
            writeHoldingRegistersCallback(request, () => {
                let response = new MODBUS();
                response.transaction = request.transaction;
                response.protocol = 0;
                response.queryLength = 6;
                response.device = request.device;
                response.functionCode = request.functionCode;
                response.type = "writeHoldingRegistersReply";
                response.writeAddress = request.writeAddress;
                response.writeLength = request.writeLength;
                socket.write(response.toBuffer());
            });
        }
        else if ((request.type === "readWriteHoldingRegistersRequest") && (readWriteHoldingRegistersCallback != null)) {
            this.stats.numTotalRequests++;
            readWriteHoldingRegistersCallback(request, (data) => {
                if (Array.isArray(data)) {
                    let response = new MODBUS();
                    response.transaction = request.transaction;
                    response.queryLength = (3 + (data.length * 2));
                    response.device = request.device;
                    response.functionCode = request.functionCode;
                    response.type = "readWriteHoldingRegistersReply";
                    response.data = data;
                    socket.write(response.toBuffer());
                }
            });
        }
    }

    return this;
}
